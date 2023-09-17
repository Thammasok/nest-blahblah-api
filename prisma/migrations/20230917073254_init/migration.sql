-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "accountUuid" VARCHAR(128) NOT NULL,
    "accountName" VARCHAR(128),
    "displayName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "isVerify" BOOLEAN DEFAULT false,
    "isRemove" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_verify" (
    "accountId" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "verifyAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_verify_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "account_token" (
    "accountId" INTEGER NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3),
    "scopes" VARCHAR(255),
    "userAgent" VARCHAR(128),
    "ipAddress" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_token_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "account_setting" (
    "accountId" INTEGER NOT NULL,
    "language" VARCHAR(5) DEFAULT 'en-EN',
    "dateFormat" VARCHAR(10) DEFAULT 'dd-mm-yyyy',
    "timeZone" VARCHAR(50) DEFAULT '+07:00',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_setting_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "wallet" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "excludeFromTotal" BOOLEAN NOT NULL DEFAULT false,
    "isRemove" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_categories" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "isRemove" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency_list" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "symbol" VARCHAR(4) NOT NULL,
    "isoCode" VARCHAR(4) NOT NULL,
    "isRemove" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currency_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_accountUuid_key" ON "account"("accountUuid");

-- CreateIndex
CREATE UNIQUE INDEX "account_accountName_key" ON "account"("accountName");

-- CreateIndex
CREATE UNIQUE INDEX "account_email_key" ON "account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "account_verify" ADD CONSTRAINT "account_verify_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_token" ADD CONSTRAINT "account_token_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_setting" ADD CONSTRAINT "account_setting_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "wallet_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currency_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_categories" ADD CONSTRAINT "wallet_categories_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
