-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "paymentMethod" TEXT DEFAULT 'pix',
    "paymentId" TEXT,
    "paymentStatus" TEXT DEFAULT 'pending'
);
INSERT INTO "new_Order" ("address", "city", "createdAt", "customerEmail", "customerName", "id", "paymentMethod", "postalCode", "status", "total") SELECT "address", "city", "createdAt", "customerEmail", "customerName", "id", "paymentMethod", "postalCode", "status", "total" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
