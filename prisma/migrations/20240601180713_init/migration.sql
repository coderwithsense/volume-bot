/*
  Warnings:

  - The primary key for the `Bot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `solanaKeypair` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `botName` was added to the `Bot` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Bot" DROP CONSTRAINT "Bot_userId_fkey";

-- DropForeignKey
ALTER TABLE "solanaKeypair" DROP CONSTRAINT "solanaKeypair_userId_fkey";

-- AlterTable
ALTER TABLE "Bot" DROP CONSTRAINT "Bot_pkey",
ADD COLUMN     "botName" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bot_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bot_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "solanaKeypair" DROP CONSTRAINT "solanaKeypair_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "solanaKeypair_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "solanaKeypair_id_seq";

-- AddForeignKey
ALTER TABLE "solanaKeypair" ADD CONSTRAINT "solanaKeypair_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
