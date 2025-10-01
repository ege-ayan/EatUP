/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('STUDENT', 'OWNER');

-- AlterTable
ALTER TABLE "public"."Organization" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'STUDENT';

-- CreateIndex
CREATE UNIQUE INDEX "Organization_ownerId_key" ON "public"."Organization"("ownerId");

-- AddForeignKey
ALTER TABLE "public"."Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
