-- CreateTable
CREATE TABLE "site" (
    "location" VARCHAR(255) NOT NULL,

    CONSTRAINT "site_pkey" PRIMARY KEY ("location")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_location_key" ON "site"("location");
