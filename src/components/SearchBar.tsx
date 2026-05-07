import { Search, Mic, Camera } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

interface SearchBarProps {
  logoStyle: 'color' | 'monochrome';
  logoText: string;
  logoFont: string;
}

export function SearchBar({ logoStyle, logoText, logoFont }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (isAiMode) {
        window.location.href = `https://gemini.google.com/app?q=${encodeURIComponent(query)}`;
      } else {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-[15vh] mb-[8vh] flex flex-col items-center">
      {/* Dynamic Logo */}
      <div className="mb-8 pointer-events-none drop-shadow-md">
        <div 
          className="text-[5.5rem] font-bold tracking-tighter leading-none flex items-center justify-center transition-all"
          style={{ fontFamily: logoFont !== 'default' ? logoFont : undefined }}
        >
          {logoStyle === 'color' && logoText.toLowerCase() === 'google' ? (
            <>
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </>
          ) : (
            <span className={logoStyle === 'color' ? "bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent" : "text-white drop-shadow-md"}>
              {logoText}
            </span>
          )}
        </div>
      </div>

      {/* Search Input */}
      <form
        onSubmit={handleSubmit}
        className="w-full relative flex items-center group"
      >
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none btn-icon">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isAiMode ? "Ask Gemini anything..." : "Search Google or type a URL"}
          className={cn(
            "search-input w-full h-[52px] pl-12 pr-44 rounded-full glass-panel focus:outline-none focus:ring-2 transition-all font-medium",
            isAiMode ? "focus:ring-purple-500/50" : "focus:ring-blue-500/40"
          )}
          autoFocus
        />
        <div className="absolute inset-y-0 right-2 flex items-center gap-1">
          <button
            type="button"
            className="p-2 btn-icon rounded-full transition-colors hidden sm:block"
          >
            <Mic size={18} />
          </button>
          <button
            type="button"
            className="p-2 btn-icon rounded-full transition-colors mr-1 hidden sm:block"
          >
            <Camera size={18} />
          </button>
          <button
            type="button"
            onClick={() => setIsAiMode(!isAiMode)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-full transition-all font-semibold text-sm shadow-md",
              isAiMode 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-purple-500/20 shadow-xl scale-105" 
                : "bg-white text-black hover:bg-white/90"
            )}
          >
            <span className={cn("font-bold", !isAiMode && "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent")}>
              ✨
            </span>
            {isAiMode ? "AI Mode On" : "AI Mode"}
          </button>
        </div>
      </form>
    </div>
  );
}
