-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "mapLocation" JSONB,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'link',
ALTER COLUMN "url" DROP NOT NULL;
