-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_messageId_fkey";

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
