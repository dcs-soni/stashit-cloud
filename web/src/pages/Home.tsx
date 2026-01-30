import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Link as LinkIcon,
  FileText,
  Video,
  Search,
  ArrowRight,
  Sparkles,
  Share2,
  Lock,
  Zap,
  Globe,
  Check,
} from "lucide-react";

const Navigation = () => (
  <nav className="fixed top-0 left-0 right-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="card-glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-surface-800">
            StashIt
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-surface-500 hover:text-surface-700 transition-colors text-sm font-medium"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-surface-500 hover:text-surface-700 transition-colors text-sm font-medium"
          >
            How it works
          </a>
          <a
            href="#content"
            className="text-surface-500 hover:text-surface-700 transition-colors text-sm font-medium"
          >
            Content Types
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/signin"
            className="text-surface-600 hover:text-surface-800 transition-colors text-sm font-medium px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="bg-surface-800 text-surface-50 hover:bg-surface-700 transition-all text-sm font-medium px-5 py-2.5 rounded-xl shadow-soft hover:shadow-soft-lg"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const GradientOrb = ({
  className,
  size = "lg",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = { sm: "w-32 h-32", md: "w-64 h-64", lg: "w-96 h-96" };
  return (
    <div
      className={`absolute rounded-full blur-[80px] opacity-60 animate-pulse-soft ${sizes[size]} ${className}`}
      style={{
        background:
          "radial-gradient(circle, rgba(92,126,98,0.4) 0%, rgba(124,154,130,0.2) 50%, transparent 70%)",
      }}
    />
  );
};

