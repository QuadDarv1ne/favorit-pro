'use client';

import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="bg-[#0a0d12] border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-bold text-white text-xs">
                ФП
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                ФаворитПро
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Находи фаворитов, делай про-ставки. Профессиональная аналитика и прогнозы на спортивные события. Информация предназначена для лиц старше 18 лет.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Навигация</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Прогнозы</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Эксперты</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Статистика</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Результаты</a></li>
            </ul>
          </div>

          {/* Sports */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Виды спорта</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">⚽ Футбол</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">🏒 Хоккей</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">🏀 Баскетбол</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">🎮 Киберспорт</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Поддержка</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Обратная связь</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Статус сервиса</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">API</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Информация</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">О проекте</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Правила</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Ответственная игра</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Контакты</a></li>
            </ul>
          </div>
        </div>

        {/* Partners */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 mb-3">Партнёры</h4>
          <div className="flex flex-wrap gap-2">
            {['1xBet', 'Fonbet', 'Лига Ставок', 'Winline'].map((partner) => (
              <span
                key={partner}
                className="px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/30 text-xs text-gray-400 font-medium"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-800 mb-6" />

        {/* Social links + App download */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Social icons */}
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
                aria-label="Telegram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
                aria-label="VK"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.779.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .779.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.716-.576.716z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* App download badges */}
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-[9px] text-gray-400 leading-none">Скачать в</div>
                <div className="text-xs text-white font-medium leading-tight">App Store</div>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.4 12l2.298-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z"/>
              </svg>
              <div className="text-left">
                <div className="text-[9px] text-gray-400 leading-none">Доступно в</div>
                <div className="text-xs text-white font-medium leading-tight">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        <Separator className="bg-gray-800 my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2026 ФаворитПро. Все права защищены. Информация не является публичной офертой.
          </p>
          <p className="text-xs text-gray-600">
            18+ Ответственная игра
          </p>
        </div>
      </div>
    </footer>
  );
}
