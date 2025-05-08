/**
 * Utility functions for browser-related features
 */

/**
 * Prevents automatic page refresh when switching tabs or minimizing window
 * Works across different browsers
 */
export const preventPageRefresh = (): void => {
  // Fix for admin page to prevent automatic refreshes
  const isAdminPage = window.location.pathname.includes('/admin');
  
  // Add beforeunload handler to prevent accidental refresh
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    // Always prevent unload for admin pages
    if (isAdminPage || document.querySelector('form')?.querySelector('input, textarea, select')) {
      const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
      e.preventDefault();
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  };

  // Add event listener
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Prevent page refresh on tab/window focus
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // Aggressive prevention for admin page
      if (isAdminPage) {
        // Cancel any pending refreshes
        if (window.stop) {
          window.stop();
        }
        
        // Force disable page refreshing on visibility change
        setTimeout(() => {
          // Trigger restoration of form data
          window.dispatchEvent(new CustomEvent('form-restore'));
        }, 0);
      } else {
        // For non-admin pages, just dispatch the restore event
        window.dispatchEvent(new CustomEvent('form-restore'));
      }
    }
  };
  
  // For admin pages, use the Page Visibility API more aggressively
  if (isAdminPage) {
    // Override the default page reload behavior
    const originalReload = window.location.reload;
    window.location.reload = function(this: Location, forceReload?: boolean): void {
      // Only allow explicit manual reloads, not auto-reloads
      if (document.hasFocus() && document.visibilityState === 'visible') {
        originalReload.call(this);
        return;
      }
      console.log('Prevented automatic page reload');
    };
  }
  
  // Handle visibility change across different browsers
  document.addEventListener('visibilitychange', handleVisibilityChange, { capture: true });
  
  // Prevent mobile browsers from refreshing the page on window focus
  window.addEventListener('focus', (e) => {
    if (isAdminPage) {
      e.stopPropagation();
      e.preventDefault();
      
      // Dispatch form restore event
      window.dispatchEvent(new CustomEvent('form-restore'));
    } else {
      e.stopPropagation();
    }
  }, { capture: true });
  
  // Prevent browsers from refreshing when coming back to the page
  window.addEventListener('pageshow', (e) => {
    if (e.persisted || isAdminPage) {
      // The page was restored from cache, trigger form restoration
      if (window.stop) {
        window.stop();
      }
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('form-restore'));
      }, 0);
    }
  }, { capture: true });
  
  // Additional fix for Safari and mobile browsers
  document.addEventListener('resume', () => {
    if (isAdminPage) {
      if (window.stop) {
        window.stop();
      }
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('form-restore'));
      }, 0);
    }
  }, { capture: true });
  
  // Add a listener specifically for admin pages to handle refresh attempts
  if (isAdminPage) {
    // Use MutationObserver to detect DOM changes that might indicate a refresh
    const observer = new MutationObserver((mutations) => {
      // If we detect significant DOM changes and we're not focused,
      // it might be an automatic refresh - stop it
      if (mutations.length > 5 && !document.hasFocus()) {
        if (window.stop) {
          window.stop();
        }
        window.dispatchEvent(new CustomEvent('form-restore'));
      }
    });
    
    // Start observing the document body for DOM changes
    observer.observe(document.body, { 
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }
};

/**
 * Saves the current page state to session storage
 */
export const savePageState = (): void => {
  try {
    // Save current URL path to sessionStorage
    sessionStorage.setItem('lastPath', window.location.pathname + window.location.search + window.location.hash);
    
    // Save scroll position
    sessionStorage.setItem('scrollPosition', String(window.scrollY));
    
    // Save active admin tab if on admin page
    const activeTab = document.querySelector('[class*="bg-blue-50 text-blue-700"]')?.textContent;
    if (activeTab && window.location.pathname.includes('/admin')) {
      sessionStorage.setItem('adminActiveTab', activeTab.trim());
    }
    
    // Save any form data that isn't already handled by useFormPersistence
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      const formData: Record<string, string> = {};
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        const element = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const name = element.name || element.id;
        
        if (name) {
          if (element.type === 'checkbox' || element.type === 'radio') {
            formData[name] = (element as HTMLInputElement).checked ? 'true' : 'false';
          } else {
            formData[name] = element.value;
          }
        }
      });
      
      // Save form data to session storage
      if (Object.keys(formData).length > 0) {
        sessionStorage.setItem(`formData_${window.location.pathname}_${index}`, JSON.stringify(formData));
      }
    });
  } catch (e) {
    console.error('Failed to save page state:', e);
  }
};

/**
 * Restores the previously saved page state
 */
export const restorePageState = (): void => {
  try {
    // Restore active admin tab if on admin page
    if (window.location.pathname.includes('/admin')) {
      const activeTab = sessionStorage.getItem('adminActiveTab');
      if (activeTab) {
        // Find and click the tab button that matches the saved tab
        const tabButtons = document.querySelectorAll('button');
        tabButtons.forEach(button => {
          if (button.textContent?.trim() === activeTab) {
            button.click();
          }
        });
      }
    }
    
    // Restore scroll position
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
    }
    
    // Restore form data that isn't already handled by useFormPersistence
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      const formDataKey = `formData_${window.location.pathname}_${index}`;
      const savedFormData = sessionStorage.getItem(formDataKey);
      
      if (savedFormData) {
        const formData = JSON.parse(savedFormData);
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
          const element = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
          const name = element.name || element.id;
          
          if (name && formData[name] !== undefined) {
            if (element.type === 'checkbox' || element.type === 'radio') {
              (element as HTMLInputElement).checked = formData[name] === 'true';
            } else {
              element.value = formData[name];
            }
          }
        });
      }
    });
  } catch (e) {
    console.error('Failed to restore page state:', e);
  }
};

/**
 * Sets up event listeners for saving and restoring page state
 */
export const setupPageStateHandlers = (): void => {
  // Save state when page is about to unload
  window.addEventListener('beforeunload', savePageState);
  
  // Save state when visibility changes (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      savePageState();
    } else if (document.visibilityState === 'visible') {
      restorePageState();
    }
  });
  
  // Listen for form-restore events
  window.addEventListener('form-restore', restorePageState);
  
  // Try to restore state on page load
  window.addEventListener('load', restorePageState);
}; 