-- CreateEnum
CREATE TYPE "Title" AS ENUM ('chapter_leader', 'state_director', 'regional_leader');

-- CreateTable
CREATE TABLE "chapter_leaders" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "reserved_cities" TEXT[],
    "reserved_state" TEXT[],
    "referred_by_first_name" TEXT,
    "referred_by_last_name" TEXT,
    "title" "Title"[] DEFAULT ARRAY['chapter_leader']::"Title"[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "chapter_leaders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chapter_leaders_email_key" ON "chapter_leaders"("email");

-- CreateIndex
CREATE UNIQUE INDEX "chapter_leaders_phone_key" ON "chapter_leaders"("phone");
