'use client';

import React from 'react';
import { newsItems, NewsItem } from '@/lib/data';
import { useNews, ApiNewsArticle } from '@/hooks/use-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsSectionProps {
  detailed?: boolean;
}

function formatApiDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function mapApiNews(n: ApiNewsArticle): NewsItem {
  return {
    id: n.id,
    title: n.title,
    excerpt: n.excerpt,
    category: n.category,
    image: n.imageUrl || '/placeholder.jpg',
    publishedAt: formatApiDate(n.publishedAt),
    readTime: n.readTime,
  };
}

export const NewsSection = React.memo(function NewsSection({ detailed = false }: NewsSectionProps) {
  // React Query hook with fallback to mock data
  const { data } = useNews();
  const newsList = (data?.news?.length ?? 0) > 0
    ? data!.news.map(mapApiNews)
    : newsItems;

  const displayedNews = detailed ? newsList : newsList.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-teal-400" />
          <h2 className="text-xl font-bold text-white">Медиа</h2>
        </div>
        {!detailed && (
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            Все новости <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      <div className={`grid gap-4 ${detailed ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'}`}>
        {displayedNews.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-gray-800/50 border-gray-700/50 hover:border-teal-500/30 transition-all duration-300 cursor-pointer group h-full">
              <CardContent className="p-5 flex flex-col h-full">
                {/* Image placeholder */}
                <div className="w-full h-40 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 mb-4 flex items-center justify-center overflow-hidden">
                  <span className="text-4xl opacity-30">
                    {news.category === 'Футбол' ? '⚽' : news.category === 'Хоккей' ? '🏒' : news.category === 'Киберспорт' ? '🎮' : news.category === 'Теннис' ? '🎾' : '📊'}
                  </span>
                </div>

                <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs w-fit mb-2">
                  {news.category}
                </Badge>

                <h3 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors mb-2 line-clamp-2 leading-snug">
                  {news.title}
                </h3>

                <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">
                  {news.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{news.publishedAt}</span>
                  </div>
                  <span>{news.readTime} мин чтения</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {detailed && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
            Загрузить ещё
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </section>
  );
});
