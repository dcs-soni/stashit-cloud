import { Routes, Route, Navigate, Link } from "react-router-dom";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Button from "./components/ui/Button";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-white mb-4">
        Something went wrong
      </h1>
      <p className="text-dark-400 mb-6">
        {error instanceof Error ? error.message : "An error occurred"}
      </p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-dark-400 mb-6">Page not found</p>
      <Link to="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  </div>
);

const App = () => {
  const { isAuthenticated, isLoading, username, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
