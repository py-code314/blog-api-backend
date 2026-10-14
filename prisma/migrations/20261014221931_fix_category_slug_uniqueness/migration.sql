/*
  Warnings:

  - A unique constraint covering the columns `[slug,userId]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "categories_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_userId_key" ON "categories"("slug", "userId");
