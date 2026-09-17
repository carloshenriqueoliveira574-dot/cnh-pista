import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "missing auth" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return json({ error: "invalid session" }, 401);
  }

  const user = userData.user;
  const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("mp_subscription_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.mp_subscription_id) {
    return json({ error: "Nenhuma assinatura encontrada para esta conta" }, 404);
  }

  const mpToken = Deno.env.get("MP_ACCESS_TOKEN");
  if (!mpToken) {
    return json({ error: "Mercado Pago não configurado" }, 500);
  }

  const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${profile.mp_subscription_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${mpToken}` },
    body: JSON.stringify({ status: "cancelled" }),
  });

  const mpData = await mpRes.json();
  if (!mpRes.ok) {
    return json({ error: mpData }, 400);
  }

  await supabaseAdmin
    .from("profiles")
    .update({ premium: false, mp_subscription_status: mpData.status ?? "cancelled" })
    .eq("id", user.id);

  return json({ ok: true });
});
