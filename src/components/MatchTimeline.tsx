'use client';

import { motion } from 'framer-motion';

interface TimelineEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  team: 'home' | 'away';
  player: string;
  description: string;
}

const matchEvents: Record<string, TimelineEvent[]> = {
  '1': [
    { minute: 12, type: 'goal', team: 'home', player: 'Соболев', description: 'Гол! Удар головой после подачи углового' },
    { minute: 23, type: 'yellow_card', team: 'away', player: 'Обляков', description: 'Грубый подкат на чужой половине' },
    { minute: 45, type: 'goal', team: 'away', player: 'Чалов', description: 'Гол! Точный удар из-за пределов штрафной' },
    { minute: 67, type: 'substitution', team: 'home', player: 'Зелимхан ↔ Барриос', description: 'Замена в атаке' },
    { minute: 78, type: 'yellow_card', team: 'home', player: 'Джикия', description: 'Фол на фланге' },
  ],
  '2': [
    { minute: 8, type: 'goal', team: 'home', player: 'Сака', description: 'Гол! Индивидуальный проход и точный удар' },
    { minute: 34, type: 'yellow_card', team: 'away', player: 'Кукурелья', description: 'Задержка за футболку' },
    { minute: 56, type: 'substitution', team: 'away', player: 'Мудрик ↔ Джексон', description: 'Замена в атаке' },
    { minute: 72, type: 'goal', team: 'away', player: 'Палмер', description: 'Гол! Шикарный удар со штрафного' },
  ],
  '3': [
    { minute: 15, type: 'goal', team: 'home', player: 'Морозов', description: 'Гол! Бросок в девятку' },
    { minute: 28, type: 'yellow_card', team: 'away', player: 'Кагарлицкий', description: 'Грубая игра клюшкой' },
    { minute: 42, type: 'goal', team: 'home', player: 'Шипачёв', description: 'Гол! Подставление клюшки при броске' },
    { minute: 55, type: 'substitution', team: 'away', player: 'Сорокин ↔ Широков', description: 'Замена вратаря' },
    { minute: 63, type: 'red_card', team: 'away', player: 'Кагарлицкий', description: 'Вторая жёлтая — удар клюшкой' },
  ],
  '4': [
    { minute: 18, type: 'goal', team: 'home', player: 'Швед', description: 'Гол! Трёхочковый бросок' },
    { minute: 25, type: 'yellow_card', team: 'away', player: 'Казансон', description: 'Технический фол' },
    { minute: 38, type: 'substitution', team: 'home', player: 'Клайбер ↔ Фридзон', description: 'Замена защитника' },
    { minute: 52, type: 'goal', team: 'away', player: 'Джеймс', description: 'Гол! Пробитие кольца' },
  ],
  '5': [
    { minute: 6, type: 'goal', team: 'home', player: 'Медведев', description: 'Гол! Эйс — подача навылет' },
    { minute: 22, type: 'yellow_card', team: 'away', player: 'Циципас', description: 'Затягивание времени' },
    { minute: 45, type: 'substitution', team: 'away', player: 'Тай-брейк', description: 'Переход к решающему гейму' },
    { minute: 67, type: 'goal', team: 'away', player: 'Циципас', description: 'Гол! Удар с задней линии' },
  ],
  '6': [
    { minute: 10, type: 'goal', team: 'home', player: 'Yatoro', description: 'Гол! Отличный ганк на нижней линии' },
    { minute: 24, type: 'yellow_card', team: 'away', player: '33', description: 'Нарушение правил — пауза' },
    { minute: 35, type: 'substitution', team: 'home', player: 'Mira ↔ Torontotokyo', description: 'Смена поддержки' },
    { minute: 48, type: 'goal', team: 'away', player: 'Nine', description: 'Гол! Удачный пуш на базе' },
    { minute: 62, type: 'red_card', team: 'home', player: 'Collapse', description: 'Дисквалификация за неспортивное поведение' },
  ],
};

const typeConfig = {
  goal: { dotColor: 'bg-emerald-400', ringColor: 'ring-emerald-400/30', icon: '⚽', label: 'Гол' },
  yellow_card: { dotColor: 'bg-yellow-400', ringColor: 'ring-yellow-400/30', icon: '🟨', label: 'Жёлтая' },
  red_card: { dotColor: 'bg-red-400', ringColor: 'ring-red-400/30', icon: '🟥', label: 'Красная' },
  substitution: { dotColor: 'bg-blue-400', ringColor: 'ring-blue-400/30', icon: '🔄', label: 'Замена' },
};

interface MatchTimelineProps {
  matchId: string;
}

export function MatchTimeline({ matchId }: MatchTimelineProps) {
  const events = matchEvents[matchId] || [];

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Событий пока нет
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-700/50" />

      <div className="space-y-4">
        {events.map((event, index) => {
          const config = typeConfig[event.type];

          return (
            <motion.div
              key={`${event.minute}-${event.player}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative flex items-start gap-4"
            >
              {/* Minute */}
              <div className="w-9 shrink-0 text-right pt-0.5">
                <span className="text-xs font-bold text-gray-400 tabular-nums">{event.minute}&apos;</span>
              </div>

              {/* Dot */}
              <div className="relative z-10 shrink-0 mt-0.5">
                <div className={`w-[10px] h-[10px] rounded-full ${config.dotColor} ring-4 ${config.ringColor}`} />
              </div>

              {/* Event details */}
              <div className="glass-card rounded-lg p-3 flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{config.icon}</span>
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                    event.team === 'home' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {event.team === 'home' ? 'Хозяева' : 'Гости'}
                  </span>
                  <span className="text-xs text-gray-500">{config.label}</span>
                </div>
                <p className="text-sm font-medium text-white">{event.player}</p>
                <p className="text-xs text-gray-400 mt-0.5">{event.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
