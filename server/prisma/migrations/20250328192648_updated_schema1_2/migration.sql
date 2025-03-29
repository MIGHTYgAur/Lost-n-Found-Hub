/*
  Warnings:

  - Added the required column `category` to the `FoundItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `imageUrl` on table `FoundItem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `category` to the `LostItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ELECTRONICS', 'ACCESSORIES', 'DOCUMENTS', 'CLOTHING', 'OTHER');

-- AlterTable
ALTER TABLE "FoundItem" ADD COLUMN     "category" "Category" NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "LostItem" ADD COLUMN     "category" "Category" NOT NULL;
