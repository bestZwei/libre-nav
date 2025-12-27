'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { searchLinks } from '@/lib/search';
import { useLocalStorage } from './useLocalStorage';
import type { NavLink } from '@/types';

const MAX_HISTORY_ITEMS = 10;

/**
 * Hook for search functionality with history
 */
export function useSearch(links: NavLink[]) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('nav_search_history', []);

  // Perform search
  const results = useMemo(() => {
    if (!query || query.trim() === '') {
      return links;
    }
    return searchLinks(links, query);
  }, [query, links]);

  // Add to search history
  const addToHistory = useCallback(
    (searchTerm: string) => {
      if (!searchTerm || searchTerm.trim() === '') return;

      setSearchHistory(prev => {
        const trimmed = searchTerm.trim();
        // Remove if already exists
        const filtered = prev.filter(item => item !== trimmed);
        // Add to beginning
        const updated = [trimmed, ...filtered];
        // Keep only MAX_HISTORY_ITEMS
        return updated.slice(0, MAX_HISTORY_ITEMS);
      });
    },
    [setSearchHistory]
  );

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);

  // Remove item from history
  const removeFromHistory = useCallback(
    (searchTerm: string) => {
      setSearchHistory(prev => prev.filter(item => item !== searchTerm));
    },
    [setSearchHistory]
  );

  // Handle search query change
  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
    },
    []
  );

  // Handle search submit
  const handleSubmit = useCallback(() => {
    if (query) {
      addToHistory(query);
    }
  }, [query, addToHistory]);

  // Open search dialog
  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close search dialog
  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Toggle search dialog
  const toggleSearch = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Clear search query
  const clearQuery = useCallback(() => {
    setQuery('');
  }, []);

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      
      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleSearch, closeSearch]);

  return {
    query,
    results,
    isOpen,
    searchHistory,
    setQuery: handleSearch,
    handleSubmit,
    openSearch,
    closeSearch,
    toggleSearch,
    clearQuery,
    addToHistory,
    clearHistory,
    removeFromHistory,
    hasResults: results.length > 0,
    resultCount: results.length,
  };
}
