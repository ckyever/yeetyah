-- AlterTable
ALTER TABLE "user" ADD COLUMN     "display_name" TEXT,
ADD COLUMN     "is_logged_in" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profile_image" TEXT;
