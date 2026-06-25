// AquaEstate Notification Context
// Manages notification preferences

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../config/config';

interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
}

interface NotificationContextType {
  pushEnabled: boolean;
  emailEnabled: boolean;
  togglePush: () => Promise<void>;
  toggleEmail: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_PREFS: NotificationPreferences = {
  pushEnabled: true,
  emailEnabled: true,
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);

  // Load preferences from AsyncStorage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const stored = await AsyncStorage.getItem(
          CONFIG.STORAGE_KEYS.NOTIFICATION_PREFS
        );
        if (stored) {
          const parsed: NotificationPreferences = JSON.parse(stored);
          setPrefs(parsed);
        }
      } catch (error) {
        console.warn('Failed to load notification preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  const savePreferences = useCallback(
    async (newPrefs: NotificationPreferences) => {
      try {
        await AsyncStorage.setItem(
          CONFIG.STORAGE_KEYS.NOTIFICATION_PREFS,
          JSON.stringify(newPrefs)
        );
      } catch (error) {
        console.warn('Failed to save notification preferences:', error);
      }
    },
    []
  );

  const togglePush = useCallback(async () => {
    const newPrefs = { ...prefs, pushEnabled: !prefs.pushEnabled };
    setPrefs(newPrefs);
    await savePreferences(newPrefs);
  }, [prefs, savePreferences]);

  const toggleEmail = useCallback(async () => {
    const newPrefs = { ...prefs, emailEnabled: !prefs.emailEnabled };
    setPrefs(newPrefs);
    await savePreferences(newPrefs);
  }, [prefs, savePreferences]);

  const value: NotificationContextType = {
    pushEnabled: prefs.pushEnabled,
    emailEnabled: prefs.emailEnabled,
    togglePush,
    toggleEmail,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook to access notification preferences and toggles
 */
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};
