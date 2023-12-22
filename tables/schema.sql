
-- Create table user
CREATE TABLE "user" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'user',
    "image" TEXT,
    "apple_id" TEXT UNIQUE,
    "google_id" TEXT UNIQUE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);


-- Create table verification_request
CREATE TABLE "verification_request" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "verification_request_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "verification_request" ADD CONSTRAINT "verification_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create table password_reset_token
CREATE TABLE "password_reset_token" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reset_at" TIMESTAMP(3),    

    CONSTRAINT "password_reset_token_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "password_reset_token_token_key" ON "password_reset_token"("token");
ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Create data
INSERT INTO "user"("email", "email_verified","password", "role", "username") VALUES (E'ilian.allaf@outlook.fr', true, E'$2b$10$jWUNOcBlIz8sKJgiZrAJBOas.VW7STaHbqRYyyLrnMJmW8ej2WaSW', E'user', E'ilian');
