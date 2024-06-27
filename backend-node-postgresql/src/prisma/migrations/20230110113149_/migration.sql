/*
  Warnings:

  - The `account_type` column on the `accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "account_type",
ADD COLUMN     "account_type" "Role" NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
