-- Prislås pr. virksomhed: når en kunde tegner abonnement, gemmes det specifikke
-- Stripe price_id på rækken. Hvis kunden senere re-tilmelder sig (fx efter
-- kort-lapse eller opsigelse) bruger checkout-funktionen det gemte price_id
-- frem for det aktuelle "nye kunder"-price_id — så den oprindelige pris er låst
-- så længe virksomheden eksisterer.

alter table public.subscriptions
  add column if not exists stripe_price_id text;

comment on column public.subscriptions.stripe_price_id is
  'Det Stripe Price-objekt kunden er låst til. Bruges af stripe-checkout til at genbruge den oprindelige pris ved re-tilmelding.';
