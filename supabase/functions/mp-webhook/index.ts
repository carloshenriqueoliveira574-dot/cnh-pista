import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch (_e) {
    // some Mercado Pago notifications only carry query params
  }

  const notificationType = (body.type as string) ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const preapprovalId =
    (body.data as { id?: string } | undefined)?.id ?? url.searchParams.get("id") ?? url.searchParams.get("data.id");

  if (notificationType !== "preapproval" && notificationType !== "subscription_preapproval") {
    return new Response("ignored", { status: 200 });
  }
  if (!preapprovalId) {
    return new Response("missing id", { status: 200 });
  }

  const mpToken = Deno.env.get("MP_ACCESS_TOKEN")!;
  const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
    headers: { Authorization: `Bearer ${mpToken}` },
  });
  const preapproval = await mpRes.json();

  if (!mpRes.ok || !preapproval.external_reference) {
    return new Response("mp lookup failed", { status: 200 });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  await supabase
    .from("profiles")
    .update({
      premium: preapproval.status === "authorized",
      mp_subscription_id: preapprovalId,
      mp_subscription_status: preapproval.status,
    })
    .eq("id", preapproval.external_reference);

  return new Response("ok", { status: 200 });
});
