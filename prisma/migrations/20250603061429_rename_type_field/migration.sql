/*
  Warnings:

  - You are about to drop the column `type` on the `especime` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "especime" DROP COLUMN "type",
ADD COLUMN     "specimen_type" "Type" NOT NULL DEFAULT 'FAUNA';
