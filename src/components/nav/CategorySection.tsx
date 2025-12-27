'use client';

import { NavGrid } from './NavGrid';
import type { Category, NavLink } from '@/types';

interface CategorySectionProps {
  category: Category;
  links: NavLink[];
  favorites?: string[];
  onFavoriteToggle?: (linkId: string) => void;
  onLinkClick?: (link: NavLink) => void;
}

export function CategorySection({
  category,
  links,
  favorites,
  onFavoriteToggle,
  onLinkClick,
}: CategorySectionProps) {
  const categoryLinks = links.filter(link => link.categoryId === category.id);

  if (categoryLinks.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
        {category.description && (
          <p className="text-sm text-muted-foreground">{category.description}</p>
        )}
      </div>
      
      <NavGrid
        links={categoryLinks}
        favorites={favorites}
        onFavoriteToggle={onFavoriteToggle}
        onLinkClick={onLinkClick}
      />
    </section>
  );
}
