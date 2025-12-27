'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { LinkDialog } from './LinkDialog';
import type { NavLink, Category } from '@/types';

interface LinkManagerProps {
  links: NavLink[];
  categories: Category[];
  onRefresh: () => void;
}

export function LinkManager({ links, categories, onRefresh }: LinkManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<NavLink | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = () => {
    setEditingLink(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (link: NavLink) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个链接吗？')) return;

    try {
      const response = await fetch(`/api/links?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('链接删除成功');
        onRefresh();
      } else {
        toast.error(data.error || '删除失败');
      }
    } catch (error) {
      console.error('Delete link error:', error);
      toast.error('删除链接失败');
    }
  };

  const handleToggleVisible = async (link: NavLink) => {
    try {
      const response = await fetch('/api/links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: link.id,
          visible: !link.visible,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(link.visible ? '已隐藏' : '已显示');
        onRefresh();
      } else {
        toast.error(data.error || '更新失败');
      }
    } catch (error) {
      console.error('Toggle visible error:', error);
      toast.error('操作失败');
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || '未知分类';
  };

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCategoryName(link.categoryId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>链接列表</CardTitle>
              <CardDescription>管理所有导航链接</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="搜索链接..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                添加链接
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Logo</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="w-[100px]">状态</TableHead>
                  <TableHead className="w-[180px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      {searchQuery ? '没有找到匹配的链接' : '还没有添加链接'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLinks.map((link, index) => (
                    <motion.tr
                      key={link.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell>
                        {link.logo ? (
                          <img
                            src={link.logo}
                            alt={link.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs">
                            {link.title.charAt(0)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{link.title}</span>
                          {link.featured && (
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          )}
                        </div>
                        {link.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {link.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getCategoryName(link.categoryId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline flex items-center gap-1 max-w-[200px] truncate"
                        >
                          {link.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        {link.visible ? (
                          <Badge className="bg-green-500">显示</Badge>
                        ) : (
                          <Badge variant="secondary">隐藏</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleVisible(link)}
                          >
                            {link.visible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(link)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(link.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <LinkDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        link={editingLink}
        categories={categories}
        onSuccess={() => {
          setIsDialogOpen(false);
          setEditingLink(null);
          onRefresh();
        }}
      />
    </>
  );
}
