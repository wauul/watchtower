ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
ALTER TABLE "SharedFind" ADD COLUMN "updatedAt" TIMESTAMP(3);
UPDATE "SharedFind" SET "updatedAt" = "createdAt";
ALTER TABLE "SharedFind" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "SharedFind" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
CREATE TABLE "NewsletterSubscriber" ("id" TEXT NOT NULL,"email" TEXT NOT NULL,"tokenHash" TEXT NOT NULL,"expiresAt" TIMESTAMP(3) NOT NULL,"confirmedAt" TIMESTAMP(3),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
CREATE UNIQUE INDEX "NewsletterSubscriber_tokenHash_key" ON "NewsletterSubscriber"("tokenHash");