const StashPreviewCard = ({
  title,
  type,
  domain,
  isActive = false,
}: {
  title: string;
  type: "link" | "document" | "video";
  domain: string;
  delay?: number;
  isActive?: boolean;
}) => {
  const icons = { link: LinkIcon, document: FileText, video: Video };
  const colors = {
    link: "bg-blue-500",
    document: "bg-amber-500",
    video: "bg-rose-500",
  };
  const Icon = icons[type];
  return (
    <div
      className={`group relative bg-white/90 backdrop-blur-sm border rounded-2xl p-4 transition-all duration-500 cursor-pointer ${isActive ? "border-accent-400 shadow-glow scale-105 z-10" : "border-surface-200 hover:border-accent-300 hover:shadow-soft"}`}
    >
      {isActive && (
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-400/20 to-accent-500/20 rounded-2xl blur-lg -z-10" />
      )}
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 ${colors[type]} rounded-xl flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-surface-800 truncate text-sm">
            {title}
          </p>
          <p className="text-xs text-surface-400 mt-0.5">{domain}</p>
        </div>
      </div>
      {isActive && (
        <div className="absolute -right-2 -top-2 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center shadow-glow animate-scale-in">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};

const TypewriterText = ({ words }: { words: string[] }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < word.length)
            setCurrentText(word.slice(0, currentText.length + 1));
          else setTimeout(() => setIsDeleting(true), 2000);
        } else {
          if (currentText.length > 0) setCurrentText(currentText.slice(0, -1));
          else {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);
  return (
    <span className="text-gradient">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const HeroSection = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const stashItems = [
    {
      title: "The Art of Productivity",
      type: "link" as const,
      domain: "medium.com",
    },
    { title: "React 19 Deep Dive", type: "link" as const, domain: "react.dev" },
    { title: "Q4 Strategy Doc", type: "document" as const, domain: "12 pages" },
    {
      title: "Design System Guide",
      type: "video" as const,
      domain: "youtube.com",
    },
    {
      title: "API Architecture Notes",
      type: "document" as const,
      domain: "notion.so",
    },
    {
      title: "Startup Funding Tips",
      type: "video" as const,
      domain: "loom.com",
    },
  ];
  useEffect(() => {
    const interval = setInterval(
      () => setActiveCardIndex((prev) => (prev + 1) % stashItems.length),
      2500,
    );
    return () => clearInterval(interval);
  }, [stashItems.length]);
  useEffect(() => {
    if (!isSearchFocused) {
      const queries = ["productivity tips", "react tutorial", "design system"];
      let queryIndex = 0,
        charIndex = 0,
        isTyping = true;
      const typeInterval = setInterval(() => {
        if (isTyping) {
          if (charIndex < queries[queryIndex].length) {
            setSearchQuery(queries[queryIndex].slice(0, charIndex + 1));
            charIndex++;
          } else {
            setTimeout(() => {
              isTyping = false;
            }, 2000);
          }
        } else {
          if (charIndex > 0) {
            charIndex--;
            setSearchQuery(queries[queryIndex].slice(0, charIndex));
          } else {
            isTyping = true;
            queryIndex = (queryIndex + 1) % queries.length;
          }
        }
      }, 120);
      return () => clearInterval(typeInterval);
    }
  }, [isSearchFocused]);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-50 via-surface-100/50 to-surface-50" />
      <GradientOrb className="top-20 -left-48 animate-float" size="lg" />
      <GradientOrb
        className="bottom-20 -right-32 animate-float-slow"
        size="md"
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #1C1C18 1px, transparent 1px), linear-gradient(to bottom, #1C1C18 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6 animate-fade-up">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-accent-500 rounded-full" />
                <div className="w-2 h-2 bg-accent-400 rounded-full" />
                <div className="w-2 h-2 bg-accent-300 rounded-full" />
              </div>
              <span className="text-sm font-medium text-surface-500 uppercase tracking-widest">
                AI-Powered Knowledge Base
              </span>
            </div>
            <div
              className="mb-8 animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-surface-800 leading-[1.05]">
                <span className="block">Stop losing</span>
                <span className="block mt-2">
                  <TypewriterText
                    words={[
                      "your links",
                      "that article",
                      "good ideas",
                      "inspiration",
                    ]}
                  />
                </span>
              </h1>
            </div>
            <p
              className="text-xl text-surface-500 leading-relaxed mb-10 max-w-lg animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              Stash everything. Find anything.{" "}
              <span className="text-surface-700 font-medium">
                Search your content library using natural language
              </span>{" "}
              — no more hunting through bookmarks.
            </p>
            <div
              className="mb-8 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <div
                className={`relative rounded-2xl transition-all duration-300 ${isSearchFocused ? "shadow-glow-lg" : "shadow-soft-lg"}`}
              >
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r from-accent-400 to-accent-600 rounded-2xl transition-opacity duration-300 ${isSearchFocused ? "opacity-100" : "opacity-0"}`}
                />
                <div className="relative bg-white rounded-2xl p-1.5">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Search
                      className={`w-5 h-5 transition-colors ${isSearchFocused ? "text-accent-500" : "text-surface-400"}`}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      placeholder="Try searching..."
                      className="flex-1 bg-transparent text-surface-700 placeholder:text-surface-400 focus:outline-none text-lg"
                    />
                    <button className="bg-surface-800 hover:bg-surface-700 text-white px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-medium shadow-soft hover:shadow-soft-lg">
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex flex-wrap items-center gap-4 animate-fade-up"
              style={{ animationDelay: "400ms" }}
            >
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-7 py-4 rounded-xl font-medium text-lg transition-all overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative">Start free</span>
                <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 text-surface-600 hover:text-surface-800 px-4 py-4 font-medium transition-colors"
              >
                Sign in
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div
              className="mt-12 flex items-center gap-4 animate-fade-up"
              style={{ animationDelay: "500ms" }}
            >
              <div className="flex -space-x-3">
                {["A", "B", "C", "D"].map((letter, i) => (
                  <div
                    key={letter}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-surface-200 to-surface-300 border-2 border-white flex items-center justify-center shadow-soft"
                    style={{ zIndex: 4 - i }}
                  >
                    <span className="text-sm font-semibold text-surface-600">
                      {letter}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-sm text-surface-500">
                <span className="font-semibold text-surface-700">2,000+</span>{" "}
                professionals organizing smarter
              </div>
            </div>
          </div>
          <div
            className="order-1 lg:order-2 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative">
              <div className="relative bg-white/60 backdrop-blur-xl border border-surface-200 rounded-3xl p-6 shadow-soft-lg">
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-surface-100 rounded-lg px-3 py-1.5 text-xs text-surface-400 font-mono">
                      stashit/dashboard
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-surface-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display font-bold text-surface-800">
                      My Stash
                    </span>
                  </div>
                  <div className="text-xs text-surface-400 bg-surface-100 px-2 py-1 rounded-lg">
                    {stashItems.length} items
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {stashItems.map((item, index) => (
                    <StashPreviewCard
                      key={item.title}
                      {...item}
                      isActive={index === activeCardIndex}
                    />
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-surface-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                      <span className="text-xs text-surface-500">
                        AI found{" "}
                        <span className="font-semibold text-accent-600">
                          semantic match
                        </span>
                      </span>
                    </div>
                    <div className="text-xs font-mono text-surface-400 bg-surface-100 px-2 py-1 rounded">
                      0.94 relevance
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-100 rounded-2xl -z-10 rotate-12" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-surface-200/50 rounded-3xl -z-10 -rotate-6" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-surface-400 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-5 h-8 border border-surface-300 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-surface-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

const featuresData = [
  {
    icon: Search,
    title: "Semantic Search",
    description: "Find by meaning, not keywords",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Sub-100ms search results",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Share2,
    title: "Smart Sharing",
    description: "One-click share links",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description: "End-to-end encrypted",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Globe,
    title: "Access Anywhere",
    description: "Sync across all devices",
    color: "from-emerald-500 to-teal-500",
  },
];

const FeaturesBentoGrid = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setActiveFeature((prev) => (prev + 1) % featuresData.length),
      3000,
    );
    return () => clearInterval(interval);
  }, []);

  const activeData = featuresData[activeFeature];
  const ActiveIcon = activeData.icon;

  return (
    <section
      id="features"
      className="py-32 bg-surface-50 overflow-hidden"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`text-center mb-20 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
        >
          <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Capabilities
          </p>
          <h2 className="text-4xl lg:text-6xl font-display font-bold text-surface-800">
            Built for <span className="text-gradient">power users</span>
          </h2>
        </div>

        <div
          className={`relative ${isVisible ? "animate-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "200ms" }}
        >
          {/* Central feature display */}
          <div className="relative max-w-4xl mx-auto">
            {/* Orbital ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[500px] h-[500px] border border-surface-200 rounded-full opacity-50" />
              <div className="absolute w-[380px] h-[380px] border border-surface-200 rounded-full opacity-30" />
            </div>

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center py-16">
              <div
                className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${activeData.color} flex items-center justify-center shadow-glow-lg mb-8 transition-all duration-500`}
              >
                <ActiveIcon className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-3xl font-display font-bold text-surface-800 mb-3 transition-all duration-300">
                {activeData.title}
              </h3>
              <p className="text-xl text-surface-500 transition-all duration-300">
                {activeData.description}
              </p>
            </div>

            {/* Orbital feature buttons */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {featuresData.map((feature, index) => {
                const angle = (index * 360) / featuresData.length - 90;
                const radius = 220;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                const Icon = feature.icon;
                const isActive = index === activeFeature;

                return (
                  <button
                    key={feature.title}
                    onClick={() => setActiveFeature(index)}
                    className={`absolute pointer-events-auto transition-all duration-500 ${isActive ? "scale-125 z-20" : "scale-100 hover:scale-110"}`}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive ? `bg-gradient-to-br ${feature.color} shadow-glow` : "bg-white shadow-soft border border-surface-200 hover:border-surface-300"}`}
                    >
                      <Icon
                        className={`w-7 h-7 transition-colors ${isActive ? "text-white" : "text-surface-500"}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex justify-center gap-2 mt-12">
            {featuresData.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === activeFeature ? "w-8 bg-accent-500" : "w-2 bg-surface-300 hover:bg-surface-400"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const steps = [
  {
    number: "01",
    title: "Drop it in",
    description:
      "Paste a link, drag a file, or capture from anywhere. We handle the rest.",
    icon: LinkIcon,
    visual: "📎",
  },
  {
    number: "02",
    title: "AI understands",
    description:
      "ChromaDB instantly creates semantic embeddings. Your content becomes searchable by meaning.",
    icon: Sparkles,
    visual: "🧠",
  },
  {
    number: "03",
    title: "Find anything",
    description:
      "Search naturally. Ask questions. Get instant, relevant results from your entire library.",
    icon: Search,
    visual: "🔍",
  },
];

const HowItWorksSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      className="py-32 bg-surface-100 relative overflow-hidden"
      ref={ref}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent-50/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Steps */}
          <div>
            <div
              className={`mb-12 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
            >
              <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-4">
                How it works
              </p>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-surface-800">
                Three steps to
                <br />
                <span className="text-gradient">total recall</span>
              </h2>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-surface-300" />
              <div
                className="absolute left-8 top-0 w-px bg-accent-500 transition-all duration-500"
                style={{
                  height: `${((activeStep + 1) / steps.length) * 100}%`,
                }}
              />

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeStep;
                const isPast = index < activeStep;

                return (
                  <div
                    key={step.number}
                    className={`relative pl-20 pb-12 cursor-pointer transition-all duration-300 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={() => setActiveStep(index)}
                    onMouseEnter={() => setActiveStep(index)}
                  >
                    {/* Node */}
                    <div
                      className={`absolute left-4 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isActive ? "border-accent-500 bg-accent-500 scale-125" : isPast ? "border-accent-500 bg-accent-100" : "border-surface-300 bg-white"}`}
                    >
                      {isActive ? (
                        <Icon className="w-4 h-4 text-white" />
                      ) : isPast ? (
                        <Check className="w-4 h-4 text-accent-600" />
                      ) : (
                        <span className="text-xs font-bold text-surface-400">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`transition-all duration-300 ${isActive ? "opacity-100" : "opacity-60 hover:opacity-80"}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-accent-500 bg-accent-50 px-2 py-1 rounded">
                          {step.number}
                        </span>
                        <h3 className="text-xl font-display font-bold text-surface-800">
                          {step.title}
                        </h3>
                      </div>
                      <p
                        className={`text-surface-500 transition-all duration-300 ${isActive ? "max-h-20" : "max-h-0 overflow-hidden"}`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Visual */}
          <div
            className={`relative ${isVisible ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "300ms" }}
          >
            <div className="relative bg-white rounded-3xl p-8 shadow-soft-lg border border-surface-200">
              {/* Mock browser */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Step visualization */}
              <div className="text-center py-12">
                <div className="text-8xl mb-6 transition-all duration-500">
                  {steps[activeStep].visual}
                </div>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-white`}
                >
                  {(() => {
                    const StepIcon = steps[activeStep].icon;
                    return <StepIcon className="w-4 h-4" />;
                  })()}
                  <span className="font-medium">{steps[activeStep].title}</span>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="flex justify-center gap-3 mt-8">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${index === activeStep ? "w-12 bg-accent-500" : "w-4 bg-surface-200"}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl px-3 py-2 shadow-soft border border-surface-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-surface-600">
                AI Processing
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const contentTypesData = [
  {
    id: "links",
    label: "Links",
    icon: LinkIcon,
    color: "bg-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    count: "12,847",
    example: "medium.com • dribbble.com • react.dev",
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    color: "bg-amber-500",
    gradient: "from-amber-500 to-orange-500",
    count: "3,291",
    example: "PDFs • Notes • Spreadsheets",
  },
  {
    id: "videos",
    label: "Videos",
    icon: Video,
    color: "bg-rose-500",
    gradient: "from-rose-500 to-pink-500",
    count: "1,052",
    example: "YouTube • Loom • Vimeo",
  },
];

const ContentTypesSection = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="content"
      className="py-32 bg-surface-50 overflow-hidden"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`text-center mb-20 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
        >
          <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Content Library
          </p>
          <h2 className="text-4xl lg:text-6xl font-display font-bold text-surface-800 mb-6">
            One home for <span className="text-gradient">everything</span>
          </h2>
          <p className="text-xl text-surface-500 max-w-2xl mx-auto">
            Links, documents, videos — unified under one intelligent search.
          </p>
        </div>

        {/* Stacked cards */}
        <div
          className={`relative flex justify-center items-center min-h-[400px] ${isVisible ? "animate-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "200ms" }}
        >
          {contentTypesData.map((type, index) => {
            const Icon = type.icon;
            const isHovered = hoveredCard === type.id;
            const offset = (index - 1) * 80;
            const zIndex = isHovered ? 30 : 20 - index;
            const rotation = isHovered ? 0 : (index - 1) * 3;
            const scale = isHovered ? 1.05 : 1 - index * 0.02;

            return (
              <div
                key={type.id}
                className="absolute transition-all duration-500 ease-out cursor-pointer"
                style={{
                  transform: `translateX(${isHovered ? 0 : offset}px) rotate(${rotation}deg) scale(${scale})`,
                  zIndex,
                }}
                onMouseEnter={() => setHoveredCard(type.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`w-80 bg-white rounded-3xl p-8 shadow-soft-lg border-2 transition-all duration-300 ${isHovered ? "border-accent-400 shadow-glow" : "border-surface-200"}`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-display font-bold text-surface-800">
                        {type.count}
                      </p>
                      <p className="text-xs text-surface-400 uppercase tracking-wide">
                        items saved
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-display font-bold text-surface-800 mb-2">
                    {type.label}
                  </h3>
                  <p className="text-sm text-surface-400 mb-6">
                    {type.example}
                  </p>

                  {/* Fake list */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg ${type.color} opacity-20`}
                        />
                        <div className="flex-1">
                          <div className="h-3 bg-surface-200 rounded w-3/4 mb-1" />
                          <div className="h-2 bg-surface-100 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instruction */}
        <p
          className={`text-center text-sm text-surface-400 mt-8 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "400ms" }}
        >
          Hover over cards to explore
        </p>
      </div>
    </section>
  );
};

const TechnologySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const badges = [
    "SOC 2 Type II",
    "GDPR Compliant",
    "256-bit AES",
    "99.99% Uptime",
    "ISO 27001",
    "CCPA Ready",
  ];

  return (
    <section className="py-20 bg-surface-100 overflow-hidden" ref={ref}>
      <div
        className={`max-w-7xl mx-auto px-6 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
      >
        {/* ChromaDB partnership */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-surface-400 uppercase tracking-widest">
                Powered by
              </p>
              <p className="text-2xl font-display font-bold text-surface-800">
                ChromaDB Cloud
              </p>
            </div>
          </div>
          <div className="hidden lg:block w-px h-12 bg-surface-300" />
          <p className="text-surface-500 text-center lg:text-left max-w-md">
            The industry-leading AI-native embedding database. Your content is
            understood semantically, not just indexed.
          </p>
        </div>

        {/* Animated badge ticker */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-surface-100 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surface-100 to-transparent z-10" />

          <div className="flex gap-4 animate-marquee">
            {[...badges, ...badges].map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-soft border border-surface-200 whitespace-nowrap"
              >
                <Check className="w-4 h-4 text-accent-500 flex-shrink-0" />
                <span className="font-medium text-surface-700">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="py-24 bg-surface-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-surface-800 via-surface-900 to-surface-800 p-12 lg:p-20 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
        >
          <div className="absolute inset-0 dot-grid opacity-10" />
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Ready to organize your digital life?
            </h2>
            <p className="text-xl text-surface-300 mb-10">
              Join thousands of professionals who've already transformed how
              they save and find content.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="group bg-white text-surface-800 hover:bg-surface-100 px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-soft-lg flex items-center gap-2"
              >
                Get started for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/signin"
                className="text-surface-300 hover:text-white px-8 py-4 font-medium text-lg transition-colors"
              >
                Sign in
              </Link>
            </div>
            <p className="text-sm text-surface-400 mt-8">
              No credit card required • Free forever for personal use
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 bg-surface-100 border-t border-surface-200">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-surface-800">
            StashIt
          </span>
        </div>
        <div className="flex items-center gap-8 text-sm text-surface-500">
          <a href="#" className="hover:text-surface-700 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-surface-700 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-surface-700 transition-colors">
            Contact
          </a>
        </div>
        <p className="text-sm text-surface-400">
          © 2026 StashIt. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

const Home = () => (
  <div className="min-h-screen bg-surface-50">
    <Navigation />
    <HeroSection />
    <FeaturesBentoGrid />
    <HowItWorksSection />
    <ContentTypesSection />
    <TechnologySection />
    <CTASection />
    <Footer />
  </div>
);

export default Home;
