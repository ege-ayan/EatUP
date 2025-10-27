/*
  Warnings:

  - You are about to drop the column `locationName` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `isOrganizationAdmin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "locationName";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isOrganizationAdmin";
