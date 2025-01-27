-- CreateEnum
CREATE TYPE "ServerType" AS ENUM ('JAVA', 'BEDROCK');

-- CreateEnum
CREATE TYPE "BedrockEditionEnum" AS ENUM ('MCPE', 'MCEE');

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL,
    "host" VARCHAR(255) NOT NULL,
    "port" SMALLINT NOT NULL,
    "ipAddress" VARCHAR(255),
    "eulaBlocked" BOOLEAN NOT NULL,
    "retrievedAt" INTEGER NOT NULL,
    "expiresAt" INTEGER NOT NULL,
    "type" "ServerType" NOT NULL DEFAULT 'JAVA',

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JavaServer" (
    "id" TEXT NOT NULL,
    "icon" VARCHAR(255),
    "software" VARCHAR(255),
    "version" JSONB,
    "players" JSONB NOT NULL,
    "motd" JSONB NOT NULL,
    "mods" JSONB,
    "plugins" JSONB,
    "srvRecord" JSONB,

    CONSTRAINT "JavaServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BedrockServer" (
    "id" TEXT NOT NULL,
    "version" JSONB,
    "players" JSONB NOT NULL,
    "gamemode" VARCHAR NOT NULL,
    "serverId" VARCHAR(255) NOT NULL,
    "edition" "BedrockEditionEnum" NOT NULL,

    CONSTRAINT "BedrockServer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JavaServer" ADD CONSTRAINT "JavaServer_id_fkey" FOREIGN KEY ("id") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BedrockServer" ADD CONSTRAINT "BedrockServer_id_fkey" FOREIGN KEY ("id") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
