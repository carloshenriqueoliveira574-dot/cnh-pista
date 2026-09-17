-- CNH Pista — passo 1 do backend: schema inicial
-- profiles, questions, e progresso do usuário (diagnóstico, estudo, simulados, macetes)
-- projeto: kfvqaklqencuwdtuqfey (cnh-pista)

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  exam_timing text,
  estado text,
  study_level text,
  premium boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: select own" on public.profiles
  for select using ((select auth.uid()) = id);

create policy "profiles: update own" on public.profiles
  for update using ((select auth.uid()) = id);

create policy "profiles: insert own" on public.profiles
  for insert with check ((select auth.uid()) = id);

-- assinatura (premium, mp_subscription_*) via projeto real / preapproval do
-- Mercado Pago — ver seção mais abaixo e migração restrict_profile_column_updates
alter table public.profiles
  add column mp_subscription_id text,
  add column mp_subscription_status text;

-- só o service role (Edge Functions) pode alterar campos de assinatura;
-- o próprio usuário só edita os campos de onboarding, nunca premium/mp_*
-- (bloqueia mass assignment de "premium" via chamada direta ao client)
revoke update on public.profiles from authenticated;
grant update (display_name, exam_timing, estado, study_level) on public.profiles to authenticated;

-- auto-cria um profile quando um usuário se cadastra
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- só o trigger deve chamar essa função — não expor via PostgREST
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ---------- questions ----------
create table public.questions (
  id text primary key,
  category text not null,
  prompt text not null,
  scene text not null default 'generic',
  scene_variant text,
  options jsonb not null,
  correct_index int not null,
  lead text not null,
  explanation text not null,
  trap text not null,
  wrong_notes jsonb not null default '{}'::jsonb,
  macete_quote text not null,
  macete_hint text not null,
  created_at timestamptz not null default now()
);

alter table public.questions enable row level security;

create policy "questions: readable by any authenticated user" on public.questions
  for select using ((select auth.role()) = 'authenticated');

-- ---------- diagnostic attempts ----------
create table public.diagnostic_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null,
  overall_pct int not null,
  weak_category text,
  strong_category text,
  created_at timestamptz not null default now()
);

alter table public.diagnostic_attempts enable row level security;

create policy "diagnostic_attempts: own rows" on public.diagnostic_attempts
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create index diagnostic_attempts_user_idx on public.diagnostic_attempts (user_id);

-- ---------- study answers (estudo + revisão) ----------
create table public.study_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references public.questions(id),
  correct boolean not null,
  answered_at timestamptz not null default now()
);

alter table public.study_answers enable row level security;

create policy "study_answers: own rows" on public.study_answers
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create index study_answers_user_idx on public.study_answers (user_id, answered_at desc);
create index study_answers_question_idx on public.study_answers (question_id);

-- ---------- simulados ----------
create table public.simulados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  correct int not null,
  total int not null,
  elapsed_seconds int not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.simulados enable row level security;

create policy "simulados: own rows" on public.simulados
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create index simulados_user_idx on public.simulados (user_id, created_at desc);

-- ---------- macetes desbloqueados ----------
create table public.macetes_unlocked (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references public.questions(id),
  category text not null,
  quote text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

alter table public.macetes_unlocked enable row level security;

create policy "macetes_unlocked: own rows" on public.macetes_unlocked
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create index macetes_unlocked_question_idx on public.macetes_unlocked (question_id);
