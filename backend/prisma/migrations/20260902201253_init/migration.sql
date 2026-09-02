-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('pending', 'contacted', 'closed');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('apartment', 'house', 'villa', 'land', 'office', 'commercial');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('sale', 'rent');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('FCFA', 'EUR', 'USD');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(32),
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'FCFA',
    "type" "PropertyType" NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "surface" INTEGER NOT NULL,
    "rooms" INTEGER DEFAULT 0,
    "bedrooms" INTEGER DEFAULT 0,
    "bathrooms" INTEGER DEFAULT 0,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(80) NOT NULL,
    "neighborhood" VARCHAR(120),
    "postalCode" VARCHAR(20),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "images" TEXT NOT NULL DEFAULT '[]',
    "features" TEXT NOT NULL DEFAULT '[]',
    "available" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(32),
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT,
    "userId" TEXT,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(32),
    "preferredDate" TIMESTAMP(3),
    "preferredTime" VARCHAR(16),
    "notes" TEXT,
    "status" "VisitStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(32),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "numberOfGuests" INTEGER DEFAULT 1,
    "notes" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "properties_city_idx" ON "properties"("city");

-- CreateIndex
CREATE INDEX "properties_transactionType_idx" ON "properties"("transactionType");

-- CreateIndex
CREATE INDEX "properties_type_idx" ON "properties"("type");

-- CreateIndex
CREATE INDEX "properties_available_idx" ON "properties"("available");

-- CreateIndex
CREATE INDEX "properties_featured_idx" ON "properties"("featured");

-- CreateIndex
CREATE INDEX "properties_createdAt_idx" ON "properties"("createdAt");

-- CreateIndex
CREATE INDEX "inquiries_status_idx" ON "inquiries"("status");

-- CreateIndex
CREATE INDEX "inquiries_createdAt_idx" ON "inquiries"("createdAt");

-- CreateIndex
CREATE INDEX "inquiries_propertyId_idx" ON "inquiries"("propertyId");

-- CreateIndex
CREATE INDEX "visits_status_idx" ON "visits"("status");

-- CreateIndex
CREATE INDEX "visits_preferredDate_idx" ON "visits"("preferredDate");

-- CreateIndex
CREATE INDEX "visits_propertyId_idx" ON "visits"("propertyId");

-- CreateIndex
CREATE INDEX "reservations_status_idx" ON "reservations"("status");

-- CreateIndex
CREATE INDEX "reservations_startDate_idx" ON "reservations"("startDate");

-- CreateIndex
CREATE INDEX "reservations_propertyId_idx" ON "reservations"("propertyId");

-- CreateIndex
CREATE INDEX "reservations_startDate_endDate_idx" ON "reservations"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
