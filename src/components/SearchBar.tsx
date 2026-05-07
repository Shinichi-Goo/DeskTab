import { Search, Mic, Camera } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  logoStyle: 'color' | 'monochrome';
  logoText: string;
  logoFont: string;
}

export function SearchBar({ logoStyle, logoText, logoFont }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="w-full max-w-[700px] mx-auto mt-[15vh] mb-[8vh] flex flex-col items-center">
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
          placeholder="Search Google or type a URL"
          className="search-input w-full h-[58px] pl-12 pr-28 rounded-full glass-panel focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium text-[17px]"
          autoFocus
        />
        <div className="absolute inset-y-0 right-3 flex items-center gap-1">
          <button
            type="button"
            className="p-2 btn-icon rounded-full transition-colors hidden sm:block"
          >
            <Mic size={18} />
          </button>
          <button
            type="button"
            className="p-2 btn-icon rounded-full transition-colors hidden sm:block"
          >
            <Camera size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
