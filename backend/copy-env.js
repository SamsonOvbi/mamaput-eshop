const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  execSync(`shx cp ${envPath} build/`);
}