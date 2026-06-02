import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('MR WHITEFLIX render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-netflix-bg text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-netflix text-4xl uppercase text-netflix-red">MR WHITEFLIX</h1>
          <p className="text-xl max-w-md">
            Something went wrong loading this page. Refresh the browser to try again.
          </p>
          <a
            href="/"
            className="mt-2 rounded-xl bg-netflix-red px-6 py-3 text-lg font-bold hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-netflix-red/50"
          >
            Back home
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
