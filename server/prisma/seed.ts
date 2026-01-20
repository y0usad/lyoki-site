import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    // Create Admin with hashed password
    const hashedPassword = await bcrypt.hash('password123', 12)

    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
        },
    })

    // Create lyoki admin
    const hashedPasswordLyoki = await bcrypt.hash('Isabraba666!!', 12)

    await prisma.admin.upsert({
        where: { username: 'lyoki' },
        update: {},
        create: {
            username: 'lyoki',
            password: hashedPasswordLyoki,
        },
    })

    const products = [
        {
            name: 'BLOOD OATH',
            price: 888.00,
            description: 'Platform boots with gothic details.',
            image: 'https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=1000&auto=format&fit=crop', // Placeholder
            category: 'footwear',
            stock: 5,
        },
        {
            name: 'BERMUDA CARGO GRAVEYARD',
            price: 444.00,
            description: 'Distressed cargo shorts.',
            image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1000&auto=format&fit=crop',
            category: 'bottoms',
            stock: 10,
        },
        {
            name: 'T-SHIRT DISCO STICK',
            price: 222.00,
            description: 'Graphic oversized tee.',
            image: 'https://images.unsplash.com/photo-1503341338985-c0477be52513?q=80&w=1000&auto=format&fit=crop',
            category: 'tops',
            stock: 20,
        },
        {
            name: 'POLO TRIBAL CHAOS',
            price: 333.00,
            description: 'Striped polo with tribal print.',
            image: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1000&auto=format&fit=crop',
            category: 'tops',
            stock: 15,
        },
        {
            name: 'CAMISA BUTTON UP TOXIC PRAYER',
            price: 555.00,
            description: 'Black button up with graphics.',
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
            category: 'tops',
            stock: 8,
        },
        {
            name: 'TANK TOP CRAZY SEXY COOL',
            price: 188.00,
            description: 'Sleeveless graphic top.',
            image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1000&auto=format&fit=crop',
            category: 'tops',
            stock: 25,
        },
        {
            name: 'KISS PORRA',
            price: 222.00,
            description: 'Edgy graphic tee.',
            image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000&auto=format&fit=crop',
            category: 'tops',
            stock: 20,
        },
        {
            name: 'JERSEY GREMIO CHAOS',
            price: 333.00,
            description: 'Sports jersey with chaotic print.',
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
            category: 'tops',
            stock: 12,
        },
    ]

    for (const product of products) {
        await prisma.product.create({
            data: product,
        })
    }

    console.log('Seed data created.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
