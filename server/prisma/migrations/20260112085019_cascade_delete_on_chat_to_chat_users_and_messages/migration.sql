-- DropForeignKey
ALTER TABLE "chat_user" DROP CONSTRAINT "chat_user_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_chat_id_fkey";

-- AddForeignKey
ALTER TABLE "chat_user" ADD CONSTRAINT "chat_user_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
