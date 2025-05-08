/**
 * Helper function to safely extract a category name from different possible data structures
 * This function handles the case where productCategories might be an array of strings or objects
 * 
 * @param category - The category data which can be a string or an object with a name property
 * @returns The category name or a default value
 */
export function getCategoryName(category: any): string {
  if (typeof category === 'string') {
    return category;
  }
  
  if (typeof category === 'object' && category !== null && 'name' in category) {
    return category.name;
  }
  
  return 'Service';
}

/**
 * Helper function to check if a product category list is valid
 * 
 * @param categories - The categories array to check
 * @returns True if the categories array is valid and has elements
 */
export function isValidCategoryList(categories: any): boolean {
  return Array.isArray(categories) && categories.length > 0;
} 