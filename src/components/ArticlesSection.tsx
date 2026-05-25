'use client';

import React, { useState } from 'react';
import { newsItems, NewsItem } from '@/lib/data';
import { useNews, ApiNewsArticle } from '@/hooks/use-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ChevronRight, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { ArticleDetailModal } from '@/components/ArticleDetailModal';

interface ArticlesSectionProps {
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
    slug: n.slug || n.id,
    excerpt: n.excerpt,
    content: n.content || '',
    category: n.category,
    image: n.imageUrl || '/placeholder.jpg',
    publishedAt: formatApiDate(n.publishedAt),
    readTime: n.readTime,
  };
}

const sportEmoji = (category: string) =>
  category === 'Футбол' ? '⚽' : category === 'Хоккей' ? '🏒' : category === 'Киберспорт' ? '🎮' : category === 'Теннис' ? '🎾' : category === 'Баскетбол' ? '🏀' : '📊';

export function ArticlesSection({ detailed = false }: ArticlesSectionProps) {
  const { data } = useNews();
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const newsList = data?.news?.length
    ? data.news.map(mapApiNews)
    : newsItems;

  const displayedArticles = detailed ? newsList : newsList.slice(0, 6);

  const handleArticleClick = (article: NewsItem) => {
    setSelectedArticle(article);
    setModalOpen(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-400" />
          <h2 className="text-xl font-bold text-white">Статьи</h2>
        </div>
        {!detailed && (
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            Все статьи <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      <div className={`grid gap-4 ${detailed ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {displayedArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
          >
            <Card
              className="bg-gray-800/50 border-gray-700/50 hover:border-teal-500/30 transition-all duration-300 cursor-pointer group h-full overflow-hidden"
              onClick={() => handleArticleClick(article)}
            >
              <CardContent className="p-5 flex flex-col h-full">
                {/* Hero image placeholder */}
                <div className="w-full h-40 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 mb-4 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                  <span className="text-5xl opacity-40 relative z-10">
                    {sportEmoji(article.category)}
                  </span>
                </div>

                <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs w-fit mb-2">
                  {sportEmoji(article.category)} {article.category}
                </Badge>

                <h3 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors mb-2 line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.publishedAt}</span>
                  </div>
                  <span>{article.readTime} мин чтения</span>
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

      {/* Article Detail Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
