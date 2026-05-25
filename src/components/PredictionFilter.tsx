'use client';

import React, { useState } from 'react';
import { topPredictions, Prediction } from '@/lib/data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, SlidersHorizontal, ArrowUpDown, Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfidenceGauge } from '@/components/ConfidenceGauge';

interface PredictionFilterProps {
  onPredictionClick?: (prediction: Prediction) => void;
}

type SortKey = 'confidence' | 'odds' | 'recent';
type FilterSport = 'all' | 'football' | 'hockey' | 'basketball' | 'tennis' | 'cybersport';

const sportLabels: Record<FilterSport, string> = {
  all: 'Все',
  football: '⚽ Футбол',
  hockey: '🏒 Хоккей',
  basketball: '🏀 Баскетбол',
  tennis: '🎾 Теннис',
  cybersport: '🎮 Кибер',
};

const sortLabels: Record<SortKey, string> = {
  confidence: 'Уверенность',
  odds: 'Коэффициент',
  recent: 'Свежие',
};

export function PredictionFilter({ onPredictionClick }: PredictionFilterProps) {
  const [filterSport, setFilterSport] = useState<FilterSport>('all');
  const [sortKey, setSortKey] = useState<SortKey>('confidence');
  const [showFilters, setShowFilters] = useState(false);
  const [minConfidence, setMinConfidence] = useState(0);

  const filteredPredictions = topPredictions
    .filter((p) => filterSport === 'all' || p.sport === filterSport)
    .filter((p) => p.confidence >= minConfidence)
    .sort((a, b) => {
      switch (sortKey) {
        case 'confidence': return b.confidence - a.confidence;
        case 'odds': return b.odds - a.odds;
        case 'recent': return 0; // already sorted by recent
        default: return 0;
      }
    });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Прогнозы</h2>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
            {filteredPredictions.length}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={`border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 gap-1.5 ${
            showFilters ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ''
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Фильтры
          <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800/40 rounded-xl border border-gray-700/30 p-4 mb-4 space-y-3">
              {/* Sport filter */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Вид спорта</label>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(sportLabels) as FilterSport[]).map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setFilterSport(sport)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filterSport === sport
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-700/50 text-gray-400 border border-gray-700/30 hover:text-gray-200 hover:bg-gray-700'
                      }`}
                    >
                      {sportLabels[sport]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Сортировка</label>
                <div className="flex gap-1.5">
                  {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSortKey(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        sortKey === key
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-700/50 text-gray-400 border border-gray-700/30 hover:text-gray-200 hover:bg-gray-700'
                      }`}
                    >
                      <ArrowUpDown className="w-3 h-3" />
                      {sortLabels[key]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confidence slider */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block">
                  Минимальная уверенность: <span className="text-emerald-400 font-medium">{minConfidence}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {filteredPredictions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-7 h-7 text-gray-600" />
          </div>
          <p className="text-sm text-gray-500">Прогнозы не найдены</p>
          <p className="text-xs text-gray-600 mt-1">Попробуйте изменить фильтры</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setFilterSport('all'); setMinConfidence(0); }}
            className="mt-3 text-emerald-400 hover:text-emerald-300"
          >
            Сбросить фильтры
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPredictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className="bg-gray-800/40 backdrop-blur-md border-gray-700/30 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer group h-full"
                onClick={() => onPredictionClick?.(prediction)}
              >
                <CardHeader className="pb-2 px-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                        {prediction.sport === 'football' ? '⚽' : prediction.sport === 'hockey' ? '🏒' : prediction.sport === 'basketball' ? '🏀' : prediction.sport === 'tennis' ? '🎾' : '🎮'}{' '}
                        {prediction.sport === 'football' ? 'Футбол' : prediction.sport === 'hockey' ? 'Хоккей' : prediction.sport === 'basketball' ? 'Баскетбол' : prediction.sport === 'tennis' ? 'Теннис' : 'Киберспорт'}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {prediction.createdAt}
                      </div>
                    </div>
                    <ConfidenceGauge value={prediction.confidence} size={36} strokeWidth={3} />
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                    {prediction.matchTitle}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-400 font-bold">{prediction.prediction}</span>
                    <span className="text-gray-400 text-sm">@ {prediction.odds.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{prediction.analysis}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-[8px] font-bold text-white">
                      {prediction.expertName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-xs text-gray-400">{prediction.expertName}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
