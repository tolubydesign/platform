/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userEmail_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "userEmail",
ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_user_id_key" ON "Account"("user_id");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Account"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
