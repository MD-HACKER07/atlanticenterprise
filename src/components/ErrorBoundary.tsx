import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to the console with component name if provided
    console.error(
      `Error in ${this.props.componentName || 'component'}:`, 
      error, 
      errorInfo
    );
    
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="error-boundary p-4 bg-red-50 border border-red-300 rounded-md m-4">
          <h2 className="text-xl font-bold text-red-800 mb-3">
            Error in {this.props.componentName || 'component'}
          </h2>
          <details className="whitespace-pre-wrap">
            <summary className="text-red-600 font-medium cursor-pointer mb-2">
              Click to see error details
            </summary>
            <div className="bg-white p-4 rounded overflow-auto max-h-96">
              <p className="font-bold text-red-700 mb-2">Error:</p>
              <pre className="text-sm text-red-800 mb-4">
                {this.state.error && this.state.error.toString()}
              </pre>
              
              <p className="font-bold text-red-700 mb-2">Component Stack:</p>
              <pre className="text-sm text-red-800">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
          </details>
          <button 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 