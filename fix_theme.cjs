const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components')
];

const replacements = {
  'text-slate-900': 'text-white',
  'text-slate-800': 'text-slate-200',
  'text-slate-700': 'text-slate-300',
  'text-slate-600': 'text-slate-400',
  'text-gray-900': 'text-white',
  'text-gray-800': 'text-slate-200',
  'text-gray-700': 'text-slate-300',
  'text-gray-600': 'text-slate-400',
  'bg-slate-50': 'bg-white/5',
  'bg-slate-100': 'bg-white/5',
  'bg-slate-200': 'bg-white/10',
  'border-slate-200': 'border-white/10',
  'border-slate-300': 'border-white/20',
  'hover:bg-slate-50': 'hover:bg-white/5',
  'hover:bg-slate-100': 'hover:bg-white/10',
  'hover:border-slate-300': 'hover:border-white/20',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      for (const [oldClass, newClass] of Object.entries(replacements)) {
        const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, newClass);
          modified = true;
        }
      }

      const bgWhiteRegex = /\bbg-white\b(?!\/)/g;
      if (bgWhiteRegex.test(content)) {
        if (!fullPath.includes('Landing.jsx') && !fullPath.includes('Login.jsx') && !fullPath.includes('Button.jsx')) {
           content = content.replace(bgWhiteRegex, 'bg-white/5');
           modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

directories.forEach(dir => processDirectory(dir));
console.log('Done!');
