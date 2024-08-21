/*
  Warnings:

  - You are about to drop the column `shortUrl` on the `urls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idUrl]` on the table `urls` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "urls_shortUrl_key";

-- AlterTable
ALTER TABLE "urls" DROP COLUMN "shortUrl",
ADD COLUMN     "idUrl" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "urls_idUrl_key" ON "urls"("idUrl");
