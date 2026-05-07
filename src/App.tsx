import { useState, useEffect } from "react";
import { SearchBar } from "./components/SearchBar";
import { ShortcutGrid } from "./components/ShortcutGrid";
import { ShortcutModal } from "./components/ShortcutModal";
import { Shortcut } from "./types";
import { Settings2, Check, Moon, Sun, Image as ImageIcon, SlidersHorizontal, Trash2, Plus } from "lucide-react";

const INITIAL_SHORTCUTS: Shortcut[] = [
  { id: "1", title: "Gmail", url: "https://mail.google.com" },
  { id: "2", title: "YouTube", url: "https://youtube.com" },
  { id: "3", title: "Gemini", url: "https://gemini.google.com" },
];

const compressImage = (file: File, callback: (dataUrl: string) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      if (w > 1920) { h *= 1920 / w; w = 1920; }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

export default function App() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(() => {
    const saved = localStorage.getItem("chrome-shortcuts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SHORTCUTS;
      }
    }
    return INITIAL_SHORTCUTS;
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  const [bgImage, setBgImage] = useState<string | null>(() => {
    return localStorage.getItem('chrome-bg') || null;
  });
  
  const [iconScale, setIconScale] = useState<number>(() => {
    return parseFloat(localStorage.getItem('chrome-icon-scale') || '1');
  });

  const [logoStyle, setLogoStyle] = useState<'color' | 'monochrome'>(() => {
    return (localStorage.getItem('chrome-logo-style') as any) || 'color';
  });
  const [logoText, setLogoText] = useState(() => {
    return localStorage.getItem('chrome-logo-text') || 'Google';
  });
  const [logoFont, setLogoFont] = useState(() => {
    return localStorage.getItem('chrome-logo-font') || 'default';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("chrome-shortcuts", JSON.stringify(shortcuts));
  }, [shortcuts]);

  useEffect(() => {
    if (bgImage) localStorage.setItem('chrome-bg', bgImage);
    else localStorage.removeItem('chrome-bg');
  }, [bgImage]);

  useEffect(() => {
    localStorage.setItem('chrome-icon-scale', iconScale.toString());
  }, [iconScale]);

  useEffect(() => {
    localStorage.setItem('chrome-logo-style', logoStyle);
  }, [logoStyle]);

  useEffect(() => {
    localStorage.setItem('chrome-logo-text', logoText);
  }, [logoText]);

  useEffect(() => {
    localStorage.setItem('chrome-logo-font', logoFont);
  }, [logoFont]);

  const handleSaveShortcut = (shortcut: Omit<Shortcut, "id"> | Shortcut) => {
    if ('id' in shortcut) {
      setShortcuts((prev) => prev.map((s) => s.id === shortcut.id ? shortcut as Shortcut : s));
    } else {
      setShortcuts((prev) => [
        ...prev,
        { ...shortcut, id: Math.random().toString(36).substring(2, 9) } as Shortcut,
      ]);
    }
  };

  const handleRemoveShortcut = (id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
  };
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (dataUrl) => {
        setBgImage(dataUrl);
      });
    }
  };

  return (
    <div 
      className="theme-transition min-h-screen w-full flex flex-col pt-10 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }}
    >
      {/* Background blobs (hide if custom wallpaper) */}
      {!bgImage && (
        <>
          <div className="bg-blob-blue absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none transition-colors duration-500"></div>
          <div className="bg-blob-purple absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none transition-colors duration-500"></div>
        </>
      )}

      {/* Dark overlay for readability if custom wallpaper is used */}
      {bgImage && <div className="absolute inset-0 bg-black/20 pointer-events-none" />}

      <div className="relative z-10 w-full h-screen overflow-y-auto overflow-x-hidden flex flex-col">
        <SearchBar
          logoStyle={logoStyle}
          logoText={logoText}
          logoFont={logoFont}
        />

        <ShortcutGrid
          shortcuts={shortcuts}
          setShortcuts={setShortcuts}
          isEditMode={isEditMode}
          onAddClick={() => setIsAdding(true)}
          onRemoveItem={handleRemoveShortcut}
          onEditItem={(s) => setEditingShortcut(s)}
          iconScale={iconScale}
        />
      </div>

      {/* Edit Mode Control Panel */}
      {isEditMode && (
        <div className="fixed bottom-24 right-6 z-40 animate-fade-in">
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-4 shadow-2xl min-w-[200px]">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider font-medium text-white mix-blend-difference opacity-80 flex items-center gap-2">
                <SlidersHorizontal size={14} /> Icon Size
              </label>
              <input 
                type="range" 
                min="0.5" 
                max="1.5" 
                step="0.05"
                value={iconScale}
                onChange={(e) => setIconScale(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
            
            <div className="h-px w-full bg-white/10" />

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider font-medium text-white mix-blend-difference opacity-80 flex items-center gap-2">
                <ImageIcon size={14} /> Logo Customization
              </label>
              <input 
                type="text" 
                value={logoText} 
                onChange={(e) => setLogoText(e.target.value)} 
                placeholder="Google" 
                className="w-full bg-white/10 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setLogoStyle('color')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${logoStyle === 'color' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  Color
                </button>
                <button
                  onClick={() => setLogoStyle('monochrome')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${logoStyle === 'monochrome' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  Monochrome
                </button>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider font-medium text-white mix-blend-difference opacity-80 flex items-center gap-2">
                <ImageIcon size={14} /> Wallpaper
              </label>
              <div className="flex gap-2">
                <label className="flex-1 text-center py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm cursor-pointer transition-colors text-white font-medium select-none">
                  Upload
                  <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
                </label>
                {bgImage && (
                  <button 
                    onClick={() => setBgImage(null)}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
                    title="Remove Wallpaper"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customize & Theme Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          onClick={() => setIsAdding(true)}
          className="glass-panel p-3 rounded-full hover:bg-[var(--add-btn-hover)] transition-all font-medium flex items-center justify-center btn-icon shadow-lg"
          title="Add new shortcut"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
        
        <button
          onClick={toggleTheme}
          className="glass-panel p-3 rounded-full hover:bg-[var(--add-btn-hover)] transition-all font-medium flex items-center justify-center btn-icon"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
            isEditMode 
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20" 
              : "glass-panel px-4 py-2 hover:bg-[var(--add-btn-hover)] font-medium shortcut-title backdrop-blur-xl"
          }`}
        >
          {isEditMode ? (
             <>
               <Check size={18} />
               <span className="text-sm font-medium">Done</span>
             </>
          ) : (
             <>
               <Settings2 size={18} />
               <span className="text-sm font-medium">Customize</span>
             </>
          )}
        </button>
      </div>

      {(isAdding || editingShortcut) && (
        <ShortcutModal
          shortcut={editingShortcut}
          onClose={() => {
            setIsAdding(false);
            setEditingShortcut(null);
          }}
          onSave={handleSaveShortcut}
        />
      )}
    </div>
  );
}
