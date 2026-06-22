const fs = require('fs');
let file = fs.readFileSync('src/lib/supabase.ts', 'utf8');
file = file.replace(/"category": "Shirts"/g, '"category": "Apparel & Style"')
           .replace(/"category": "T-Shirts"/g, '"category": "Apparel & Style"')
           .replace(/"category": "Pants"/g, '"category": "Apparel & Style"')
           .replace(/"category": "Footwear"/g, '"category": "Mobility & Gear"')
           .replace(/"category": "Photography"/g, '"category": "Vanguard Living"')
           .replace(/"category": "Accessories"/g, '"category": "Apparel & Style"');
fs.writeFileSync('src/lib/supabase.ts', file, 'utf8');
console.log('Categories updated!');
