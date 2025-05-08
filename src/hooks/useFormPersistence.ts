import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting form data in browser storage
 * This helps prevent data loss when the page refreshes or when switching tabs
 * 
 * @param key A unique key to identify the stored form data
 * @param initialState The initial state of the form
 * @returns An array containing the form state and a function to update it
 */
function useFormPersistence<T>(key: string, initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Get stored data from localStorage if it exists
  const getStoredValue = (): T => {
    if (typeof window === 'undefined') {
      return initialState;
    }
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      console.error('Error retrieving stored form data:', error);
      return initialState;
    }
  };
  
  // Initialize state with stored value
  const [value, setValue] = useState<T>(getStoredValue);
  
  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        
        // Also save to sessionStorage as a backup
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error storing form data:', error);
      }
    }
  }, [key, value]);
  
  // Listen for visibility changes to prevent data loss
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // When the tab becomes hidden, ensure the latest data is saved
        try {
          localStorage.setItem(key, JSON.stringify(value));
          sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error saving form state on visibility change:', error);
        }
      } else if (document.visibilityState === 'visible') {
        // When the tab becomes visible again, check if we need to restore data
        try {
          const storedValue = localStorage.getItem(key);
          if (storedValue) {
            setValue(JSON.parse(storedValue));
          }
        } catch (error) {
          console.error('Error restoring form state on visibility change:', error);
        }
      }
    };
    
    // Add event listener for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add event listener for beforeunload to save data
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving form state before unload:', error);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [key, value]);
  
  return [value, setValue];
}

export default useFormPersistence; 