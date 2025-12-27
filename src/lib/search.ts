import Fuse, { IFuseOptions } from 'fuse.js';
import { match } from 'pinyin-pro';
import type { NavLink } from '@/types';

/**
 * Fuse.js configuration for fuzzy search
 */
const fuseOptions: IFuseOptions<NavLink> = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 1,
  ignoreLocation: true,
};

/**
 * Search links using fuzzy matching and pinyin
 */
export function searchLinks(links: NavLink[], query: string): NavLink[] {
  if (!query || query.trim() === '') {
    return links;
  }

  const trimmedQuery = query.trim().toLowerCase();
  
  // Create Fuse instance
  const fuse = new Fuse(links, fuseOptions);
  
  // Fuzzy search results
  const fuseResults = fuse.search(trimmedQuery).map(result => ({
    item: result.item,
    score: result.score || 0,
  }));

  // Pinyin search results
  const pinyinResults: Array<{ item: NavLink; score: number }> = [];
  
  links.forEach(link => {
    // Check title match
    const titleMatch = match(link.title, trimmedQuery, { 
      precision: 'any',
      continuous: true 
    });
    
    // Check description match
    const descMatch = match(link.description, trimmedQuery, { 
      precision: 'any',
      continuous: true 
    });
    
    // Check tags match
    const tagsMatch = link.tags.some(tag => 
      match(tag, trimmedQuery, { precision: 'any', continuous: true })
    );
    
    if (titleMatch || descMatch || tagsMatch) {
      // Calculate score based on match type
      let score = 0;
      if (titleMatch) score += 0.5;
      if (descMatch) score += 0.3;
      if (tagsMatch) score += 0.2;
      
      pinyinResults.push({ item: link, score });
    }
  });

  // Combine and deduplicate results
  const resultsMap = new Map<string, { item: NavLink; score: number }>();
  
  // Add fuzzy results
  fuseResults.forEach(result => {
    resultsMap.set(result.item.id, result);
  });
  
  // Add or update with pinyin results
  pinyinResults.forEach(result => {
    const existing = resultsMap.get(result.item.id);
    if (!existing || result.score < existing.score) {
      resultsMap.set(result.item.id, result);
    }
  });
  
  // Sort by score and return items
  return Array.from(resultsMap.values())
    .sort((a, b) => a.score - b.score)
    .map(result => result.item);
}

/**
 * Filter links by category
 */
export function filterByCategory(links: NavLink[], categoryId: string): NavLink[] {
  if (!categoryId) return links;
  return links.filter(link => link.categoryId === categoryId);
}

/**
 * Filter links by tags
 */
export function filterByTags(links: NavLink[], tags: string[]): NavLink[] {
  if (!tags || tags.length === 0) return links;
  
  return links.filter(link => 
    tags.some(tag => link.tags.includes(tag))
  );
}

/**
 * Get featured links
 */
export function getFeaturedLinks(links: NavLink[]): NavLink[] {
  return links.filter(link => link.featured);
}

/**
 * Sort links by order
 */
export function sortLinksByOrder(links: NavLink[]): NavLink[] {
  return [...links].sort((a, b) => a.order - b.order);
}

/**
 * Sort links by creation date
 */
export function sortLinksByDate(links: NavLink[], order: 'asc' | 'desc' = 'desc'): NavLink[] {
  return [...links].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Get all unique tags from links
 */
export function getAllTags(links: NavLink[]): string[] {
  const tagsSet = new Set<string>();
  links.forEach(link => {
    link.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
}

/**
 * Highlight search query in text
 */
export function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
