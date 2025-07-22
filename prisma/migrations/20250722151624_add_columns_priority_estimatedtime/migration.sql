-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "estimatedTime" TIMESTAMP(3),
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT '1';
