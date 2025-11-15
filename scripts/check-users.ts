import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking users in database...\n');

  const users = await prisma.user.findMany({
    include: { accounts: true },
    orderBy: { createdAt: 'desc' },
  });

  console.log('Users:');
  users.forEach(user => {
    console.log(`  - ${user.email} (ID: ${user.id})`);
    console.log(`    Accounts: ${user.accounts.length}`);
    user.accounts.forEach(acc => {
      console.log(`      * providerId: ${acc.providerId}, accountId: ${acc.accountId}, password: ${acc.password ? 'YES' : 'NO'}`);
    });
  });

  // Delete user if they have no accounts (incomplete signup)
  const incompleteUser = users.find(u => u.accounts.length === 0 && u.email === 'frantzchery@hotmail.com');

  if (incompleteUser) {
    console.log(`\nDeleting incomplete user: ${incompleteUser.email}`);
    await prisma.user.delete({ where: { id: incompleteUser.id } });
    console.log('✓ User deleted');
  } else {
    console.log('\nNo incomplete users to delete');
  }
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
