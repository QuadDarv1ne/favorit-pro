'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function MatchCardSkeleton() {
  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-3 w-20 bg-gray-700/50" />
          <Skeleton className="h-3 w-10 bg-gray-700/50" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 bg-gray-700/50" />
            <Skeleton className="h-6 w-6 bg-gray-700/50" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20 bg-gray-700/50" />
            <Skeleton className="h-6 w-6 bg-gray-700/50" />
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-12 flex-1 bg-gray-700/50 rounded-lg" />
          <Skeleton className="h-12 flex-1 bg-gray-700/50 rounded-lg" />
          <Skeleton className="h-12 flex-1 bg-gray-700/50 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-full bg-gray-700/50 rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function PredictionCardSkeleton() {
  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 bg-gray-700/50 rounded" />
            <Skeleton className="h-3 w-16 bg-gray-700/50" />
          </div>
          <Skeleton className="h-5 w-20 bg-gray-700/50 rounded" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Skeleton className="h-5 w-48 bg-gray-700/50 mb-2" />
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-5 w-24 bg-gray-700/50" />
          <Skeleton className="h-4 w-12 bg-gray-700/50" />
        </div>
        <Skeleton className="h-12 w-full bg-gray-700/50 mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 bg-gray-700/50 rounded-full" />
            <Skeleton className="h-3 w-24 bg-gray-700/50" />
          </div>
          <Skeleton className="h-8 w-20 bg-gray-700/50 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ExpertCardSkeleton() {
  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <Skeleton className="h-12 w-12 bg-gray-700/50 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-28 bg-gray-700/50 mb-1" />
            <Skeleton className="h-5 w-16 bg-gray-700/50 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <Skeleton className="h-6 w-10 bg-gray-700/50 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 bg-gray-700/50 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-6 w-10 bg-gray-700/50 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 bg-gray-700/50 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-6 w-10 bg-gray-700/50 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 bg-gray-700/50 mx-auto" />
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-6 bg-gray-700/50 rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-4 w-4 bg-gray-700/50 rounded" />
                <Skeleton className="h-4 w-28 bg-gray-700/50" />
              </div>
              <Skeleton className="h-8 w-24 bg-gray-700/50" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700/50">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-36 bg-gray-700/50" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[280px] w-full bg-gray-700/50 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function LiveTickerSkeleton() {
  return (
    <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-emerald-900/40 border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-center gap-3">
        <Skeleton className="h-3 w-8 bg-gray-700/50" />
        <Skeleton className="h-4 w-64 bg-gray-700/50" />
      </div>
    </div>
  );
}
