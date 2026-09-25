-- Prisma migrate dev uses a separate shadow database to check migration history.
CREATE DATABASE IF NOT EXISTS propet_shadow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON propet_shadow.* TO 'propet'@'%';

-- Integration tests use their own schema and never reset the development database.
CREATE DATABASE IF NOT EXISTS propet_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON propet_test.* TO 'propet'@'%';
