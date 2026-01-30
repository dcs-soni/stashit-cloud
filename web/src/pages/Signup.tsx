import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Loader2, ArrowRight, Check } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { authApi } from "../lib/api";

const benefits = [
  "Unlimited content storage",
  "AI-powered semantic search",
  "Secure & private by default",
  "Share with one click",
];

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.signup(username, password);
      navigate("/signin");
    } catch {
      setError("Username already exists or invalid input.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* Left side - Form */}
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
              Create your account
            </h1>
            <p className="text-surface-500">
              Start organizing your digital life today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              minLength={4}
              maxLength={25}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
              maxLength={25}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
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
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-surface-500">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-accent-600 hover:text-accent-700 font-medium transition-colors"
              >
                Sign in
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

      {/* Right side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-800/30 rounded-full blur-[100px]" />
        </div>

        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-white">
              StashIt
            </span>
          </div>

          <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
            Start your journey to
            <br />
            digital organization
          </h2>

          <p className="text-lg text-white/80 max-w-md mb-10">
            Join thousands of professionals who trust StashIt to keep their
            content organized and instantly searchable.
          </p>

          {/* Benefits list */}
          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 text-white/90"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/20 border-2 border-accent-500 flex items-center justify-center"
                  style={{ zIndex: 4 - i }}
                >
                  <span className="text-white text-sm font-medium">
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-white/80">
              <span className="font-semibold text-white">1,000+</span> users
              organizing with StashIt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
