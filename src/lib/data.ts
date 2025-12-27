import fs from 'fs/promises';
import path from 'path';
import type { NavigationData, NavLink, Category } from '@/types';

const DATA_PATH = path.join(process.cwd(), 'public/data/navigation.json');

/**
 * Get navigation data from JSON file
 */
export async function getNavigationData(): Promise<NavigationData> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading navigation data:', error);
    throw new Error('Failed to load navigation data');
  }
}

/**
 * Update navigation data to JSON file
 */
export async function updateNavigationData(data: NavigationData): Promise<void> {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing navigation data:', error);
    throw new Error('Failed to save navigation data');
  }
}

/**
 * Get all visible links
 */
export async function getVisibleLinks(): Promise<NavLink[]> {
  const data = await getNavigationData();
  return data.links
    .filter(link => link.visible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get all visible categories
 */
export async function getVisibleCategories(): Promise<Category[]> {
  const data = await getNavigationData();
  return data.categories
    .filter(cat => cat.visible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get links by category ID
 */
export async function getLinksByCategory(categoryId: string): Promise<NavLink[]> {
  const data = await getNavigationData();
  return data.links
    .filter(link => link.categoryId === categoryId && link.visible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get link by ID
 */
export async function getLinkById(id: string): Promise<NavLink | null> {
  const data = await getNavigationData();
  return data.links.find(link => link.id === id) || null;
}

/**
 * Add new link
 */
export async function addLink(link: Omit<NavLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<NavLink> {
  const data = await getNavigationData();
  
  const newLink: NavLink = {
    ...link,
    id: `link-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  data.links.push(newLink);
  await updateNavigationData(data);
  
  return newLink;
}

/**
 * Update link
 */
export async function updateLink(id: string, updates: Partial<NavLink>): Promise<NavLink | null> {
  const data = await getNavigationData();
  const index = data.links.findIndex(link => link.id === id);
  
  if (index === -1) return null;
  
  data.links[index] = {
    ...data.links[index],
    ...updates,
    id, // Prevent ID change
    updatedAt: new Date().toISOString(),
  };
  
  await updateNavigationData(data);
  return data.links[index];
}

/**
 * Delete link
 */
export async function deleteLink(id: string): Promise<boolean> {
  const data = await getNavigationData();
  const index = data.links.findIndex(link => link.id === id);
  
  if (index === -1) return false;
  
  data.links.splice(index, 1);
  await updateNavigationData(data);
  
  return true;
}

/**
 * Add new category
 */
export async function addCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const data = await getNavigationData();
  
  const newCategory: Category = {
    ...category,
    id: `cat-${Date.now()}`,
  };
  
  data.categories.push(newCategory);
  await updateNavigationData(data);
  
  return newCategory;
}

/**
 * Update category
 */
export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const data = await getNavigationData();
  const index = data.categories.findIndex(cat => cat.id === id);
  
  if (index === -1) return null;
  
  data.categories[index] = {
    ...data.categories[index],
    ...updates,
    id, // Prevent ID change
  };
  
  await updateNavigationData(data);
  return data.categories[index];
}

/**
 * Delete category
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const data = await getNavigationData();
  const index = data.categories.findIndex(cat => cat.id === id);
  
  if (index === -1) return false;
  
  // Check if category has links
  const hasLinks = data.links.some(link => link.categoryId === id);
  if (hasLinks) {
    throw new Error('Cannot delete category with existing links');
  }
  
  data.categories.splice(index, 1);
  await updateNavigationData(data);
  
  return true;
}

/**
 * Get site settings
 */
export async function getSiteSettings() {
  const data = await getNavigationData();
  return {
    site: data.site,
    settings: data.settings,
  };
}

/**
 * Update site settings
 */
export async function updateSiteSettings(updates: Partial<NavigationData['site']> | Partial<NavigationData['settings']>) {
  const data = await getNavigationData();
  
  if ('title' in updates || 'description' in updates) {
    data.site = { ...data.site, ...updates };
  } else {
    data.settings = { ...data.settings, ...updates };
  }
  
  await updateNavigationData(data);
  return data;
}
