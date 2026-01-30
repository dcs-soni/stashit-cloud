import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { authApi } from "../lib/api";

interface SigninProps {
  onLogin: (token: string) => void;
}

const Signin = ({ onLogin }: SigninProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.signin(username, password);
      onLogin(response.data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface-800 via-surface-900 to-surface-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/15 rounded-full blur-[120px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center shadow-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-white">
              StashIt
            </span>
          </div>

          <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
            Welcome back to your
            <br />
            <span className="text-accent-400">organized world</span>
          </h2>

          <p className="text-lg text-surface-300 max-w-md">
            Access your saved links, documents, and videos. Search with natural
            language and find exactly what you need.
          </p>

          {/* Floating cards decoration */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 max-w-sm animate-float">
              <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="text-white font-medium">Semantic Search</p>
                <p className="text-sm text-surface-400">
                  Find anything naturally
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 max-w-sm ml-8 animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="text-white font-medium">Instant Access</p>
                <p className="text-sm text-surface-400">
                  Your content, anywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-surface-800">
              StashIt
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-surface-800 mb-2">
              Sign in
            </h1>
            <p className="text-surface-500">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              minLength={4}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-surface-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-accent-600 hover:text-accent-700 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-12 pt-8 border-t border-surface-200">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-surface-400 hover:text-surface-600 transition-colors text-sm"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
