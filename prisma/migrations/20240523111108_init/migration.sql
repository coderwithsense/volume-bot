/*
  Warnings:

  - Added the required column `userId` to the `solanaKeypair` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "solanaKeypair" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "solanaKeypair" ADD CONSTRAINT "solanaKeypair_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
