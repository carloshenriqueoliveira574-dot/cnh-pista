import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const PRICE_BRL = 19.9;
const APP_URL = "https://carloshenriqueoliveira574-dot.github.io/cnh-pista/";

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
  const mpToken = Deno.env.get("MP_ACCESS_TOKEN");
  if (!mpToken) {
    return json({ error: "Mercado Pago não configurado" }, 500);
  }

  const mpRes = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${mpToken}`,
    },
    body: JSON.stringify({
      reason: "CNH Pista Premium",
      external_reference: user.id,
      payer_email: user.email,
      back_url: `${APP_URL}?mp=return`,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: PRICE_BRL,
        currency_id: "BRL",
      },
      status: "pending",
    }),
  });

  const mpData = await mpRes.json();

  if (!mpRes.ok) {
    return json({ error: mpData }, 400);
  }

  const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  await supabaseAdmin
    .from("profiles")
    .update({ mp_subscription_id: mpData.id, mp_subscription_status: mpData.status })
    .eq("id", user.id);

  return json({ init_point: mpData.init_point });
});
