const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Update product ID 33 to be unique
    const product = await prisma.product.update({
        where: { id: 33 },
        data: { isUnique: true }
    })
    console.log('Updated product:', product)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
