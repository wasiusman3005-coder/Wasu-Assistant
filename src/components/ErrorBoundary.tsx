import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WASU LOVE Uncaught Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08070d] text-white flex items-center justify-center p-4 font-mono select-none">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-black/90 border-2 border-rose-500/70 shadow-[0_0_40px_rgba(255,42,133,0.3)] backdrop-blur-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-wider text-rose-300 uppercase">
                SYSTEM RECOVERY // WASU CORE
              </h1>
              <p className="text-xs text-slate-300 font-sans">
                App runtime encountered a client issue. Automatic recovery is ready.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-left text-xs text-rose-200 overflow-x-auto max-h-36">
              <span className="font-bold text-rose-400">Error: </span>
              {this.state.error?.message || 'Unknown runtime error'}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,245,212,0.4)]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>RELOAD APPLICATION</span>
              </button>
              <button
                onClick={this.handleReset}
                className="py-3 px-4 rounded-xl bg-black/60 border border-rose-500/50 hover:bg-rose-950/60 text-rose-300 text-xs transition-all"
              >
                CLEAR CACHE & RESET
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
