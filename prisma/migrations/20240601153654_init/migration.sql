-- CreateTable
CREATE TABLE "Bot" (
    "id" SERIAL NOT NULL,
    "exchange" TEXT NOT NULL,
    "TokenAddress" TEXT NOT NULL,
    "WalletsAmount" INTEGER NOT NULL,
    "capitalAmount" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
