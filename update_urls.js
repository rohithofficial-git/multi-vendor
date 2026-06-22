const fs = require('fs');
let file = fs.readFileSync('src/lib/supabase.ts', 'utf8');

file = file.replace(
  /'https:\/\/images.unsplash.com\/photo-1542291026-7eec264c27ff\?w=800&auto=format&fit=crop&q=80'/g, 
  "'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/screenshot/screenshot.jpg'"
);

file = file.replace(
  /'https:\/\/images.unsplash.com\/photo-1608231387042-66d1773070a5\?w=800&auto=format&fit=crop&q=80'/g, 
  "'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/screenshot/screenshot.jpg'"
);

file = file.replace(
  /'https:\/\/images.unsplash.com\/photo-1526170375885-4d8ecf77b99f\?w=800&auto=format&fit=crop&q=80'/g, 
  "'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/screenshot/screenshot.jpg'"
);

file = file.replace(
  /'https:\/\/images.unsplash.com\/photo-1594623930572-300a3011d9ae\?w=800&auto=format&fit=crop&q=80'/g, 
  "'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoomBox/screenshot/screenshot.jpg'"
);

file = file.replace(/const MOCK_STORAGE_KEY = 'multi_vendor_db_v\d+';/, "const MOCK_STORAGE_KEY = 'multi_vendor_db_v9';");

fs.writeFileSync('src/lib/supabase.ts', file, 'utf8');
console.log('Successfully updated image URLs in supabase.ts');
