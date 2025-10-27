-- CreateEnum
CREATE TYPE "UserConfirmationStatus" AS ENUM ('PENDING', 'CONFIRMED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailConfirmationStatus" "UserConfirmationStatus" NOT NULL DEFAULT 'PENDING';
