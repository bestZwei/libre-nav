'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface SidebarProps {
  categories: Category[];
  activeCategory?: string | null;
  onCategoryClick: (categoryId: string | null) => void;
  className?: string;
  isMobileOpen?: boolean;
}

export function Sidebar({
  categories,
  activeCategory,
  onCategoryClick,
  className,
  isMobileOpen = false,
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.id))
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const getIcon = (iconName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-4 w-4" /> : <Icons.Box className="h-4 w-4" />;
  };

  return (
    <aside
      className={cn(
        'w-64 border-r bg-background h-[calc(100vh-4rem)] overflow-y-auto',
        'transition-transform duration-300 ease-in-out',
        'md:translate-x-0',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        'fixed md:sticky top-16 left-0 z-40',
        className
      )}
    >
      <nav className="p-4 space-y-2">
        {/* All Categories */}
        <button
          onClick={() => onCategoryClick(null)}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            !activeCategory
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Icons.LayoutGrid className="h-4 w-4" />
          <span>全部分类</span>
        </button>

        {/* Categories */}
        {categories.map(category => {
          const isExpanded = expandedCategories.has(category.id);
          const isActive = activeCategory === category.id;

          return (
            <div key={category.id}>
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="p-0.5 hover:bg-background/20 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={() => onCategoryClick(category.id)}
                  className="flex items-center gap-2 flex-1"
                >
                  {getIcon(category.icon)}
                  <span>{category.name}</span>
                </button>
              </div>

              {/* Category Description */}
              {isExpanded && category.description && (
                <p className="px-10 py-1 text-xs text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
