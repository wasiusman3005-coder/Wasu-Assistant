import { execSync } from 'child_process';
import ghpages from 'gh-pages';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('\n🚀 [WASU LOVE] Preparing GitHub Pages Deployment...\n');

// 1. Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.log('📦 Dist folder not found. Building project first (npm run build)...');
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
}

// 2. Detect git and origin
let remoteUrl = '';

// Check CLI arguments for --repo <url> or --repo=<url>
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--repo=')) {
    remoteUrl = args[i].split('=')[1];
  } else if (args[i] === '--repo' && args[i + 1]) {
    remoteUrl = args[i + 1];
  }
}

// Check environment variables
if (!remoteUrl && process.env.REPO_URL) {
  remoteUrl = process.env.REPO_URL;
}

// Check git config remote.origin.url
if (!remoteUrl) {
  try {
    const gitRemote = execSync('git config --get remote.origin.url', { cwd: rootDir, encoding: 'utf-8' }).trim();
    if (gitRemote) {
      remoteUrl = gitRemote;
    }
  } catch (e) {
    // Git origin not configured yet
  }
}

// 3. If remoteUrl is still not found, give clear guidance
if (!remoteUrl) {
  console.error('\n❌ ERROR: GitHub Remote URL not found!');
  console.error('-------------------------------------------------------------');
  console.error('Aapke project mein GitHub repository ka "origin" link set nahi hai.\n');
  console.error('👉 Solution 1 (Sab se asaan - Git push):');
  console.error('   Aapko "npm run deploy" chalane ki bhi zaroorat nahi hai!');
  console.error('   Kyunki repository mein GitHub Actions (.github/workflows/deploy.yml) pehle se moojood hai.');
  console.error('   Sirf GitHub pe code push karein, yeh automatically deploy ho jayega:\n');
  console.error('   git add .');
  console.error('   git commit -m "Deploy WASU LOVE OS"');
  console.error('   git push origin main\n');
  console.error('👉 Solution 2 (Command ke sath URL dein):');
  console.error('   npm run deploy -- --repo=https://github.com/APNA_USERNAME/APNA_REPO.git\n');
  console.error('👉 Solution 3 (Git Origin connect karein):');
  console.error('   git remote add origin https://github.com/APNA_USERNAME/APNA_REPO.git');
  console.error('   npm run deploy\n');
  console.error('-------------------------------------------------------------\n');
  process.exit(1);
}

console.log(`📡 Deploying to GitHub repository: ${remoteUrl}`);
console.log('⏳ Uploading files from /dist to gh-pages branch...\n');

const publishOptions = {
  dotfiles: true,
  message: 'Deploy WASU LOVE OS [auto-generated]',
};

if (remoteUrl) {
  publishOptions.repo = remoteUrl;
}

ghpages.publish(distDir, publishOptions, (err) => {
  if (err) {
    console.error('\n❌ Deployment failed:');
    console.error(err.message || err);
    console.error('\nTip: Check if you have write permission to this GitHub repository or use GitHub Actions workflow.\n');
    process.exit(1);
  }
  console.log('\n🎉 SUCCESS! WASU LOVE OS is successfully published to GitHub Pages!');
  console.log('Check your repository Settings -> Pages -> Source: Deploy from a branch (gh-pages /root).\n');
});
