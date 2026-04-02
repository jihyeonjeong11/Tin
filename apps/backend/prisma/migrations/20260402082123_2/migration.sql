/*
  Warnings:

  - You are about to drop the column `status` on the `tins` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tins_user_id_status_idx";

-- AlterTable
ALTER TABLE "tins" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ban_expires" TIMESTAMP(3),
ADD COLUMN     "ban_reason" TEXT,
ADD COLUMN     "banned" BOOLEAN,
ADD COLUMN     "role" TEXT;

-- DropEnum
DROP TYPE "TinStatus";

-- CreateIndex
CREATE INDEX "tins_user_id_type_idx" ON "tins"("user_id", "type");
