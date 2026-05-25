'use client';

import { NewsItem } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, FileText, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ArticleDetailModalProps {
  article: NewsItem | null;
  open: boolean;
  onClose: () => void;
}

const sportEmoji = (category: string) =>
  category === 'Футбол' ? '⚽' : category === 'Хоккей' ? '🏒' : category === 'Киберспорт' ? '🎮' : category === 'Теннис' ? '🎾' : category === 'Баскетбол' ? '🏀' : '📊';

export function ArticleDetailModal({ article, open, onClose }: ArticleDetailModalProps) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#151b23] border-gray-700/50 text-gray-100 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Category & Meta */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
              {sportEmoji(article.category)} {article.category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {article.publishedAt}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {article.readTime} мин
            </div>
          </div>

          <DialogTitle className="text-xl font-bold text-white leading-tight">
            {article.title}
          </DialogTitle>

          <p className="text-sm text-gray-400 mt-1">
            {article.excerpt}
          </p>
        </DialogHeader>

        {/* Hero image */}
        <div className="w-full h-48 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
          <span className="text-7xl opacity-40 relative z-10">
            {sportEmoji(article.category)}
          </span>
        </div>

        <Separator className="bg-gray-700/50" />

        {/* Article content rendered as markdown */}
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-h2:text-lg prose-h2:mt-4 prose-h2:mb-2
          prose-h3:text-base prose-h3:mt-3 prose-h3:mb-1
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:my-2
          prose-li:text-gray-300
          prose-strong:text-white
          prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:rounded-r
          prose-table:border-collapse prose-td:border prose-td:border-gray-700 prose-td:px-2 prose-td:py-1 prose-th:border prose-th:border-gray-700 prose-th:px-2 prose-th:py-1 prose-th:bg-gray-800
          prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-gray-800/50 prose-pre:border prose-pre:border-gray-700
        ">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        <Separator className="bg-gray-700/50 my-4" />

        {/* Footer */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FileText className="w-3.5 h-3.5" />
          <span>Статья опубликована {article.publishedAt}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
