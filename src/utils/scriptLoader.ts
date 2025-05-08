/**
 * Loads an external script and returns a promise
 * @param src - The URL of the script to load
 * @returns Promise that resolves when the script is loaded
 */
export const loadScript = (src: string): Promise<HTMLScriptElement> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve(existingScript as HTMLScriptElement);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    // Set up load and error handlers
    script.onload = () => {
      resolve(script);
    };
    
    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };
    
    // Add to document
    document.body.appendChild(script);
  });
}; 