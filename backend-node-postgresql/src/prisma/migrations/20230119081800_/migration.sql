/*
  Warnings:

  - You are about to drop the column `channelId` on the `Message` table. All the data in the column will be lost.
  - Made the column `message` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_channelId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "channelId",
ADD COLUMN     "channel_id" INTEGER,
ALTER COLUMN "message" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
