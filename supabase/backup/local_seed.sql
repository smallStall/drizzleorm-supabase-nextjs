--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.4 (Ubuntu 15.4-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at") VALUES
	('00000000-0000-0000-0000-000000000000', '00000000-285f-4bc5-b0b4-3f625cc266da', 'authenticated', 'authenticated', 'hoge@mail.como', '$2a$06$tN7WHqH5jtCM7a15ftPA6OLDx13cQ2CnALIlllm/DDSA2Htg6r6W2', '2023-10-09 10:18:25.090068+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-10-09 23:02:03.964702+00', '{"user_name": "smallStall"}', NULL, NULL, '2023-10-09 10:18:25.090068+00', '2023-10-11 13:58:23.145385+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', '11111111-285f-4bc5-b0b4-3f625cc266da', 'authenticated', 'authenticated', 'fuga@mail.como', '$2a$06$cEzJuV3MKC.3QVbEqbr0KueRD51P93x0ricRf0JTuyl47/ZA9RI.W', '2023-10-09 10:18:25.090068+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-10-09 23:02:03.964702+00', '{"user_name": "smallStall"}', NULL, NULL, '2023-10-09 10:18:25.090068+00', '2023-10-11 13:58:23.145385+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "user_id", "user_name", "created_at", "updated_at") VALUES
	('8b568679-ef50-4d47-bfc0-a08d46b337fc', '00000000-285f-4bc5-b0b4-3f625cc266da', 'hoge', '2023-11-26 12:23:29.144758', '2023-11-26 12:23:29.144758'),
	('2d2cb82f-3032-49fd-9138-0b2a34a2d721', '11111111-285f-4bc5-b0b4-3f625cc266da', 'fuga', '2023-11-26 12:23:29.144758', '2023-11-26 12:23:29.144758');


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."todos" ("id", "user_id", "todo_name", "is_done", "created_at", "updated_at") VALUES
	('18164bbb-1e8b-4867-8afb-588ceae871d3', '00000000-285f-4bc5-b0b4-3f625cc266da', 'hoge', false, '2023-11-26 12:24:46.616396', '2023-11-26 12:24:46.616396'),
	('774dc4b1-3aac-434a-9194-daa7cc50bb4d', '11111111-285f-4bc5-b0b4-3f625cc266da', 'fuga', false, '2023-11-26 12:24:56.838078', '2023-11-26 12:24:56.838078');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
