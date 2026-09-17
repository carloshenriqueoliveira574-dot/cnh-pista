import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const PRICE_BRL = 19.9;
const APP_URL = "https://carloshenriqueoliveira574-dot.github.io/cnh-pista/";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "missing auth" }), { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return new Response(JSON.stringify({ error: "invalid session" }), { status: 401 });
  }

  const user = userData.user;
  const mpToken = Deno.env.get("MP_ACCESS_TOKEN");
  if (!mpToken) {
    return new Response(JSON.stringify({ error: "Mercado Pago não configurado" }), { status: 500 });
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
    return new Response(JSON.stringify({ error: mpData }), { status: 400 });
  }

  const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  await supabaseAdmin
    .from("profiles")
    .update({ mp_subscription_id: mpData.id, mp_subscription_status: mpData.status })
    .eq("id", user.id);

  return new Response(JSON.stringify({ init_point: mpData.init_point }), {
    headers: { "Content-Type": "application/json" },
  });
});
