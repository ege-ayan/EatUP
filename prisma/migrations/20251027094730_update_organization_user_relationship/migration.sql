/*
  Warnings:

  - You are about to drop the column `category` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Organization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Organization" DROP CONSTRAINT "Organization_ownerId_fkey";

-- DropIndex
DROP INDEX "public"."Organization_ownerId_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "category",
DROP COLUMN "image",
DROP COLUMN "isActive",
DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOrganizationAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "organizationId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
