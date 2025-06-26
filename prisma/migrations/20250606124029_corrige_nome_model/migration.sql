/*
  Warnings:

  - You are about to drop the `visit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "visit";

-- CreateTable
CREATE TABLE "visitas" (
    "id" TEXT NOT NULL,
    "visitor_name" TEXT NOT NULL,
    "group_size" INTEGER NOT NULL DEFAULT 1,
    "course" TEXT,
    "country" TEXT NOT NULL DEFAULT 'BRAZIL',
    "state" TEXT NOT NULL DEFAULT 'RIO GRANDE DO SUL',
    "city" TEXT NOT NULL DEFAULT 'SANTA MARIA',
    "purpose" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitas_pkey" PRIMARY KEY ("id")
);
