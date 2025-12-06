// src/utils/dateUtils.ts

/**
 * Formatea fechas tipo "YYYY-MM-DD" sin problemas de zona horaria.
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";

  // Si viene en formato ISO con hora, no tocarlo
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString);

  if (isDateOnly) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  // Si viene con hora, usar Intl, pero sin restar días
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};
