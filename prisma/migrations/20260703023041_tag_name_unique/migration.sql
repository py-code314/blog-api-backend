/*
  Warnings:

  - You are about to drop the column `slug` on the `tags` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tags_slug_key";

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "slug";

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
