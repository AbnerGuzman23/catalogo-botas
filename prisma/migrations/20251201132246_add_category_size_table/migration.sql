/*
  Warnings:

  - You are about to drop the column `hasColors` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `hasMaterials` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `hasSizes` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "hasColors",
DROP COLUMN "hasMaterials",
DROP COLUMN "hasSizes";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brandId" INTEGER;

-- CreateTable
CREATE TABLE "CategorySize" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CategorySize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategorySize_categoryId_size_key" ON "CategorySize"("categoryId", "size");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- AddForeignKey
ALTER TABLE "CategorySize" ADD CONSTRAINT "CategorySize_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
