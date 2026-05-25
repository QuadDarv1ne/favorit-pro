'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GlobalErrorBoundary]', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#0d1117] text-gray-100 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Что-то пошло не так</h1>
            <p className="text-sm text-gray-400 mb-6">
              Произошла непредвиденная ошибка. Попробуйте обновить страницу.
            </p>
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-gray-800/50 rounded-lg p-3 mb-6 text-xs text-gray-500 font-mono max-h-32 overflow-auto">
                {this.state.error.message}
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Обновить страницу
              </Button>
              <Button
                variant="outline"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="border-gray-700 text-gray-300"
              >
                Попробовать снова
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
