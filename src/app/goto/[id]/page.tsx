'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { NavLink } from '@/types';

export default function GotoPage() {
  const params = useParams();
  const [countdown, setCountdown] = useState(3);
  const [targetData, setTargetData] = useState<NavLink | null>(null);

  useEffect(() => {
    // Get target data from localStorage
    const data = localStorage.getItem(`goto_${params.id}`);
    if (data) {
      try {
        setTargetData(JSON.parse(data));
      } catch (error) {
        console.error('Failed to parse link data:', error);
      }
    }
  }, [params.id]);

  useEffect(() => {
    if (!targetData?.url) return;

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetData.url;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetData]);

  const handleJumpNow = () => {
    if (targetData?.url) {
      window.location.href = targetData.url;
    }
  };

  if (!targetData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>链接不存在</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              未找到目标链接信息
            </p>
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4"
            >
              <ExternalLink className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">正在跳转...</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Target Website Info */}
            <div className="p-4 rounded-lg bg-accent/50 space-y-2">
              <h2 className="text-xl font-semibold">{targetData.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {targetData.description}
              </p>
              <p className="text-xs text-muted-foreground break-all">
                {targetData.url}
              </p>
            </div>

            {/* Countdown */}
            <div className="text-center space-y-4">
              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-bold text-primary"
              >
                {countdown}
              </motion.div>
              
              <p className="text-muted-foreground">
                {countdown > 0 ? `${countdown} 秒后自动跳转` : '正在跳转...'}
              </p>

              {/* Actions */}
              <div className="flex gap-3 justify-center pt-2">
                <Button
                  onClick={handleJumpNow}
                  size="lg"
                  className="min-w-[140px]"
                >
                  立即跳转
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Link href="/">
                  <Button variant="outline" size="lg">
                    <Home className="mr-2 h-4 w-4" />
                    返回首页
                  </Button>
                </Link>
              </div>
            </div>

            {/* Safety Warning */}
            <div className="text-xs text-center text-muted-foreground border-t pt-4">
              <p>⚠️ 即将离开 Modern Nav，请注意访问安全</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
