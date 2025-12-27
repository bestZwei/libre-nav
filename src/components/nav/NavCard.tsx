'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, StarOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { NavLink } from '@/types';

interface NavCardProps {
  link: NavLink;
  isFavorite?: boolean;
  onFavoriteToggle?: (linkId: string) => void;
  onLinkClick?: (link: NavLink) => void;
}

export function NavCard({
  link,
  isFavorite = false,
  onFavoriteToggle,
  onLinkClick,
}: NavCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    if (onLinkClick) {
      onLinkClick(link);
    } else {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(link.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'group relative overflow-hidden cursor-pointer transition-all duration-300',
          'hover:shadow-lg hover:border-primary/50',
          link.featured && 'ring-2 ring-primary/20'
        )}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Logo */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent flex items-center justify-center overflow-hidden">
              {link.logo && !imgError ? (
                <img
                  src={link.logo}
                  alt={link.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <ExternalLink className="h-6 w-6 text-muted-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
                
                {/* Favorite Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleFavoriteClick}
                  title={isFavorite ? '取消收藏' : '添加收藏'}
                >
                  {isFavorite ? (
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {link.description}
              </p>

              {/* Tags */}
              {link.tags && link.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {link.tags.slice(0, 3).map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-1.5 py-0 h-5"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {link.tags.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-1.5 py-0 h-5"
                    >
                      +{link.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Featured Badge */}
          {link.featured && (
            <div className="absolute top-2 right-2">
              <Badge variant="default" className="text-xs">
                推荐
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
