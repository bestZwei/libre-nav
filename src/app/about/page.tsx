import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">关于 Modern Nav</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">项目简介</h2>
              <p>
                Modern Nav 是一个现代化的导航网站，使用 Next.js 14、TypeScript 和 TailwindCSS 构建。
                我们致力于为用户提供精选的优质网站资源，帮助您更高效地浏览互联网。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">主要特性</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>🎨 现代化的 UI 设计，支持暗色模式</li>
                <li>🔍 强大的搜索功能，支持拼音和模糊匹配</li>
                <li>⭐ 个性化收藏功能</li>
                <li>📱 完美适配移动端</li>
                <li>🚀 快速加载，优秀的性能表现</li>
                <li>🛠️ 完整的后台管理系统</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">技术栈</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Next.js 14',
                  'React 18',
                  'TypeScript',
                  'TailwindCSS',
                  'shadcn/ui',
                  'Framer Motion',
                  'Zustand',
                  'Fuse.js',
                  'pinyin-pro',
                ].map(tech => (
                  <div
                    key={tech}
                    className="px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium text-center"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">开源协议</h2>
              <p>
                本项目采用 MIT 协议开源，欢迎 Star 和 Fork。
              </p>
            </section>

            <section className="pt-6 border-t">
              <p className="text-center">
                如有问题或建议，欢迎通过 GitHub Issues 反馈
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
