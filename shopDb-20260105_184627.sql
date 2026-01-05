--
-- PostgreSQL database dump
--

\restrict gU8w6m3Jxi7DdmKL8kbNePrdqgog1C3WngKuSwh266fauAAcS9rDQztFdBMHVnt

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id text NOT NULL,
    category_name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    contact_id text NOT NULL,
    contact_name text NOT NULL,
    contact_mobile text,
    contact_email text,
    contact_address text,
    contact_type text DEFAULT 'Customer'::text,
    credit_limit numeric(18,4) DEFAULT 0,
    payable_balance numeric(18,4) DEFAULT 0,
    advance_balance numeric(18,4) DEFAULT 0,
    current_balance numeric(18,4) DEFAULT 0,
    shop_id text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id text NOT NULL,
    product_code text,
    product_name text NOT NULL,
    product_desc text,
    category_id text NOT NULL,
    small_unit_id text NOT NULL,
    unit_difference_qty integer DEFAULT 1,
    large_unit_id text NOT NULL,
    stock_qty numeric(18,4) DEFAULT 0,
    purchase_price numeric(18,4) DEFAULT 0,
    sales_price numeric(18,4) DEFAULT 0,
    discount_percent numeric(10,4) DEFAULT 0,
    vat_percent numeric(10,4) DEFAULT 0,
    cost_price_percent numeric(10,4) DEFAULT 0,
    margin_price numeric(18,4) DEFAULT 0,
    purchase_booking_qty numeric(18,4) DEFAULT 0,
    sales_booking_qty numeric(18,4) DEFAULT 0,
    shop_id text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: shops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shops (
    shop_id text NOT NULL,
    shop_name text NOT NULL,
    shop_address text,
    bin_no text,
    open_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.shops OWNER TO postgres;

--
-- Name: units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.units (
    unit_id text NOT NULL,
    unit_name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.units OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id text NOT NULL,
    user_email text NOT NULL,
    user_password text NOT NULL,
    user_mobile text,
    user_name text,
    recovery_code text,
    user_role text DEFAULT 'User'::text,
    shop_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (category_id, category_name, created_at, updated_at) FROM stdin;
02042ba0-bb87-47cb-86d4-ea73c17f7be7	Grocery	2026-01-05 16:24:36.052913	2026-01-05 16:24:36.052913
091b2186-79a7-481a-9163-1ec2224140a5	Juice and Drinks	2026-01-05 16:24:40.573119	2026-01-05 16:24:40.573119
31e1c7ed-e156-42f7-92a3-bca452660fe6	Bakery and Biscuit	2026-01-05 16:24:52.596852	2026-01-05 16:24:52.596852
73c8fca7-5202-41fa-9fac-016b93c136ef	Rice and Dals	2026-01-05 16:24:45.429083	2026-01-05 16:25:07.33707
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (contact_id, contact_name, contact_mobile, contact_email, contact_address, contact_type, credit_limit, payable_balance, advance_balance, current_balance, shop_id, created_at, updated_at) FROM stdin;
aa29157d-f375-44ab-af60-ff369b25493d	Supplier 1	01722688266	admin@sgd.com	Badda, Dhaka	Supplier	500.0000	0.0000	0.0000	0.0000	eb690134-4763-4a80-99c8-9717f67108c1	2026-01-05 15:05:15.503344	2026-01-05 15:05:22.604812
57051eaf-1097-4c24-b729-24c9f044a98a	Customer 1	01722688266	admin@sgd.com	Badda, Dhaka	Customer	500.0000	0.0000	0.0000	0.0000	eb690134-4763-4a80-99c8-9717f67108c1	2026-01-05 14:58:26.768404	2026-01-05 15:05:30.098081
both	Both A/C	123456			Both	0.0000	0.0000	0.0000	0.0000	eb690134-4763-4a80-99c8-9717f67108c1	2026-01-05 15:09:55.08606	2026-01-05 15:09:55.08606
internal	Internal A/C	123456			Customer	0.0000	0.0000	0.0000	0.0000	eb690134-4763-4a80-99c8-9717f67108c1	2026-01-05 15:08:15.081831	2026-01-05 15:12:20.135684
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, product_code, product_name, product_desc, category_id, small_unit_id, unit_difference_qty, large_unit_id, stock_qty, purchase_price, sales_price, discount_percent, vat_percent, cost_price_percent, margin_price, purchase_booking_qty, sales_booking_qty, shop_id, created_at, updated_at) FROM stdin;
e08bba93-5ca3-4548-9bc1-62a7d525f268	P001	Rice BR - 28		73c8fca7-5202-41fa-9fac-016b93c136ef	ef9d1862-79ed-4407-b7da-538bce367ca0	25	c83b69b9-9d80-4109-b688-58ec2d42fdbe	0.0000	70.0000	80.0000	2.0000	5.0000	10.0000	0.4000	224.0000	0.0000	eb690134-4763-4a80-99c8-9717f67108c1	2026-01-05 17:53:33.247692	2026-01-05 17:53:33.247692
a494c594-d0ab-49a8-b316-a292f3b8f822	P002	Rice BR - 28		73c8fca7-5202-41fa-9fac-016b93c136ef	ef9d1862-79ed-4407-b7da-538bce367ca0	50	c83b69b9-9d80-4109-b688-58ec2d42fdbe	0.0000	75.0000	90.0000	2.0000	5.0000	10.0000	4.2000	364.0000	0.0000	eb690134-4763-4a80-99c8-9717f67108c1	2026-01-05 18:06:54.656632	2026-01-05 18:06:54.656632
\.


--
-- Data for Name: shops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shops (shop_id, shop_name, shop_address, bin_no, open_date, created_at, updated_at) FROM stdin;
eb690134-4763-4a80-99c8-9717f67108c1	My Favorite Shop	Badda, Dhaka	BIN-123465	2026-01-04 06:00:00	2026-01-05 12:28:41.472955	2026-01-05 15:11:43.052102
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units (unit_id, unit_name, created_at, updated_at) FROM stdin;
39fc9555-17b7-4d95-ac9f-536e8abbf28e	Carton	2026-01-05 15:39:52.01046	2026-01-05 15:39:52.01046
ef9d1862-79ed-4407-b7da-538bce367ca0	Kg	2026-01-05 15:39:59.384804	2026-01-05 15:39:59.384804
c83b69b9-9d80-4109-b688-58ec2d42fdbe	Bulk	2026-01-05 15:40:06.280493	2026-01-05 15:40:06.280493
65165ebf-ba1c-495d-8c64-ab0ddabff016	Pack	2026-01-05 15:49:15.56132	2026-01-05 15:49:15.56132
75f416d7-64ec-4f67-bf55-5cc25c3060fe	Box	2026-01-05 15:49:21.423184	2026-01-05 15:49:21.423184
f8fdda40-ddd5-4f45-a598-754140b89b0a	Ltr	2026-01-05 15:49:34.768302	2026-01-05 15:49:34.768302
169e3261-178a-4ce6-a8c3-220fdede156d	Pcs	2026-01-05 16:05:52.436928	2026-01-05 16:05:52.436928
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, user_email, user_password, user_mobile, user_name, recovery_code, user_role, shop_id, created_at, updated_at) FROM stdin;
e206700f-7988-4849-b2c3-d2695bd97362	user@sgd.com	123456	01722688266	General User	sgd	Admin	eb690134-4763-4a80-99c8-9717f67108c1	2026-01-05 14:04:10.299709	2026-01-05 15:41:54.857367
282679b4-2056-4fe9-9ae9-e685e4b59220	admin@sgd.com	123456	01722688266	Admin User	sgd	Admin	eb690134-4763-4a80-99c8-9717f67108c1	2026-01-05 13:55:25.450953	2026-01-05 15:42:03.747242
\.


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (contact_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: shops shops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (shop_id);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (unit_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_email_key UNIQUE (user_email);


--
-- Name: products fk_product_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE RESTRICT;


--
-- Name: products fk_product_large_unit; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_product_large_unit FOREIGN KEY (large_unit_id) REFERENCES public.units(unit_id) ON DELETE RESTRICT;


--
-- Name: products fk_product_shop; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_product_shop FOREIGN KEY (shop_id) REFERENCES public.shops(shop_id) ON DELETE SET NULL;


--
-- Name: products fk_product_small_unit; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_product_small_unit FOREIGN KEY (small_unit_id) REFERENCES public.units(unit_id) ON DELETE RESTRICT;


--
-- Name: contacts fk_shop; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT fk_shop FOREIGN KEY (shop_id) REFERENCES public.shops(shop_id) ON DELETE SET NULL;


--
-- Name: users fk_shop; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_shop FOREIGN KEY (shop_id) REFERENCES public.shops(shop_id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict gU8w6m3Jxi7DdmKL8kbNePrdqgog1C3WngKuSwh266fauAAcS9rDQztFdBMHVnt

