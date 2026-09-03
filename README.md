# CNH Pista

App de estudo para a prova teórica do DETRAN (CNH), direção visual "Pista" (dark mode, acento âmbar). React + Vite no front-end, Supabase (Postgres + Auth) no backend.

## Stack

- React 19 + Vite, CSS Modules
- Supabase: Postgres com RLS, Auth por código OTP de e-mail
- Projeto Supabase: `cnh-pista` (`kfvqaklqencuwdtuqfey`, região `sa-east-1`)

## Rodando localmente

```bash
cd app
npm install
cp .env.example .env   # preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

As chaves do Supabase (URL + anon/publishable key) estão disponíveis no painel do projeto em supabase.com/dashboard, em Project Settings → API.

## Banco de dados

- `supabase-schema.sql` — schema completo (tabelas, RLS, índices, trigger de signup). Já aplicado no projeto Supabase.
- `supabase-seed-questions.sql` — seed do banco de questões (24 perguntas, 6 categorias). Já aplicado.

Esses arquivos documentam o estado do banco — não precisam ser reaplicados a menos que o projeto Supabase seja recriado do zero.

## Estrutura

- `app/src/screens/` — telas do fluxo (Login, Onboarding, Diagnóstico, Home, Question/Correct/Error/Macete, Simulado, Revisão, Perfil...)
- `app/src/data/questions.js` — banco de questões local (fallback caso o Supabase não esteja configurado)
- `app/src/lib/supabaseClient.js` — cliente Supabase
- `app/src/lib/backend.js` — funções de leitura/escrita no Supabase (perguntas, progresso, onboarding, macetes, simulados)
- `app/src/App.jsx` — state machine principal do fluxo

## Status

MVP em desenvolvimento. Login real (OTP por e-mail) e persistência de progresso no Supabase já funcionando. Pagamento/assinatura ainda não integrado.
