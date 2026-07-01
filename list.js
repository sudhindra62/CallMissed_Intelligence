const fs = require('fs');
console.log(fs.readdirSync('/workspace', { withFileTypes: true }).map(d => d.name));
