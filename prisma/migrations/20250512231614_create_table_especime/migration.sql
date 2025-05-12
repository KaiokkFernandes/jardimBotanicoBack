-- CreateTable
CREATE TABLE "especime" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "category" TEXT,
    "description" TEXT,
    "habitat" TEXT,
    "curiosity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "especime_pkey" PRIMARY KEY ("id")
);
