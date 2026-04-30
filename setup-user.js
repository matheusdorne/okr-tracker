// Creates the first app user via PocketBase admin API.
// Usage: node setup-user.js <admin-email> <admin-password> <user-email> <user-password>
//
// Example:
//   node setup-user.js admin@example.com myAdminPass matheus.dorne@gmail.com myAppPass123

import PocketBase from 'pocketbase'

const [adminEmail, adminPassword, userEmail, userPassword] = process.argv.slice(2)

if (!adminEmail || !adminPassword || !userEmail || !userPassword) {
  console.error('Usage: node setup-user.js <admin-email> <admin-password> <user-email> <user-password>')
  process.exit(1)
}

const pb = new PocketBase('http://127.0.0.1:8090')

async function run() {
  await pb.admins.authWithPassword(adminEmail, adminPassword)

  const user = await pb.collection('users').create({
    email:           userEmail,
    password:        userPassword,
    passwordConfirm: userPassword,
    name:            'Admin',
  })

  console.log(`User created: ${user.email} (id: ${user.id})`)
}

run().catch((e) => {
  console.error('Error:', e.message)
  process.exit(1)
})
