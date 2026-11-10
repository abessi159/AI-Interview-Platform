-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "problemTitle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "scoreData" TEXT;
