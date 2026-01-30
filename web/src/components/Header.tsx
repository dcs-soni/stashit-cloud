import { LogOut, Sparkles, Bell, Settings } from "lucide-react";
import Button from "./ui/Button";

interface HeaderProps {
  username?: string;
  onLogout?: () => void;
}

const Header = ({ username, onLogout }: HeaderProps) => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-200">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-surface-800">
              StashIt
            </h1>
            <p className="text-xs text-surface-400">Your content hub</p>
          </div>
        </div>

        {/* User section */}
        {username && (
          <div className="flex items-center gap-2">
            {/* Notifications (placeholder) */}
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-all">
              <Bell className="w-5 h-5" />
            </button>

            {/* Settings (placeholder) */}
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-all">
              <Settings className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-surface-200 mx-2" />

            {/* User avatar and name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-surface-700">
                  {username}
                </p>
                <p className="text-xs text-surface-400">Free plan</p>
              </div>
            </div>

            {/* Logout button */}
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  </header>
);

export default Header;
