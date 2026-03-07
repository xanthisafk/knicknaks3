import { Component, type ReactNode, type ErrorInfo } from "react";
import { Panel } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  toolName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[Knicknaks] Error in ${this.props.toolName ?? "component"}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <Panel className="text-center py-12">
          <div className="text-4xl mb-4 font-emoji">😵</div>
          <h3 className="text-lg font-semibold font-heading text(--text-primary) mb-2">
            Oops! Something broke.
          </h3>
          <p className="text-sm text(--text-secondary) mb-4 max-w-md mx-auto">
            {this.props.toolName
              ? `The ${this.props.toolName} tool ran into an unexpected error.`
              : "An unexpected error occurred."}
          </p>
          {this.state.error && (
            <pre className="text-xs text-(--text-tertiary) bg-(--surface-secondary) rounded-md p-3 mb-4 max-w-md mx-auto overflow-auto text-left font-mono">
              {this.state.error.message}
            </pre>
          )}
          <Button
            variant="secondary"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </Button>
        </Panel>
      );
    }

    return this.props.children;
  }
}
