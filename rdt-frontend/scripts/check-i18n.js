import { execSync } from 'node:child_process';

console.log('🔍 Checking for unused i18n keys...');

try {
  // Run i18n-unused and capture output
  const output = execSync('npx i18n-unused display-unused', {
    encoding: 'utf-8',
    stdio: 'pipe',
  });

  console.log(output);

  // Check if any unused translations were found
  // The tool outputs "Total unused translations count: X"
  // If X > 0, we should fail.

  const totalMatch = output.match(/Total unused translations count: (\d+)/);

  if (totalMatch) {
    const count = Number.parseInt(totalMatch[1], 10);
    if (count > 0) {
      console.error(`\n❌ Error: Found ${count} unused i18n keys!`);
      console.error(
        '👉 Please run "npm run i18n:clean" to remove them or "npm run i18n:check" to see details.'
      );
      process.exit(1);
    }
  } else if (output.includes('Unused translations in:')) {
    // If output format changes or doesn't match, warn but maybe don't fail unless "Unused translations" string appears?
    // Let's assume if "Unused translations in:" appears, it's bad.
    console.error('\n❌ Error: Unused i18n keys found!');
    process.exit(1);
  }

  console.log('✅ No unused i18n keys found.');
} catch (error) {
  console.error('❌ Error executing i18n check:', error.message);
  process.exit(1);
}
