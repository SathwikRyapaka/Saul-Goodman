const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components'),
  path.join(__dirname, 'src', 'layouts')
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;

      // Primary text classes
      content = content.replace(/text-primary-(900|800|700|600|500|400|300)/g, 'text-amber-400');
      content = content.replace(/text-primary-(100|50)/g, 'text-amber-200');
      content = content.replace(/hover:text-primary-(900|800|700|600|500|400)/g, 'hover:text-amber-300');

      // Primary background classes
      content = content.replace(/bg-primary-900/g, 'bg-amber-500/10');
      content = content.replace(/bg-primary-(800|700|600|500)/g, 'bg-amber-500');
      content = content.replace(/bg-primary-(100|50)/g, 'bg-amber-500/20');
      content = content.replace(/hover:bg-primary-(100|50)/g, 'hover:bg-amber-500/30');
      content = content.replace(/hover:bg-primary-(900|800|700|600|500)/g, 'hover:bg-amber-400');

      // Primary border classes
      content = content.replace(/border-primary-(100|200)/g, 'border-amber-500/30');
      content = content.replace(/border-primary-(300|400)/g, 'border-amber-500/50');
      content = content.replace(/border-primary-(500|600|700|800|900)/g, 'border-amber-500');
      content = content.replace(/hover:border-primary-[0-9]+/g, 'hover:border-amber-400');

      // Misc
      content = content.replace(/shadow-primary-[0-9]+(\/[0-9]+)?/g, 'shadow-amber-500/20');
      content = content.replace(/ring-primary-[0-9]+/g, 'ring-amber-500');
      content = content.replace(/focus:ring-primary-[0-9]+/g, 'focus:ring-amber-500');
      content = content.replace(/focus:border-primary-[0-9]+/g, 'focus:border-amber-400');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

directories.forEach(dir => processDirectory(dir));
console.log('Done!');
