import { Component } from "react";
import { Button } from "./ui/Button";
import { AlertIcon } from "./icons";

/**
 * App-level error boundary. Catches render-time errors anywhere below it and
 * shows a recovery screen instead of a blank page.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // In a real app this would go to an error reporting service.
    console.error("Uncaught error:", error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
          <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-500 dark:bg-rose-500/15 dark:text-rose-300">
              <AlertIcon className="h-7 w-7" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Something broke
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              An unexpected error occurred. Reloading usually fixes it.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="secondary" onClick={this.handleReset}>
                Try again
              </Button>
              <Button onClick={() => window.location.reload()}>
                Reload page
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
