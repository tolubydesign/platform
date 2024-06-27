/*
  Warnings:

  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,account_id]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userEmail_fkey";

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "account_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- DropTable
DROP TABLE "accounts";

-- CreateTable
CREATE TABLE "Account" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR NOT NULL,
    "account_type" "Role" NOT NULL DEFAULT 'user',
    "user_group" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "phone" VARCHAR,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_id_account_id_key" ON "Channel"("id", "account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "Account"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
