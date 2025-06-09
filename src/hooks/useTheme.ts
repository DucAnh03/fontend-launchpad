
import webStorageClient from '../utils/webStorageClient';
import {create} from 'zustand';

interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  darkMode: false, // Khởi tạo với false, sẽ cập nhật sau
  toggleDarkMode: () => set((state) => {
    const newMode = !state.darkMode;
    if (typeof window !== 'undefined') {
      webStorageClient.set('displayMode', newMode ? 'dark' : 'light');
    }
    return { darkMode: newMode };
  }),
}));

export default useThemeStore;
