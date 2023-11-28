INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at") VALUES
	('00000000-0000-0000-0000-000000000000', '00000000-285f-4bc5-b0b4-3f625cc266da', 'authenticated', 'authenticated', 'hoge@mail.como', crypt('CEwkVf3ddQ4j', gen_salt('bf')), '2023-10-09 10:18:25.090068+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-10-09 23:02:03.964702+00', '{"user_name": "hoge"}', NULL, NULL, '2023-10-09 10:18:25.090068+00', '2023-10-11 13:58:23.145385+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('11111111-0000-0000-0000-000000000000', '11111111-285f-4bc5-b0b4-3f625cc266da', 'authenticated', 'authenticated', 'fuga@mail.como', crypt('aC5xJdW3Qk3E', gen_salt('bf')), '2023-10-09 10:18:25.090068+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-10-09 23:02:03.964702+00', '{"user_name": "fuga"}', NULL, NULL, '2023-10-09 10:18:25.090068+00', '2023-10-11 13:58:23.145385+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL);

INSERT INTO "public"."todos" ("id", "user_id", "todo_name", "is_done", "created_at", "updated_at") VALUES
	('18164bbb-1e8b-4867-8afb-588ceae871d3', '00000000-285f-4bc5-b0b4-3f625cc266da', 'hoge', false, '2023-11-26 12:24:46.616396', '2023-11-26 12:24:46.616396'),
	('774dc4b1-3aac-434a-9194-daa7cc50bb4d', '11111111-285f-4bc5-b0b4-3f625cc266da', 'fuga', false, '2023-11-26 12:24:56.838078', '2023-11-26 12:24:56.838078');