// logic.js - Datos estáticos y funciones de procesamiento

// 1. DATOS INICIALES (Base de datos por defecto)
export const initialData = [
  {NIF: "A81948077", Empresa: "ENDESA ENERGIA, S.A.U.", V2020: 85210, V2021: 75390, V2022: 78328, V2023: 75390, V2024: 68500},
  {NIF: "A80298896", Empresa: "CEPSA COMERCIAL PETROLEO, S.A.U.", V2020: 71631, V2021: 71796, V2022: 75500, V2023: 74000, V2024: 73200},
  {NIF: "A95758389", Empresa: "IBERDROLA CLIENTES, S.A.U.", V2020: 51557, V2021: 51557, V2022: 42000, V2023: 39293, V2024: 46500},
  {NIF: "A61797536", Empresa: "NATURGY IBERIA S.A.", V2020: 30751, V2021: 23978, V2022: 22388, V2023: 21500, V2024: 20100},
  {NIF: "A28559573", Empresa: "GALP ENERGÍA ESPAÑA, S.A.U.", V2020: 23744, V2021: 22253, V2022: 24500, V2023: 25100, V2024: 26000},
  {NIF: "A80298839", Empresa: "REPSOL PRODUCTOS PETROLIFEROS", V2020: 119846, V2021: 194426, V2022: 185000, V2023: 175000, V2024: 170000},
  {NIF: "A28135846", Empresa: "BP OIL ESPAÑA, S.A.U.", V2020: 34795, V2021: 39293, V2022: 38000, V2023: 37500, V2024: 36000},
  {NIF: "B82846825", Empresa: "ENERGIA XXI (ENDESA REF)", V2020: 12968, V2021: 12673, V2022: 12673, V2023: 12400, V2024: 12300},
  {NIF: "A95000295", Empresa: "TOTALENERGIES CLIENTES, S.A.U.", V2020: 14518, V2021: 23543, V2022: 23543, V2023: 25000, V2024: 26500},
  {NIF: "B31737422", Empresa: "ACCIONA GREEN ENERGY", V2020: 4992, V2021: 6349, V2022: 6500, V2023: 6700, V2024: 6900},
  {NIF: "B83160994", Empresa: "AXPO IBERIA S.L.", V2020: 14727, V2021: 12969, V2022: 14727, V2023: 10500, V2024: 10000},
  {NIF: "A85908036", Empresa: "FENIE ENERGIA, S.A.", V2020: 2476, V2021: 2127, V2022: 2127, V2023: 2000, V2024: 1950}
];

// 2. FUNCIÓN DE PROCESAMIENTO DE CSV
export function parseCSV(content, filename, currentData) {
  let year = null;
  // Detección rudimentaria del año en el nombre del archivo
  if(filename.includes("2019")) year = 2019;
  else if(filename.includes("2020")) year = 2020;
  else if(filename.includes("2021")) year = 2021;
  else if(filename.includes("2022")) year = 2022;
  else if(filename.includes("2023")) year = 2023;
  else if(filename.includes("2024")) year = 2024;
  
  if (!year) return { success: false, error: "Año no detectado en nombre de archivo (ej: datos_2024.csv)" };

  const lines = content.split('\n');
  let currentMap = new Map();
  
  // Clonamos los datos actuales para no perder lo que ya teníamos
  currentData.forEach(d => currentMap.set(d.NIF, {...d}));

  lines.forEach((line, idx) => {
    if(idx === 0 || !line.trim()) return; // Saltar cabecera o líneas vacías
    
    // Asumimos formato CSV separado por punto y coma (común en Excel español)
    const parts = line.split(';'); 
    
    if(parts.length >= 3) {
      let cif = parts[0].replace(/"/g, '').trim().toUpperCase();
      let name = parts[1].replace(/"/g, '').trim();
      
      // Limpieza de formato español (1.000,00 -> 1000.00) para que JS lo entienda
      let salesStr = parts[2].replace(/"/g, '').trim().replace(/\./g,'').replace(',','.'); 
      let sales = parseFloat(salesStr) || 0;

      // Si la empresa no existe, la creamos
      if(!currentMap.has(cif)) {
        currentMap.set(cif, { NIF: cif, Empresa: name });
      }
      
      // Actualizamos el año correspondiente
      let entry = currentMap.get(cif);
      entry[`V${year}`] = sales;
      
      // Si el nombre nuevo es más largo, probablemente sea más completo, lo actualizamos
      if(name.length > (entry.Empresa?.length || 0)) entry.Empresa = name; 
    }
  });

  return { success: true, year: year, newData: Array.from(currentMap.values()) };
}