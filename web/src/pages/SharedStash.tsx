import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ExternalLink,
  Link as LinkIcon,
  FileText,
  Video,
  Loader2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  User,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { contentApi } from "../lib/api";

interface SharedContentItem {
  _id: string;
  title: string;
  link: string;
  type: string;
}

interface SharedStashData {
  username: string;
  content: SharedContentItem[];
}

const contentTypes: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  link: { label: "Link", icon: LinkIcon, color: "bg-blue-500" },
  document: { label: "Document", icon: FileText, color: "bg-amber-500" },
  video: { label: "Video", icon: Video, color: "bg-rose-500" },
};

const getTypeConfig = (type: string) =>
  contentTypes[type] ?? contentTypes["link"];

const SharedStash = () => {
  const { hash } = useParams<{ hash: string }>();
  const [data, setData] = useState<SharedStashData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hash) {
      setError("Invalid share link");
      setIsLoading(false);
      return;
    }

    const fetchSharedContent = async () => {
      try {
        const response = await contentApi.getShared(hash);
        setData(response.data as SharedStashData);
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: { status?: number } }).response
            ?.status === "number"
        ) {
          const status = (err as { response: { status: number } }).response
            .status;
          if (status === 404) {
            setError(
              "This share link doesn't exist or has been removed by the owner.",
            );
          } else {
            setError("Something went wrong. Please try again later.");
          }
        } else {
          setError("Unable to connect. Please check your network and retry.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedContent();
  }, [hash]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow animate-pulse-soft">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-surface-800">
            StashIt
          </span>
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-display font-bold text-surface-800 mb-3">
            Link not found
          </h1>
          <p className="text-surface-500 mb-6">
            {error ?? "This share link is not available."}
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
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-glow transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-surface-800">
              StashIt
            </span>
          </Link>
          <Link to="/signin">
            <Button variant="secondary" size="sm">
              Sign in
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* User info banner */}
        <div className="mb-8 p-6 bg-white border border-surface-200 rounded-2xl shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center">
              <User className="w-7 h-7 text-accent-600" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-surface-800">
                {data.username}'s Stash
              </h1>
              <p className="text-surface-500">
                {data.content.length}{" "}
                {data.content.length === 1 ? "item" : "items"} shared publicly
              </p>
            </div>
          </div>
        </div>

        {/* Content grid */}
        {data.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-surface-200 rounded-3xl shadow-soft">
            <div className="w-20 h-20 bg-surface-100 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-surface-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-surface-800 mb-2">
              Nothing here yet
            </h3>
            <p className="text-surface-500 text-center max-w-md">
              This user hasn't added any content to their stash yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.content.map((item) => {
              const typeConfig = getTypeConfig(item.type);
              const Icon = typeConfig.icon;

              return (
                <Card
                  key={item._id}
                  className="group relative overflow-hidden hover:border-accent-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 ${typeConfig.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs uppercase tracking-wide text-surface-400 font-medium">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-surface-800 mb-3 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-surface-400 truncate mb-4">
                    {item.link}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium text-sm transition-colors"
                  >
                    Open link
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 mt-8">
        <div className="text-center text-sm text-surface-400">
          Shared via{" "}
          <Link
            to="/"
            className="text-accent-600 hover:text-accent-700 font-medium transition-colors"
          >
            StashIt
          </Link>{" "}
          — Save, search, and share your content intelligently.
        </div>
      </footer>
    </div>
  );
};

export default SharedStash;
