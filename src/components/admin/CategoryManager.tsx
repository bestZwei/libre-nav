'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { CategoryDialog } from './CategoryDialog';
import type { NavLink, Category } from '@/types';

interface CategoryManagerProps {
  categories: Category[];
  links: NavLink[];
  onRefresh: () => void;
}

export function CategoryManager({ categories, links, onRefresh }: CategoryManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const categoryLinks = links.filter(link => link.categoryId === id);
    
    if (categoryLinks.length > 0) {
      toast.error(`该分类下有 ${categoryLinks.length} 个链接，无法删除`);
      return;
    }

    if (!confirm('确定要删除这个分类吗？')) return;

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('分类删除成功');
        onRefresh();
      } else {
        toast.error(data.error || '删除失败');
      }
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error('删除分类失败');
    }
  };

  const handleToggleVisible = async (category: Category) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: category.id,
          visible: !category.visible,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(category.visible ? '已隐藏' : '已显示');
        onRefresh();
      } else {
        toast.error(data.error || '更新失败');
      }
    } catch (error) {
      console.error('Toggle visible error:', error);
      toast.error('操作失败');
    }
  };

  const getLinkCount = (categoryId: string) => {
    return links.filter(link => link.categoryId === categoryId).length;
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>分类列表</CardTitle>
              <CardDescription>管理导航分类</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              添加分类
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">图标</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead className="w-[100px]">链接数</TableHead>
                  <TableHead className="w-[100px]">状态</TableHead>
                  <TableHead className="w-[180px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      还没有添加分类
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category, index) => (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                          {renderIcon(category.icon)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{category.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {category.description || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getLinkCount(category.id)} 个
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {category.visible ? (
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
                            onClick={() => handleToggleVisible(category)}
                          >
                            {category.visible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-destructive hover:text-destructive"
                            disabled={getLinkCount(category.id) > 0}
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

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSuccess={() => {
          setIsDialogOpen(false);
          setEditingCategory(null);
          onRefresh();
        }}
      />
    </>
  );
}
