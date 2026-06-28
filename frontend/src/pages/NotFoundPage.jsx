import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ArrowLeftIcon } from "../components/icons";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-extrabold text-brand-500">404</p>
      <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Button as={Link} to="/" className="mt-6">
        <ArrowLeftIcon /> Back to releases
      </Button>
    </div>
  );
}
