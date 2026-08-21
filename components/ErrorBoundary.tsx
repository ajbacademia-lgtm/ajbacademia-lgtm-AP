import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="max-w-2xl">
            <div className="mb-8 flex justify-center">
              <div className="relative inline-block p-6 rounded-full bg-red-50">
                <ShieldAlert size={64} className="text-red-500" />
              </div>
            </div>

            <h1 className="text-4xl font-serif font-bold text-brand-navy mb-4">System Disruption</h1>
            <p className="text-brand-navy/60 text-lg mb-12 leading-relaxed max-w-lg mx-auto">
              We've encountered a temporary technical anomaly in the research pipeline. Our systems are working to resolve this synchronization error.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-12 p-4 bg-gray-50 border border-gray-200 rounded text-left overflow-auto max-h-40">
                <p className="text-xs font-mono text-red-600 font-bold mb-2">Error: {this.state.error.message}</p>
                <p className="text-[10px] font-mono text-gray-500 whitespace-pre">{this.state.error.stack}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={this.handleReset}
                className="flex items-center justify-center gap-3 px-8 py-4 border border-brand-navy/10 text-brand-navy text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-brand-navy hover:text-white transition-all group"
              >
                <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" /> 
                Reset Pipeline
              </button>
              
              <Link 
                to="/" 
                onClick={() => this.setState({ hasError: false })}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-brand-action transition-all"
              >
                <Home size={16} /> 
                Return Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
