import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function migratePasswords() {
    console.log('🔄 Starting password migration...')

    try {
        // Migrar usuários
        const users = await prisma.user.findMany()
        console.log(`📊 Found ${users.length} users to migrate`)

        for (const user of users) {
            // Verificar se a senha já está hasheada
            if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
                console.log(`✅ User ${user.email} already has hashed password`)
                continue
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(user.password, 12)

            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            })

            console.log(`✅ Migrated password for user: ${user.email}`)
        }

        // Migrar admins
        const admins = await prisma.admin.findMany()
        console.log(`📊 Found ${admins.length} admins to migrate`)

        for (const admin of admins) {
            if (admin.password.startsWith('$2b$') || admin.password.startsWith('$2a$')) {
                console.log(`✅ Admin ${admin.username} already has hashed password`)
                continue
            }

            const hashedPassword = await bcrypt.hash(admin.password, 12)

            await prisma.admin.update({
                where: { id: admin.id },
                data: { password: hashedPassword }
            })

            console.log(`✅ Migrated password for admin: ${admin.username}`)
        }

        console.log('✅ Password migration completed successfully!')
    } catch (error) {
        console.error('❌ Error during migration:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

migratePasswords()
    .catch((error) => {
        console.error('Fatal error:', error)
        process.exit(1)
    })
