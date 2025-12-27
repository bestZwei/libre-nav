'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { NavLink } from '@/types';

/**
 * Hook for managing user favorites
 */
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('nav_favorites', []);

  // Check if a link is favorited
  const isFavorite = useCallback(
    (linkId: string): boolean => {
      return favorites.includes(linkId);
    },
    [favorites]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (linkId: string) => {
      setFavorites(prev => {
        if (prev.includes(linkId)) {
          return prev.filter(id => id !== linkId);
        } else {
          return [...prev, linkId];
        }
      });
    },
    [setFavorites]
  );

  // Add to favorites
  const addFavorite = useCallback(
    (linkId: string) => {
      setFavorites(prev => {
        if (!prev.includes(linkId)) {
          return [...prev, linkId];
        }
        return prev;
      });
    },
    [setFavorites]
  );

  // Remove from favorites
  const removeFavorite = useCallback(
    (linkId: string) => {
      setFavorites(prev => prev.filter(id => id !== linkId));
    },
    [setFavorites]
  );

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  // Get favorite links from all links
  const getFavoriteLinks = useCallback(
    (allLinks: NavLink[]): NavLink[] => {
      return allLinks.filter(link => favorites.includes(link.id));
    },
    [favorites]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    getFavoriteLinks,
    count: favorites.length,
  };
}
