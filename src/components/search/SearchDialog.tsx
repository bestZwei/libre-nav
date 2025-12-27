'use client';

import { useEffect, useRef } from 'react';
import { Search, X, Clock, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavCard } from '@/components/nav/NavCard';
import type { NavLink } from '@/types';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: NavLink[];
  searchHistory: string[];
  onHistoryClick: (query: string) => void;
  onHistoryRemove: (query: string) => void;
  onClearHistory: () => void;
  favorites?: string[];
  onFavoriteToggle?: (linkId: string) => void;
  onLinkClick?: (link: NavLink) => void;
}

export function SearchDialog({
  isOpen,
  onClose,
  query,
  onQueryChange,
  results,
  searchHistory,
  onHistoryClick,
  onHistoryRemove,
  onClearHistory,
  favorites = [],
  onFavoriteToggle,
  onLinkClick,
}: SearchDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input when dialog opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const showHistory = !query && searchHistory.length > 0;
  const showResults = query && results.length > 0;
  const showNoResults = query && results.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="sr-only">搜索网站</DialogTitle>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="搜索网站..."
              value={query}
              onChange={e => onQueryChange(e.target.value)}
              className="w-full pl-10 pr-10 h-12 text-base"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => onQueryChange('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(80vh-8rem)] px-6 pb-6">
          {/* Search History */}
          {showHistory && (
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  <span>搜索历史</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearHistory}
                  className="h-7 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  清空
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {searchHistory.map(item => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="cursor-pointer hover:bg-accent group relative pr-8"
                    onClick={() => onHistoryClick(item)}
                  >
                    {item}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-6 opacity-0 group-hover:opacity-100"
                      onClick={e => {
                        e.stopPropagation();
                        onHistoryRemove(item);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {showResults && (
            <div className="space-y-3 mt-4">
              <div className="text-sm text-muted-foreground">
                找到 {results.length} 个结果
              </div>
              <div className="grid gap-3">
                {results.map(link => (
                  <NavCard
                    key={link.id}
                    link={link}
                    isFavorite={favorites.includes(link.id)}
                    onFavoriteToggle={onFavoriteToggle}
                    onLinkClick={link => {
                      onLinkClick?.(link);
                      onClose();
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {showNoResults && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold mb-1">未找到相关结果</h3>
              <p className="text-sm text-muted-foreground">
                尝试使用其他关键词搜索
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
