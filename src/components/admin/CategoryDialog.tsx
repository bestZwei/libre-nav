'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import * as Icons from 'lucide-react';
import type { Category } from '@/types';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess: () => void;
}

// 常用图标列表
const commonIcons = [
  'Folder',
  'FolderTree',
  'Globe',
  'Star',
  'Bookmark',
  'Tag',
  'Archive',
  'Box',
  'Briefcase',
  'Code',
  'Database',
  'FileText',
  'Layers',
  'Package',
  'Server',
  'Shield',
  'Tool',
  'Zap',
  'Heart',
  'Home',
  'Image',
  'Link',
  'Music',
  'Video',
  'Camera',
  'Film',
  'Book',
  'Palette',
  'Cpu',
  'Cloud',
];

export function CategoryDialog({ open, onOpenChange, category, onSuccess }: CategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'Folder',
    description: '',
    visible: true,
    order: 0,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon,
        description: category.description || '',
        visible: category.visible,
        order: category.order,
      });
    } else {
      setFormData({
        name: '',
        icon: 'Folder',
        description: '',
        visible: true,
        order: 0,
      });
    }
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.icon) {
      toast.error('请填写必填字段');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        ...(category && { id: category.id }),
      };

      const response = await fetch('/api/categories', {
        method: category ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(category ? '分类更新成功' : '分类添加成功');
        onSuccess();
      } else {
        toast.error(data.error || '操作失败');
      }
    } catch (error) {
      console.error('Submit category error:', error);
      toast.error('操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? '编辑分类' : '添加分类'}</DialogTitle>
          <DialogDescription>
            {category ? '修改分类信息' : '添加新的导航分类'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="输入分类名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">图标 *</Label>
            <Select
              value={formData.icon}
              onValueChange={(value) => setFormData({ ...formData, icon: value })}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {renderIcon(formData.icon)}
                    <span>{formData.icon}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {commonIcons.map((iconName) => (
                  <SelectItem key={iconName} value={iconName}>
                    <div className="flex items-center gap-2">
                      {renderIcon(iconName)}
                      <span>{iconName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="简短描述（选填）"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">排序</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">数字越小越靠前</p>
          </div>

          <div className="flex items-center space-x-2 border-t pt-4">
            <Switch
              id="visible"
              checked={formData.visible}
              onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
            />
            <Label htmlFor="visible">显示</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '处理中...' : category ? '保存' : '添加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
