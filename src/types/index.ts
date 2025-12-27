// Site configuration types
export interface Site {
  title: string;
  description: string;
  keywords: string;
  logo: string;
  favicon: string;
  author: string;
  url: string;
}

// Settings types
export interface ThemeSettings {
  default: 'light' | 'dark';
  enableToggle: boolean;
  primaryColor: string;
}

export interface SearchSettings {
  enabled: boolean;
  pinyin: boolean;
  fuzzy: boolean;
  placeholder: string;
}

export interface GotoSettings {
  enabled: boolean;
  countdown: number;
  showWarning: boolean;
}

export interface LayoutSettings {
  columns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface Settings {
  theme: ThemeSettings;
  search: SearchSettings;
  goto: GotoSettings;
  layout: LayoutSettings;
}

// Category types
export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  order: number;
  visible: boolean;
}

// Navigation link types
export interface NavLink {
  id: string;
  title: string;
  url: string;
  description: string;
  logo?: string;
  categoryId: string;
  tags: string[];
  featured?: boolean;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Complete navigation data structure
export interface NavigationData {
  version: string;
  site: Site;
  settings: Settings;
  categories: Category[];
  links: NavLink[];
}

// Search result types
export interface SearchResult {
  item: NavLink;
  score?: number;
}

// User preferences (stored in localStorage)
export interface UserPreferences {
  favorites: string[]; // Array of link IDs
  searchHistory: string[];
  viewMode: 'grid' | 'list';
  theme: 'light' | 'dark' | 'system';
}

// Admin types
export interface AdminSession {
  authenticated: boolean;
  expiresAt: number;
}

// Form types
export interface LinkFormData {
  title: string;
  url: string;
  description: string;
  logo?: string;
  categoryId: string;
  tags: string[];
  featured?: boolean;
  visible: boolean;
}

export interface CategoryFormData {
  name: string;
  icon: string;
  description?: string;
  visible: boolean;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Statistics types for admin dashboard
export interface Statistics {
  totalLinks: number;
  totalCategories: number;
  totalViews?: number;
  recentlyAdded: NavLink[];
}
