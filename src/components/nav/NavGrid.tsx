'use client';

import { motion } from 'framer-motion';
import { NavCard } from './NavCard';
import type { NavLink } from '@/types';

interface NavGridProps {
  links: NavLink[];
  favorites?: string[];
  onFavoriteToggle?: (linkId: string) => void;
  onLinkClick?: (link: NavLink) => void;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function NavGrid({
  links,
  favorites = [],
  onFavoriteToggle,
  onLinkClick,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
}: NavGridProps) {
  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold mb-2">没有找到相关网站</h3>
        <p className="text-sm text-muted-foreground">
          尝试使用其他关键词搜索
        </p>
      </div>
    );
  }

  const gridClasses = [
    'grid gap-4',
    `grid-cols-${columns.mobile}`,
    `md:grid-cols-${columns.tablet}`,
    `lg:grid-cols-${columns.desktop}`,
  ].join(' ');

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className={gridClasses}
    >
      {links.map(link => (
        <NavCard
          key={link.id}
          link={link}
          isFavorite={favorites.includes(link.id)}
          onFavoriteToggle={onFavoriteToggle}
          onLinkClick={onLinkClick}
        />
      ))}
    </motion.div>
  );
}
