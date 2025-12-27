'use client';

import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-3">关于</h3>
            <p className="text-sm text-muted-foreground">
              Modern Nav 是一个现代化的导航网站，精选优质网站资源，帮助你更高效地浏览互联网。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/about" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  关于我们
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  管理后台
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">联系</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500" /> by Modern Nav Team
          </p>
          <p className="mt-2">© {currentYear} Modern Nav. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
