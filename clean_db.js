import fs from 'fs';
import path from 'path';

const deleteMockData = async () => {
    const envPath = path.resolve('.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
    const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
    
    if(!urlMatch || !keyMatch) return;
    
    const SUPABASE_URL = urlMatch[1].trim();
    const SUPABASE_KEY = keyMatch[1].trim();

    try {
        console.log("Borrando bicicletas de prueba...");
        const namesToDelete = [
            "META SX V5 RIDE",
            "SUPREME DH V5 SIGNATURE",
            "TEMPO ESSENTIAL",
            "CLASH RACE DARK SLATE",
            "FRS RIDE DIRT",
            "ABSOLUT RS",
            "META HT AM RACE",
            "FCB ESSENTIAL PURE WHITE"
        ];

        for (const name of namesToDelete) {
             const resp = await fetch(`${SUPABASE_URL}/rest/v1/productos?nombre=eq.${encodeURIComponent(name)}`, {
                 method: 'DELETE',
                 headers: {
                     'apikey': SUPABASE_KEY,
                     'Authorization': `Bearer ${SUPABASE_KEY}`
                 }
             });
             if (resp.ok) {
                 console.log(`✅ Borrado: ${name}`);
             } else {
                 console.error(`❌ Error borrando ${name}`);
             }
        }
        console.log("Limpieza completada.");
    } catch(e) {
        console.error(e);
    }
}
deleteMockData();
