/*
  Warnings:

  - You are about to drop the column `account_id` on the `Channel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,name]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_account_id_fkey";

-- DropIndex
DROP INDEX "Channel_id_account_id_key";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "account_id",
ADD COLUMN     "creator_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_id_key" ON "Channel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_id_name_key" ON "Channel"("id", "name");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Account"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
