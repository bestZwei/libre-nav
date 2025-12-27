'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { NavGrid } from '@/components/nav/NavGrid';
import { CategorySection } from '@/components/nav/CategorySection';
import { SearchDialog } from '@/components/search/SearchDialog';
import { useSearch } from '@/hooks/useSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'sonner';
import type { Category, NavLink } from '@/types';

interface HomeClientProps {
  initialLinks: NavLink[];
  initialCategories: Category[];
  siteName: string;
}

export function HomeClient({
  initialLinks,
  initialCategories,
  siteName,
}: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    query,
    results,
    isOpen,
    searchHistory,
    setQuery,
    openSearch,
    closeSearch,
    addToHistory,
    clearHistory,
    removeFromHistory,
  } = useSearch(initialLinks);

  const {
    favorites,
    toggleFavorite,
    getFavoriteLinks,
  } = useFavorites();

  // Filter links based on active category
  const displayLinks = activeCategory
    ? initialLinks.filter(link => link.categoryId === activeCategory && link.visible)
    : initialLinks.filter(link => link.visible);

  // Handle link click (for goto page)
  const handleLinkClick = (link: NavLink) => {
    // Store link data in localStorage for goto page
    localStorage.setItem(`goto_${link.id}`, JSON.stringify(link));
    // Navigate to goto page
    window.location.href = `/goto/${link.id}`;
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (linkId: string) => {
    toggleFavorite(linkId);
    const link = initialLinks.find(l => l.id === linkId);
    if (link) {
      const isFav = favorites.includes(linkId);
      toast.success(
        isFav ? `已取消收藏 ${link.title}` : `已收藏 ${link.title}`
      );
    }
  };

  // Handle search history click
  const handleHistoryClick = (searchTerm: string) => {
    setQuery(searchTerm);
    addToHistory(searchTerm);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        siteName={siteName}
        onSearchClick={openSearch}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 flex">
        <Sidebar
          categories={initialCategories}
          activeCategory={activeCategory}
          onCategoryClick={setActiveCategory}
          isMobileOpen={isMobileMenuOpen}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-1.5">
                {activeCategory
                  ? initialCategories.find(c => c.id === activeCategory)?.name
                  : '全部分类'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeCategory
                  ? initialCategories.find(c => c.id === activeCategory)?.description
                  : `共 ${displayLinks.length} 个精选网站`}
              </p>
            </div>

            {/* Favorites Section (if any) */}
            {!activeCategory && favorites.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>⭐</span>
                  <span>我的收藏</span>
                </h2>
                <NavGrid
                  links={getFavoriteLinks(initialLinks)}
                  favorites={favorites}
                  onFavoriteToggle={handleFavoriteToggle}
                  onLinkClick={handleLinkClick}
                />
              </section>
            )}

            {/* Links Grid or Category Sections */}
            {activeCategory ? (
              <NavGrid
                links={displayLinks}
                favorites={favorites}
                onFavoriteToggle={handleFavoriteToggle}
                onLinkClick={handleLinkClick}
              />
            ) : (
              <>
                {initialCategories.map(category => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    links={initialLinks.filter(link => link.visible)}
                    favorites={favorites}
                    onFavoriteToggle={handleFavoriteToggle}
                    onLinkClick={handleLinkClick}
                  />
                ))}
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isOpen}
        onClose={closeSearch}
        query={query}
        onQueryChange={setQuery}
        results={results}
        searchHistory={searchHistory}
        onHistoryClick={handleHistoryClick}
        onHistoryRemove={removeFromHistory}
        onClearHistory={clearHistory}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
        onLinkClick={handleLinkClick}
      />
    </div>
  );
}
