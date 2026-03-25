import { create } from 'zustand';
import { User, Notification } from '../types';

// ============================================================================
// LOCALE STORE
// ============================================================================

interface LocaleState {
  locale: 'en' | 'ar' | 'zh';
  setLocale: (locale: 'en' | 'ar' | 'zh') => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'en',
  setLocale: (locale) => set({ locale }),
}));

// ============================================================================
// THEME STORE
// ============================================================================

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));

// ============================================================================
// AUTH STORE
// ============================================================================

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  login: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
  login: (user) => set({ user, isAuthenticated: true }),
}));

// ============================================================================
// NOTIFICATIONS STORE
// ============================================================================

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50), // Keep only last 50
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  clearAll: () => set({ notifications: [] }),
}));

// ============================================================================
// DEALS STORE
// ============================================================================

interface DealsState {
  activeDealId: string | null;
  setActiveDeal: (dealId: string | null) => void;
  filters: {
    stage?: string;
    status?: string;
    dateRange?: [Date, Date];
  };
  setFilters: (filters: DealsState['filters']) => void;
}

export const useDealsStore = create<DealsState>((set) => ({
  activeDealId: null,
  setActiveDeal: (dealId) => set({ activeDealId: dealId }),
  filters: {},
  setFilters: (filters) => set({ filters }),
}));

// ============================================================================
// SIDEBAR STORE
// ============================================================================

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleOpen: () => void;
  toggleCollapsed: () => void;
  setOpen: (open: boolean) => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isCollapsed: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setOpen: (open) => set({ isOpen: open }),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
}));

// ============================================================================
// MODAL STORE
// ============================================================================

interface ModalState {
  openModals: string[];
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  isModalOpen: (id: string) => boolean;
}

export const useModalStore = create<ModalState>((set, get) => ({
  openModals: [],
  openModal: (id) =>
    set((state) => ({
      openModals: state.openModals.includes(id) ? state.openModals : [...state.openModals, id],
    })),
  closeModal: (id) =>
    set((state) => ({
      openModals: state.openModals.filter((m) => m !== id),
    })),
  closeAllModals: () => set({ openModals: [] }),
  isModalOpen: (id) => get().openModals.includes(id),
}));

// ============================================================================
// SEARCH STORE
// ============================================================================

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  results: any[];
  setResults: (results: any[]) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  results: [],
  setResults: (results) => set({ results }),
  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching }),
}));

// ============================================================================
// FILTERS STORE
// ============================================================================

interface FiltersState {
  activeFilters: Record<string, string | string[]>;
  setFilter: (key: string, value: string | string[]) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  activeFilters: {},
  setFilter: (key, value) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, [key]: value },
    })),
  removeFilter: (key) =>
    set((state) => {
      const { [key]: _, ...rest } = state.activeFilters;
      return { activeFilters: rest };
    }),
  clearFilters: () => set({ activeFilters: {} }),
}));

// ============================================================================
// COMBINED STORE SELECTOR
// ============================================================================

/**
 * Composite hook to access common store states
 */
export function useAppStore() {
  const locale = useLocaleStore();
  const theme = useThemeStore();
  const auth = useAuthStore();
  const notifications = useNotificationStore();
  const deals = useDealsStore();
  const sidebar = useSidebarStore();

  return {
    locale,
    theme,
    auth,
    notifications,
    deals,
    sidebar,
  };
}
