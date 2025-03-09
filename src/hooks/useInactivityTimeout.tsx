
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export function useInactivityTimeout(
  isAuthenticated: boolean, 
  onTimeout: () => void, 
  timeoutDuration: number = 10 * 60 * 1000 // Default 10 minutes
) {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  // Reset inactivity timer on user activity
  const resetInactivityTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Check for user inactivity
  useEffect(() => {
    if (isAuthenticated) {
      // Clear any existing timer
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        // Call the timeout handler
        onTimeout();
        toast('You have been logged out due to inactivity', {
          description: 'Please login again to continue.',
        });
      }, timeoutDuration);

      setInactivityTimer(timer);

      // Set up event listeners for user activity
      const activityEvents = [
        'mousedown', 'mousemove', 'keypress',
        'scroll', 'touchstart', 'click'
      ];

      activityEvents.forEach(event => {
        window.addEventListener(event, resetInactivityTimer);
      });

      return () => {
        // Cleanup event listeners and timer
        activityEvents.forEach(event => {
          window.removeEventListener(event, resetInactivityTimer);
        });
        
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [isAuthenticated, lastActivity, onTimeout, resetInactivityTimer, timeoutDuration]);

  return { resetInactivityTimer };
}
