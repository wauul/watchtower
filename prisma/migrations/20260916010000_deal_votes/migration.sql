ALTER TABLE "SharedFind" ADD COLUMN "referencePrice" DECIMAL(12,2), ADD COLUMN "discountPercent" DECIMAL(7,2);
CREATE TABLE "DealVote" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "findId" TEXT NOT NULL, "value" INTEGER NOT NULL CHECK ("value" IN (-1,1)), CONSTRAINT "DealVote_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "DealVote_userId_findId_key" ON "DealVote"("userId","findId");
CREATE INDEX "DealVote_findId_value_idx" ON "DealVote"("findId","value");
ALTER TABLE "DealVote" ADD CONSTRAINT "DealVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DealVote" ADD CONSTRAINT "DealVote_findId_fkey" FOREIGN KEY ("findId") REFERENCES "SharedFind"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- Backfill only from observations available when the snapshot was published/updated.
UPDATE "SharedFind" f SET "referencePrice" = (SELECT h.price FROM "PriceHistory" h WHERE h."productId"=f."productId" AND h."checkedAt"<=f."updatedAt" ORDER BY h."checkedAt",h.id LIMIT 1) WHERE (SELECT count(*) FROM "PriceHistory" h WHERE h."productId"=f."productId" AND h."checkedAt"<=f."updatedAt")>=2;
UPDATE "SharedFind" SET "discountPercent"=GREATEST(0,ROUND(("referencePrice"-price)/"referencePrice"*100,2)) WHERE "referencePrice">0;
