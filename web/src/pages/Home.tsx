import { Link } from "react-router-dom";
import { Cloud, Zap, Shield, Search, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Powered by Chroma Cloud for instant semantic search",
  },
  {
    icon: Shield,
    title: "Secure Storage",
    description: "SOC 2 certified infrastructure keeps your data safe",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find content using natural language queries",
  },
];

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">StashIt Cloud</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-8">
          <Cloud className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-primary-300">
            Powered by ChromaDB Cloud
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Your Personal Content
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
            Storage Solution
          </span>
        </h1>

        <p className="text-lg text-dark-300 max-w-2xl mx-auto mb-10">
          Save links, notes, and documents. Search semantically with AI-powered
          vector search. Access your content from anywhere.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/signup">
            <Button size="lg">
              Start for Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/signin">
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-32 grid md:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="p-6 bg-dark-800/30 border border-dark-700 rounded-2xl hover:border-dark-600 transition-colors"
          >
            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-dark-400">{description}</p>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export default Home;
