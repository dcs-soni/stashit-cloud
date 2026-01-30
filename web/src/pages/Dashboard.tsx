import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Link as LinkIcon,
  FileText,
  Video,
  X,
  ExternalLink,
  Trash2,
  Share2,
  Loader2,
  Copy,
  Check,
  Grid3X3,
  List,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { contentApi, searchApi } from "../lib/api";

interface ContentItem {
  _id: string;
  title: string;
  link: string;
  type: string;
}
interface SearchResultItem {
  title: string;
  link: string;
}
interface DashboardProps {
  username: string | null;
  onLogout: () => void;
}

const contentTypes = [
  { value: "link", label: "Link", icon: LinkIcon, color: "bg-blue-500" },
  {
    value: "document",
    label: "Document",
    icon: FileText,
    color: "bg-amber-500",
  },
  { value: "video", label: "Video", icon: Video, color: "bg-rose-500" },
];

const getTypeConfig = (type: string) =>
  contentTypes.find((t) => t.value === type) || contentTypes[0];

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) => (
  <div className="bg-white border border-surface-200 rounded-2xl p-5 flex items-center gap-4 shadow-soft hover:shadow-soft-lg transition-all">
    <div
      className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-surface-800">
        {value}
      </p>
      <p className="text-sm text-surface-500">{label}</p>
    </div>
  </div>
);

