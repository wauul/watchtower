CREATE TABLE "User" (
 "id" TEXT NOT NULL PRIMARY KEY,
 "email" TEXT NOT NULL,
 "displayName" TEXT NOT NULL DEFAULT 'Watchtower member',
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "SharedFind" (
 "id" TEXT NOT NULL PRIMARY KEY,
 "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 "name" TEXT NOT NULL,
 "url" TEXT NOT NULL,
 "imageUrl" TEXT,
 "price" DECIMAL(12,2) NOT NULL,
 "currency" TEXT NOT NULL,
 "note" TEXT NOT NULL,
 "published" BOOLEAN NOT NULL DEFAULT true,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "SharedFind_productId_key" ON "SharedFind"("productId");
CREATE INDEX "SharedFind_published_createdAt_idx" ON "SharedFind"("published","createdAt");
