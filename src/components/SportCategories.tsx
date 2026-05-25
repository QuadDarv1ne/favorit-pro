'use client';

import React from 'react';
import { sportCategories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SportCategoriesProps {
  detailed?: boolean;
}

export const SportCategories = React.memo(function SportCategories({ detailed = false }: SportCategoriesProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-xl font-bold text-white mb-6">Виды спорта</h2>
      <div className={`grid gap-4 ${detailed ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'}`}>
        {sportCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="bg-gray-800/50 border-gray-700/50 hover:border-gray-600 transition-all duration-300 cursor-pointer group overflow-hidden">
              <CardContent className={`${detailed ? 'p-5' : 'p-4'}`}>
                {detailed ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {category.icon}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-400">{category.matchCount} событий</p>
                    <div className="mt-3 w-full bg-gray-700/50 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${category.color} transition-all`}
                        style={{ width: `${Math.min(category.matchCount * 2, 100)}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <span className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500">{category.matchCount}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
});
