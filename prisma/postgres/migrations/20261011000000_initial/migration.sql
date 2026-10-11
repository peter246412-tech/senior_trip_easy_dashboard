-- CreateTable
CREATE TABLE "TravelAgency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TravelAgency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'JP',
    "originCountry" TEXT NOT NULL DEFAULT 'KR',
    "currency" TEXT NOT NULL DEFAULT 'KRW',
    "region" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "price" INTEGER,
    "priceBasis" TEXT NOT NULL,
    "priceCheckedAt" TIMESTAMP(3) NOT NULL,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "verified" TEXT NOT NULL DEFAULT 'unverified',
    "sourceUrl" TEXT,
    "image" TEXT NOT NULL,
    "styles" JSONB NOT NULL,
    "places" JSONB NOT NULL,
    "flights" JSONB,
    "placeListComplete" BOOLEAN NOT NULL DEFAULT false,
    "hotel" TEXT,
    "airline" TEXT,
    "onsen" BOOLEAN,
    "onsenEvidence" TEXT NOT NULL,
    "shopping" INTEGER,
    "optionalCost" INTEGER,
    "included" TEXT,
    "excluded" TEXT,
    "cancellation" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartureOption" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "departureDate" TEXT,
    "airport" TEXT,
    "peopleMin" INTEGER,
    "price" INTEGER,

    CONSTRAINT "DepartureOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItineraryDay" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "analysis" JSONB,

    CONSTRAINT "ItineraryDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItineraryStop" (
    "id" TEXT NOT NULL,
    "itineraryDayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "evidence" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "ItineraryStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobilityAssessment" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "walking" JSONB NOT NULL,
    "vehicle" JSONB NOT NULL,
    "rest" JSONB NOT NULL,
    "stairs" JSONB NOT NULL,

    CONSTRAINT "MobilityAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSource" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "collectionMethod" TEXT NOT NULL,

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonHistory" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "productIds" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComparisonHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TravelAgency_name_key" ON "TravelAgency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ItineraryDay_productId_day_key" ON "ItineraryDay"("productId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "MobilityAssessment_productId_key" ON "MobilityAssessment"("productId");

-- AddForeignKey
ALTER TABLE "TravelProduct" ADD CONSTRAINT "TravelProduct_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "TravelAgency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartureOption" ADD CONSTRAINT "DepartureOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "TravelProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryDay" ADD CONSTRAINT "ItineraryDay_productId_fkey" FOREIGN KEY ("productId") REFERENCES "TravelProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryStop" ADD CONSTRAINT "ItineraryStop_itineraryDayId_fkey" FOREIGN KEY ("itineraryDayId") REFERENCES "ItineraryDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobilityAssessment" ADD CONSTRAINT "MobilityAssessment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "TravelProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSource" ADD CONSTRAINT "DataSource_productId_fkey" FOREIGN KEY ("productId") REFERENCES "TravelProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
