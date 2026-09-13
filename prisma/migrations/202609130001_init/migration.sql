-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "targetPrice" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stock" TEXT NOT NULL DEFAULT 'unknown',
    "boughtAt" TIMESTAMP(3),
    "boughtPrice" DECIMAL(12,2),
    "lastCheckedAt" TIMESTAMP(3),
    "lastError" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "stock" TEXT NOT NULL DEFAULT 'unknown',
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealAnalysis" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "historicalLow" DECIMAL(12,2) NOT NULL,
    "confidence" TEXT NOT NULL,
    "worthNotifying" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notifiedAt" TIMESTAMP(3),

    CONSTRAINT "DealAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlternativeDeal" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "dealAnalysisId" TEXT NOT NULL,
    "retailer" TEXT NOT NULL,
    "price" DECIMAL(12,2),
    "url" TEXT NOT NULL,
    "shipsToUser" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlternativeDeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "JobLock" (
    "key" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobLock_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "Product_email_idx" ON "Product"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_email_url_key" ON "Product"("email", "url");

-- CreateIndex
CREATE INDEX "PriceHistory_productId_checkedAt_idx" ON "PriceHistory"("productId", "checkedAt");

-- CreateIndex
CREATE INDEX "DealAnalysis_productId_createdAt_idx" ON "DealAnalysis"("productId", "createdAt");

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealAnalysis" ADD CONSTRAINT "DealAnalysis_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlternativeDeal" ADD CONSTRAINT "AlternativeDeal_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlternativeDeal" ADD CONSTRAINT "AlternativeDeal_dealAnalysisId_fkey" FOREIGN KEY ("dealAnalysisId") REFERENCES "DealAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
