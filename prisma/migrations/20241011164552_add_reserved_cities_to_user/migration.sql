/*
  Warnings:

  - You are about to drop the column `reserved_state` on the `chapter_leaders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chapter_leaders" DROP COLUMN "reserved_state",
ADD COLUMN     "reserved_states" TEXT[];
