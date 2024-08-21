/*
  Warnings:

  - Made the column `userId` on table `urls` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "urls" DROP CONSTRAINT "urls_userId_fkey";

-- AlterTable
ALTER TABLE "urls" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
