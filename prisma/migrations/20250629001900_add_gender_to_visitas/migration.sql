-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO');

-- AlterTable
ALTER TABLE "visitas" ADD COLUMN     "gender" "Gender";
