import type { Match, Expert, Prediction } from '@/lib/data';
import type { ApiMatch, ApiExpert, ApiPrediction } from '@/hooks/use-api';

function formatApiStartTime(startTime: string): string {
  try {
    const date = new Date(startTime);
    if (isNaN(date.getTime())) return startTime;
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return startTime;
  }
}

export function mapApiMatchToMatch(m: ApiMatch): Match {
  return {
    id: m.id,
    sport: m.sport?.slug || m.sportId || 'football',
    league: m.league,
    homeTeam: m.homeTeam,
    awayTeam: m.awayTeam,
    homeOdds: m.homeOdds,
    drawOdds: m.drawOdds ?? undefined,
    awayOdds: m.awayOdds,
    startTime: formatApiStartTime(m.startTime),
    status: m.status as Match['status'],
    homeScore: m.homeScore ?? undefined,
    awayScore: m.awayScore ?? undefined,
    prediction: m.predictions?.[0]?.prediction,
    confidence: m.predictions?.[0]?.confidence,
    isHot: m.isHot,
  };
}

export function mapApiExpertToExpert(e: ApiExpert): Expert {
  return {
    id: e.id,
    name: e.name,
    avatar: e.avatar,
    specialty: e.specialty?.slug || e.specialtyId || '',
    winRate: e.winRate,
    totalPredictions: e.totalPredictions,
    roi: e.roi,
    streak: e.streak,
    lastResults: e.lastResults.split(',').filter(Boolean).map((r) => (r.trim() === 'W' ? 'W' : 'L')),
    bio: e.bio ?? undefined,
  };
}

export function mapApiPredictionToPrediction(p: ApiPrediction): Prediction {
  return {
    id: p.id,
    expertId: p.expertId,
    expertName: p.expert?.name || '',
    matchId: p.matchId,
    sport: p.match?.sport?.slug || 'football',
    matchTitle: p.match ? `${p.match.homeTeam} — ${p.match.awayTeam}` : '',
    prediction: p.prediction,
    odds: p.odds,
    confidence: p.confidence,
    analysis: p.analysis,
    createdAt: p.createdAt,
    result: p.result as Prediction['result'],
  };
}
