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
  { value: "link", label: "Link", icon: LinkIcon },
  { value: "document", label: "Document", icon: FileText },
  { value: "video", label: "Video", icon: Video },
];

const Dashboard = ({ username, onLogout }: DashboardProps) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(
    null,
  );
  const [shareHash, setShareHash] = useState<string | null>(null);

  const [newContent, setNewContent] = useState({
    title: "",
    link: "",
    type: "link",
  });

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

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contentApi.create(
        newContent.title,
        newContent.link,
        newContent.type,
      );
      setNewContent({ title: "", link: "", type: "link" });
      setIsModalOpen(false);
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
      setShareHash(response.data.hash ?? null);
    } catch (error) {
      console.error("Failed to create share link:", error);
    }
  };

  const clearSearch = () => setSearchResults(null);

  const displayContent: (ContentItem | SearchResultItem)[] =
    searchResults ?? content;

  return (
    <div className="min-h-screen bg-dark-950">
      <Header username={username ?? "User"} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar onSearch={handleSearch} />
          {searchResults && (
            <Button variant="secondary" onClick={clearSearch}>
              Clear Search
            </Button>
          )}
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
          <Button variant="secondary" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {shareHash && (
          <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
            <p className="text-primary-300 text-sm">
              Share link:{" "}
              <span className="font-mono">
                {window.location.origin}/stash/{shareHash}
              </span>
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : displayContent.length === 0 ? (
          <Card className="text-center py-16">
            <FileText className="w-12 h-12 text-dark-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-300">
              No content yet
            </h3>
            <p className="text-dark-500 mt-1">
              Click "Add Content" to get started
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayContent.map((item) => (
              <Card
                key={"_id" in item ? item._id : item.link}
                className="group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-primary-400" />
                    <span className="text-xs uppercase tracking-wide text-dark-400">
                      {"type" in item ? item.type : "link"}
                    </span>
                  </div>
                  {"_id" in item && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-dark-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-white font-medium mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              </Card>
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Add New Content
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-dark-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContent} className="space-y-4">
              <Input
                label="Title"
                value={newContent.title}
                onChange={(e) =>
                  setNewContent((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter a title"
                required
              />

              <Input
                label="Link"
                type="url"
                value={newContent.link}
                onChange={(e) =>
                  setNewContent((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="https://example.com"
                required
              />

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Type
                </label>
                <div className="flex gap-2">
                  {contentTypes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setNewContent((prev) => ({ ...prev, type: value }))
                      }
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all ${
                        newContent.type === value
                          ? "border-primary-500 bg-primary-500/10 text-primary-400"
                          : "border-dark-600 text-dark-400 hover:border-dark-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Content
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
