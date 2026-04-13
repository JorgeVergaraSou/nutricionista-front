export type Analito = {
  nombre: string;
  unidad?: string;
  min?: number;
  max?: number;
};

export const ANALITOS: Analito[] = [
  // 🩸 GLUCOSA Y LIPIDOS
  { nombre: "Glucosa", unidad: "mg/dL", min: 70, max: 100 },
  { nombre: "Hemoglobina glicosilada (HbA1c)", unidad: "%", min: 4, max: 5.6 },
  { nombre: "Colesterol total", unidad: "mg/dL", max: 200 },
  { nombre: "Colesterol HDL", unidad: "mg/dL", min: 40 },
  { nombre: "Colesterol LDL", unidad: "mg/dL", max: 130 },
  { nombre: "Triglicéridos", unidad: "mg/dL", max: 150 },

  // 🩸 FUNCION RENAL
  { nombre: "Urea", unidad: "mg/dL", min: 10, max: 50 },
  { nombre: "Creatinina", unidad: "mg/dL", min: 0.7, max: 1.3 },
  { nombre: "Ácido úrico", unidad: "mg/dL", min: 3.5, max: 7.2 },

  // 🩸 HEMOGRAMA
  { nombre: "Hemoglobina", unidad: "g/dL", min: 12, max: 17 },
  { nombre: "Hematocrito", unidad: "%", min: 36, max: 50 },
  { nombre: "Leucocitos", unidad: "x10^3/µL", min: 4, max: 10 },
  { nombre: "Plaquetas", unidad: "x10^3/µL", min: 150, max: 400 },

  // 🩸 ELECTROLITOS
  { nombre: "Sodio", unidad: "mEq/L", min: 135, max: 145 },
  { nombre: "Potasio", unidad: "mEq/L", min: 3.5, max: 5.0 },
  { nombre: "Cloro", unidad: "mEq/L", min: 98, max: 107 },

  // 🩸 HIGADO
  { nombre: "AST (TGO)", unidad: "U/L", max: 40 },
  { nombre: "ALT (TGP)", unidad: "U/L", max: 41 },
  { nombre: "Fosfatasa alcalina", unidad: "U/L", min: 40, max: 130 },
  { nombre: "Bilirrubina total", unidad: "mg/dL", min: 0.2, max: 1.2 },

  // 🩸 PROTEINAS
  { nombre: "Proteínas totales", unidad: "g/dL", min: 6, max: 8.3 },
  { nombre: "Albúmina", unidad: "g/dL", min: 3.5, max: 5.0 },

  // 🩸 HORMONAS
  { nombre: "TSH", unidad: "µUI/mL", min: 0.4, max: 4.0 },
  { nombre: "T4 libre", unidad: "ng/dL", min: 0.8, max: 1.8 },

  // 🩸 INFLAMACION
  { nombre: "Proteína C reactiva (PCR)", unidad: "mg/L", max: 5 },

  // 🧪 ORINA
  { nombre: "pH urinario", unidad: "", min: 5, max: 7 },
  { nombre: "Densidad urinaria", unidad: "", min: 1.005, max: 1.030 },
  { nombre: "Proteínas en orina", unidad: "mg/dL", max: 150 },
  { nombre: "Glucosa en orina", unidad: "mg/dL", max: 0 },
  { nombre: "Cetonas", unidad: "mg/dL", max: 0 },
  { nombre: "Leucocitos en orina", unidad: "/campo", max: 5 },
  { nombre: "Eritrocitos en orina", unidad: "/campo", max: 3 },

  // 🧬 OTROS IMPORTANTES
  { nombre: "Calcio", unidad: "mg/dL", min: 8.5, max: 10.5 },
  { nombre: "Hierro", unidad: "µg/dL", min: 60, max: 170 },
  { nombre: "Ferritina", unidad: "ng/mL", min: 30, max: 400 },
  { nombre: "Vitamina B12", unidad: "pg/mL", min: 200, max: 900 },
  { nombre: "Vitamina D", unidad: "ng/mL", min: 20, max: 50 },
];