/**
 * Utility functions for handling database operations
 */

/**
 * Prepares data for Supabase by adding both camelCase and snake_case versions of fields
 * to ensure compatibility with different column naming styles
 * 
 * @param data The original data object
 * @returns A new object with both camelCase and snake_case versions of each field
 */
export function prepareDataWithColumnNameFormats<T extends Record<string, any>>(data: T): Record<string, any> {
  const result: Record<string, any> = {};
  
  // Process each field in the original data
  Object.entries(data).forEach(([key, value]) => {
    // Add the original field
    result[key] = value;
    
    // Convert camelCase to snake_case (if it's camelCase)
    if (/[A-Z]/.test(key)) {
      const snakeCase = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeCase] = value;
    }
    
    // Convert snake_case to camelCase (if it's snake_case)
    if (key.includes('_')) {
      const camelCase = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelCase] = value;
    }
  });
  
  return result;
}

/**
 * Formats date for database insertion
 * @param date Date to format
 * @returns ISO string date
 */
export function formatDateForDB(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
} 