-- CreateTable
CREATE TABLE "RecentListen" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "lastPlayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playCount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RecentListen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecentListen_userId_lastPlayedAt_idx" ON "RecentListen"("userId", "lastPlayedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RecentListen_userId_trackId_key" ON "RecentListen"("userId", "trackId");

-- AddForeignKey
ALTER TABLE "RecentListen" ADD CONSTRAINT "RecentListen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentListen" ADD CONSTRAINT "RecentListen_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
