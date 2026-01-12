/*
  Warnings:

  - A unique constraint covering the columns `[chat_id,user_id]` on the table `chat_user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "chat_user_chat_id_user_id_key" ON "chat_user"("chat_id", "user_id");
