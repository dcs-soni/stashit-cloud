import { Routes, Route, Navigate, Link } from "react-router-dom";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Button from "./components/ui/Button";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50 px-6">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-display font-bold text-surface-800 mb-3">
        Something went wrong
      </h1>
      <p className="text-surface-500 mb-6">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred"}
      </p>
      <Button onClick={resetErrorBoundary}>
        Try again
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50 px-6">
    <div className="text-center max-w-md">
      <h1 className="text-8xl font-display font-bold text-surface-200 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-display font-bold text-surface-800 mb-3">
        Page not found
      </h2>
      <p className="text-surface-500 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button>
          Go home
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  </div>
);

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow animate-pulse-soft">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <span className="text-2xl font-display font-bold text-surface-800">
        StashIt
      </span>
    </div>
    <div className="flex items-center gap-2">
      <div
        className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  </div>
);

const App = () => {
  const { isAuthenticated, isLoading, username, login, logout } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signin"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Signin onLogin={login} />
            )
          }
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard username={username} onLogout={logout} />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
