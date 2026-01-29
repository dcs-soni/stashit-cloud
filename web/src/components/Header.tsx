import { LogOut, Cloud } from "lucide-react";
import Button from "./ui/Button";

interface HeaderProps {
  username?: string;
  onLogout?: () => void;
}

const Header = ({ username, onLogout }: HeaderProps) => (
  <header className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-dark-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">StashIt Cloud</h1>
            <p className="text-xs text-dark-400">Powered by ChromaDB</p>
          </div>
        </div>

        {username && (
          <div className="flex items-center gap-4">
            <span className="text-dark-300">
              Welcome,{" "}
              <span className="text-white font-medium">{username}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  </header>
);

export default Header;
