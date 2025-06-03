-- CreateEnum
CREATE TYPE "Type" AS ENUM ('FAUNA', 'FLORA');

-- AlterTable
ALTER TABLE "especime" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "scientific_name" TEXT,
ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'FAUNA';
