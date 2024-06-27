-- install gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "accounts" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR NOT NULL,
    "account_type" VARCHAR NOT NULL,
    "user_group" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "phone" VARCHAR,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("user_id")
);
