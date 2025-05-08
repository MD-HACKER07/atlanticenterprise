import { useState, useEffect } from 'react';

/**
 * Custom hook for preserving component state across page navigations or tab switches
 * @param key A unique key to identify this state in storage
 * @param initialState The initial state value
 * @returns [state, setState] similar to useState
 */
export function useStatePreservation<T>(key: string, initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Use a unique storage key prefixed with "preserved_state_"
  const storageKey = `preserved_state_${key}`;
  
  // Initialize state from sessionStorage if available, otherwise use initialState
  const [state, setState] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      console.error(`Error retrieving preserved state for ${key}:`, error);
      return initialState;
    }
  });
  
  // Update sessionStorage whenever the state changes
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error(`Error storing preserved state for ${key}:`, error);
    }
  }, [state, storageKey]);
  
  // Save to sessionStorage when visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
          console.error(`Error storing preserved state for ${key}:`, error);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state, storageKey]);
  
  return [state, setState];
}

export default useStatePreservation; 