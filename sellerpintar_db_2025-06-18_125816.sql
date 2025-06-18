--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Status" AS ENUM (
    'todo',
    'in_progress',
    'done'
);


ALTER TYPE public."Status" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Membership; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Membership" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "projectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Membership" OWNER TO postgres;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    name text NOT NULL,
    "ownerId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- Name: Task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    status public."Status" DEFAULT 'todo'::public."Status" NOT NULL,
    "projectId" text NOT NULL,
    "assigneeId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Task" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Membership; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Membership" (id, "userId", "projectId", "createdAt", "updatedAt") FROM stdin;
b640bdd4-2874-42f4-9b2a-1dc1acba6b26	b07b4770-1f93-4eb9-a08f-e49172e3fabf	187941a3-19cf-401b-8276-811a343d0d19	2025-06-17 02:44:09.587	2025-06-17 02:44:09.587
2fc4cf36-e719-4cf1-aab0-e4069a674c65	02594f30-3b23-4206-8ff3-4dc8292a843b	187941a3-19cf-401b-8276-811a343d0d19	2025-06-17 02:44:16.338	2025-06-17 02:44:16.338
7a0a6fb1-1c6e-435d-9f12-7288b320e5cb	ae9698fd-c84d-43f5-8577-a6969cb9e897	8b05c167-b8c5-4754-ab26-b3d6755b1c5a	2025-06-17 02:50:27.889	2025-06-17 02:50:27.889
13e9b3e7-bf31-4288-87ef-11056e6ec484	026f7b32-9e6e-4188-aeb1-ed2482ffb3e1	187941a3-19cf-401b-8276-811a343d0d19	2025-06-18 00:21:05.48	2025-06-18 00:21:05.48
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, name, "ownerId", "createdAt", "updatedAt") FROM stdin;
187941a3-19cf-401b-8276-811a343d0d19	E-Commerce	ae9698fd-c84d-43f5-8577-a6969cb9e897	2025-06-17 02:43:11.199	2025-06-17 02:43:11.199
8b05c167-b8c5-4754-ab26-b3d6755b1c5a	Website Profile Perusahaan	02594f30-3b23-4206-8ff3-4dc8292a843b	2025-06-17 02:47:03.56	2025-06-17 02:47:03.56
3c4b2a87-45d0-4387-91c6-44d2dad92388	Sistem Informasi Inventory 	ae9698fd-c84d-43f5-8577-a6969cb9e897	2025-06-17 14:38:48.714	2025-06-17 14:38:48.714
434e2055-03a5-4542-8a03-921955245ea9	Loundry Online	ae9698fd-c84d-43f5-8577-a6969cb9e897	2025-06-17 14:39:19.992	2025-06-17 14:39:19.992
36428232-69c2-4457-900f-eca9e4e58d67	Exchange Bitcoin	ae9698fd-c84d-43f5-8577-a6969cb9e897	2025-06-17 02:43:01.895	2025-06-18 00:05:09.123
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, title, description, status, "projectId", "assigneeId", "createdAt", "updatedAt") FROM stdin;
2cc07e69-f27e-453c-b95c-a97e5887b8b4	Integrasikan API	integrasikan form tambah barang ke API /tambah/barang	in_progress	187941a3-19cf-401b-8276-811a343d0d19	ae9698fd-c84d-43f5-8577-a6969cb9e897	2025-06-18 02:56:25.029	2025-06-18 04:05:32.24
8af610e9-6f45-4087-8c31-c53c98a53ddf	Buat UI Form	buat ui form untuk data barang input per orang	done	187941a3-19cf-401b-8276-811a343d0d19	ae9698fd-c84d-43f5-8577-a6969cb9e897	2025-06-18 02:50:42.678	2025-06-18 04:05:35.226
75f6833c-9a3b-4858-b8ef-57442acef1f1	Membuat Header	buatkan header untuk website	todo	8b05c167-b8c5-4754-ab26-b3d6755b1c5a	\N	2025-06-17 03:33:43.441	2025-06-18 02:27:23.341
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, "createdAt", "updatedAt") FROM stdin;
ae9698fd-c84d-43f5-8577-a6969cb9e897	toni@gmail.com	$2b$10$E68KzgYZoWusbhYC1vrqxunaRGdFapa2vebAYK3oumoiRSuJ3Qia2	2025-06-17 00:59:41.238	2025-06-17 00:59:41.238
02594f30-3b23-4206-8ff3-4dc8292a843b	dinda@gmail.com	$2b$10$SEBGO72nwu8MSHMdEnXOFufBf4NNPIiF3PoPwpN/tEBHxWh05IraG	2025-06-17 01:49:16.039	2025-06-17 01:49:16.039
b07b4770-1f93-4eb9-a08f-e49172e3fabf	reno@gmail.com	$2b$10$MeTvHVBfYwbfW7Wpx7EBL.A77doutqX.iogePjkmg7j9NQt9oVPdW	2025-06-17 01:49:35.681	2025-06-17 01:49:35.681
f302982d-cdfd-42ed-a2d8-a3b94601a17c	nauval@gmail.com	$2b$10$gu5tIBR0LsMIHxm/2azc2u993ZJzbH1ugI8x43LqTGWxMlovL3LUC	2025-06-17 01:49:44.946	2025-06-17 01:49:44.946
026f7b32-9e6e-4188-aeb1-ed2482ffb3e1	miranda@gmail.com	$2b$10$inOT9VTjHJpXuUDSeB1TY.fcENffUhUEuwY4U5aRA9FKS00hUEl3e	2025-06-17 06:45:01.31	2025-06-17 06:45:01.31
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
595e965a-2abc-4ff7-a761-c5dc1b734f17	36d9dc13249a558211bb9b725d8e5088745b7f9a0e501f88c98ce4f6add76552	2025-06-17 07:43:36.148798+07	20250617004335_init	\N	\N	2025-06-17 07:43:36.087878+07	1
\.


--
-- Name: Membership Membership_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Membership"
    ADD CONSTRAINT "Membership_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Membership Membership_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Membership"
    ADD CONSTRAINT "Membership_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Membership Membership_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Membership"
    ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Project Project_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Task Task_assigneeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Task Task_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

