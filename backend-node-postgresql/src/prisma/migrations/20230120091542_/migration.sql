/*
  Warnings:

  - You are about to drop the column `user_id` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_user_id_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "user_id",
ADD COLUMN     "user_email" VARCHAR;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "Account"("email") ON DELETE SET NULL ON UPDATE CASCADE;
