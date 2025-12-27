'use client';

import { motion } from 'framer-motion';
import { Link as LinkIcon, FolderTree, Eye, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { NavLink, Category } from '@/types';

interface StatsOverviewProps {
  links: NavLink[];
  categories: Category[];
}

export function StatsOverview({ links, categories }: StatsOverviewProps) {
  const visibleLinks = links.filter(link => link.visible).length;
  const visibleCategories = categories.filter(cat => cat.visible).length;
  const featuredLinks = links.filter(link => link.featured).length;

  const stats = [
    {
      title: '总链接数',
      value: links.length,
      icon: LinkIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: '显示链接',
      value: visibleLinks,
      icon: Eye,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: '分类数量',
      value: categories.length,
      icon: FolderTree,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: '推荐链接',
      value: featuredLinks,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