const ContentCard = ({
  item,
  onDelete,
  viewMode,
}: {
  item: ContentItem | SearchResultItem;
  onDelete?: (id: string) => void;
  viewMode: "grid" | "list";
}) => {
  const isFullItem = "_id" in item;
  const typeConfig = getTypeConfig(isFullItem ? item.type : "link");
  const Icon = typeConfig.icon;
  if (viewMode === "list") {
    return (
      <div className="group bg-white border border-surface-200 rounded-xl p-4 flex items-center gap-4 hover:border-accent-300 hover:shadow-soft transition-all">
        <div
          className={`w-10 h-10 ${typeConfig.color} rounded-lg flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-surface-800 truncate">
            {item.title}
          </h3>
          <p className="text-sm text-surface-400 truncate">{item.link}</p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-surface-400 hover:text-accent-600 hover:bg-accent-50 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          {isFullItem && onDelete && (
            <button
              onClick={() => onDelete(item._id)}
              className="p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
  return (
    <Card className="group relative overflow-hidden hover:border-accent-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 ${typeConfig.color} rounded-lg flex items-center justify-center`}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs uppercase tracking-wide text-surface-400 font-medium">
            {isFullItem ? item.type : "link"}
          </span>
        </div>
        {isFullItem && onDelete && (
          <button
            onClick={() => onDelete(item._id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <h3 className="text-lg font-semibold text-surface-800 mb-3 line-clamp-2 leading-tight">
        {item.title}
      </h3>
      <p className="text-sm text-surface-400 truncate mb-4">{item.link}</p>
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
};

const AddContentModal = ({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (content: { title: string; link: string; type: string }) => void;
}) => {
  const [newContent, setNewContent] = useState({
    title: "",
    link: "",
    type: "link",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onAdd(newContent);
    setNewContent({ title: "", link: "", type: "link" });
    setIsSubmitting(false);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-soft-lg w-full max-w-lg m-4 overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-accent-600" />
            </div>
            <h2 className="text-xl font-display font-bold text-surface-800">
              Add New Content
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input
            label="Title"
            value={newContent.title}
            onChange={(e) =>
              setNewContent((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Give your content a name"
            required
          />
          <Input
            label="URL"
            type="url"
            value={newContent.link}
            onChange={(e) =>
              setNewContent((prev) => ({ ...prev, link: e.target.value }))
            }
            placeholder="https://example.com"
            required
          />
          <div>
            <label className="block text-sm font-medium text-surface-600 mb-3">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {contentTypes.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setNewContent((prev) => ({ ...prev, type: value }))
                  }
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${newContent.type === value ? "border-accent-500 bg-accent-50" : "border-surface-200 hover:border-surface-300 hover:bg-surface-50"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${newContent.type === value ? color : "bg-surface-200"}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${newContent.type === value ? "text-white" : "text-surface-500"}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${newContent.type === value ? "text-accent-700" : "text-surface-600"}`}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Content
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = ({ username, onLogout }: DashboardProps) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(
    null,
  );
  const [shareHash, setShareHash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchContent = useCallback(async () => {
    try {
      const response = await contentApi.getAll();
      setContent(response.data.content);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleAddContent = async (newContent: {
    title: string;
    link: string;
    type: string;
  }) => {
    try {
      await contentApi.create(
        newContent.title,
        newContent.link,
        newContent.type,
      );
      fetchContent();
    } catch (error) {
      console.error("Failed to add content:", error);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await contentApi.delete(id);
      fetchContent();
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };
  const handleSearch = async (query: string) => {
    try {
      const response = await searchApi.search(query);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };
  const handleShare = async () => {
    try {
      const response = await contentApi.toggleShare(true);
      const hash = response.data.hash ?? null;
      setShareHash(hash);
    } catch (error) {
      console.error("Failed to create share link:", error);
    }
  };
  const copyShareLink = () => {
    if (shareHash) {
      navigator.clipboard.writeText(
        `${window.location.origin}/stash/${shareHash}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const clearSearch = () => setSearchResults(null);

  const displayContent: (ContentItem | SearchResultItem)[] =
    searchResults ?? content;
  const stats = {
    total: content.length,
    links: content.filter((c) => c.type === "link").length,
    documents: content.filter((c) => c.type === "document").length,
    videos: content.filter((c) => c.type === "video").length,
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Header username={username ?? "User"} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-surface-800 mb-2">
            Welcome back, {username}!
          </h1>
          <p className="text-surface-500">
            Here's what's happening with your content today.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FolderOpen}
            label="Total Items"
            value={stats.total}
            color="bg-accent-500"
          />
          <StatCard
            icon={LinkIcon}
            label="Links"
            value={stats.links}
            color="bg-blue-500"
          />
          <StatCard
            icon={FileText}
            label="Documents"
            value={stats.documents}
            color="bg-amber-500"
          />
          <StatCard
            icon={Video}
            label="Videos"
            value={stats.videos}
            color="bg-rose-500"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <SearchBar onSearch={handleSearch} />
          <div className="flex items-center gap-2">
            {searchResults && (
              <Button variant="secondary" onClick={clearSearch}>
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
            <div className="flex items-center bg-surface-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-soft text-surface-800" : "text-surface-400 hover:text-surface-600"}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-soft text-surface-800" : "text-surface-400 hover:text-surface-600"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <Button variant="secondary" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Content
            </Button>
          </div>
        </div>
        {shareHash && (
          <div className="mb-6 p-4 bg-accent-50 border border-accent-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-800">
                  Share link created!
                </p>
                <p className="text-sm text-surface-500 font-mono">
                  {window.location.origin}/stash/{shareHash}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={copyShareLink}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-accent-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy link
                </>
              )}
            </Button>
          </div>
        )}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent-500 mb-4" />
            <p className="text-surface-500">Loading your content...</p>
          </div>
        ) : displayContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-surface-200 rounded-3xl shadow-soft">
            <div className="w-20 h-20 bg-surface-100 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-surface-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-surface-800 mb-2">
              {searchResults ? "No results found" : "No content yet"}
            </h3>
            <p className="text-surface-500 mb-6 text-center max-w-md">
              {searchResults
                ? "Try a different search term or add more content."
                : "Start building your personal knowledge base by adding links, documents, and videos."}
            </p>
            {!searchResults && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Add your first content
              </Button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            }
          >
            {displayContent.map((item) => (
              <ContentCard
                key={"_id" in item ? item._id : item.link}
                item={item}
                onDelete={"_id" in item ? handleDelete : undefined}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>
      <AddContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddContent}
      />
    </div>
  );
};

export default Dashboard;
