// scripts/create-admin.ts
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  try {
    console.log('\n🔐 Création d\'un compte administrateur\n')

    const email = await question('📧 Email admin : ')
    const password = await question('🔑 Mot de passe : ')
    const name = await question('😊 Nom (optionnel) : ')

    // Vérifier si l'email existe déjà
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log(`\n⚠️  Un utilisateur avec l'email "${email}" existe déjà`)
      
      if (existing.role === 'ADMIN') {
        console.log('✅ C\'est déjà un admin !')
        rl.close()
        return
      }

      const upgrade = await question(`Mettre à jour son rôle en ADMIN ? (oui/non) : `)
      
      if (upgrade.toLowerCase() === 'oui' || upgrade.toLowerCase() === 'o') {
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const updated = await prisma.user.update({
          where: { email },
          data: {
            role: 'ADMIN',
            password: hashedPassword,
            name: name || undefined,
          },
        })

        console.log(`\n✅ Compte mis à jour en ADMIN !`)
        console.log(`   Email: ${updated.email}`)
        console.log(`   Rôle: ${updated.role}`)
      }
    } else {
      // Créer un nouveau compte admin
      const hashedPassword = await bcrypt.hash(password, 10)

      const created = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || undefined,
          role: 'ADMIN',
        },
      })

      console.log(`\n✅ Compte admin créé avec succès !`)
      console.log(`   Email: ${created.email}`)
      console.log(`   Rôle: ${created.role}`)
    }

    console.log(`\n👉 Tu peux maintenant aller à /admin/login et te connecter avec:`)
    console.log(`   Email: ${email}`)
    console.log(`   Mot de passe: [celui que tu viens de saisir]`)
    console.log()

    rl.close()
  } catch (error) {
    console.error('❌ Erreur:', error)
    rl.close()
    process.exit(1)
  }
}

main()
