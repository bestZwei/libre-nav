'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Link as LinkIcon, 
  FolderTree, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LinkManager } from '@/components/admin/LinkManager';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { StatsOverview } from '@/components/admin/StatsOverview';
import type { NavLink, Category } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [links, setLinks] = useState<NavLink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      if (!response.ok) {
        router.push('/admin');
      }
    } catch (error) {
      router.push('/admin');
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [linksRes, categoriesRes] = await Promise.all([
        fetch('/api/links'),
        fetch('/api/categories')
      ]);

      const linksData = await linksRes.json();
      const categoriesData = await categoriesRes.json();

      if (linksData.success) setLinks(linksData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
    } catch (error) {
      console.error('Load data error:', error);
      toast.error('加载数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      });
      toast.success('已退出登录');
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('退出登录失败');
    }
  };

  const handleExportData = async () => {
    try {
      const data = { links, categories };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `navigation-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('数据导出成功');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('导出数据失败');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: any) => {
      try {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        const data = JSON.parse(text);

        if (!data.links || !data.categories) {
          toast.error('数据格式不正确');
          return;
        }

        if (!confirm(`确定要导入数据吗？\n将导入 ${data.links.length} 个链接和 ${data.categories.length} 个分类。\n当前数据将被替换！`)) {
          return;
        }

        const response = await fetch('/api/admin/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          toast.success('数据导入成功');
          loadData();
        } else {
          toast.error(result.error || '导入失败');
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('导入数据失败');
      }
    };
    input.click();
  };

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.h1 
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              管理后台
            </motion.h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              导出数据
            </Button>
            <Button variant="outline" size="sm" onClick={handleImportData}>
              <Upload className="mr-2 h-4 w-4" />
              导入数据
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">加载中...</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Overview */}
            <StatsOverview links={links} categories={categories} />

            {/* Management Tabs */}
            <div className="mt-6">
              <Tabs defaultValue="links" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                  <TabsTrigger value="links" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    链接管理
                  </TabsTrigger>
                  <TabsTrigger value="categories" className="flex items-center gap-2">
                    <FolderTree className="h-4 w-4" />
                    分类管理
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="links" className="mt-6">
                  <LinkManager 
                    links={filteredLinks}
                    categories={categories}
                    onRefresh={loadData}
                  />
                </TabsContent>

                <TabsContent value="categories" className="mt-6">
                  <CategoryManager 
                    categories={categories}
                    links={links}
                    onRefresh={loadData}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
