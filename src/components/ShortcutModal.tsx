import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Type } from "lucide-react";
import { Shortcut } from "../types";
import { cn } from "../lib/utils";

export const GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-red-500 to-orange-500",
  "from-emerald-500 to-teal-600",
  "from-pink-500 to-rose-400",
  "from-gray-700 to-gray-900",
  "from-blue-400 to-blue-700",
  "from-yellow-400 to-orange-500",
  "from-zinc-100 to-zinc-300",
];

export const MORANDI_COLORS = [
  "#E8E4DF", "#D5CABD", "#A7AFA8", "#9E9086", 
  "#C2B2A3", "#747B80", "#E1D4C8", "#959D96",
  "#2C3E50", "#111111"
];

export const FONT_FAMILIES = [
  { name: "Default (Sans)", value: "ui-sans-serif, system-ui, sans-serif" },
  { name: "Didot / Serif", value: 'Didot, "Playfair Display", serif' },
  { name: "Space Grotesk", value: '"Space Grotesk", sans-serif' },
  { name: "Monospace", value: "ui-monospace, SFMono-Regular, monospace" },
  { name: "Noto Serif SC (雅致宋体-简)", value: '"Noto Serif SC", serif' },
  { name: "Noto Serif TC (雅緻宋體-繁)", value: '"Noto Serif TC", serif' },
  { name: "Noto Serif JP (明朝体-日)", value: '"Noto Serif JP", serif' },
  { name: "Sawarabi Mincho (さわらび明朝)", value: '"Sawarabi Mincho", serif' },
  { name: "ZCOOL XiaoWei (站酷小薇)", value: '"ZCOOL XiaoWei", serif' },
  { name: "Ma Shan Zheng (狂草手写)", value: '"Ma Shan Zheng", cursive' },
];

const compressImageToDataUrl = (file: File, callback: (dataUrl: string) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      const maxDim = 256; // Icons do not need high resolution
      if (w > maxDim || h > maxDim) {
        if (w > h) { h *= maxDim / w; w = maxDim; }
        else { w *= maxDim / h; h = maxDim; }
      }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/png', 0.9));
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

interface ShortcutModalProps {
  shortcut?: Shortcut | null;
  onClose: () => void;
  onSave: (shortcut: Omit<Shortcut, "id"> | Shortcut) => void;
}

export function ShortcutModal({ shortcut, onClose, onSave }: ShortcutModalProps) {
  const [title, setTitle] = useState(shortcut?.title || "");
  const [url, setUrl] = useState(shortcut?.url || "");
  const [type, setType] = useState<'image' | 'text'>(shortcut?.type || 'image');
  const [text, setText] = useState(shortcut?.text || "");
  const [fontFamily, setFontFamily] = useState(shortcut?.fontFamily || FONT_FAMILIES[0].value);
  const [color, setColor] = useState(shortcut?.color || GRADIENTS[0]);
  const [imageScale, setImageScale] = useState<'sm' | 'md' | 'lg' | 'fill'>(shortcut?.imageScale || 'md');
  const [customIconUrl, setCustomIconUrl] = useState(shortcut?.customIconUrl || "");

  // Auto-generate text fallback from title if empty
  useEffect(() => {
    if (title && !text && !shortcut?.text) {
      setText(title.substring(0, 2).toUpperCase());
    }
  }, [title]);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImageToDataUrl(file, (dataUrl) => {
        setCustomIconUrl(dataUrl);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && url) {
      let finalUrl = url;
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }
      
      const result = {
        ...(shortcut ? { id: shortcut.id } : {}),
        title,
        url: finalUrl,
        type,
        text,
        color,
        imageScale,
        fontFamily,
        customIconUrl
      };
      
      onSave(result);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'var(--modal-overlay)' }}>
      <div className="w-full max-w-[420px] rounded-[24px] overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]" style={{ backgroundColor: 'var(--modal-bg)', border: '1px solid var(--modal-border)' }}>
        <div className="flex justify-between items-center p-5 border-b shrink-0" style={{ borderColor: 'var(--modal-border)' }}>
          <h2 className="text-lg font-semibold shortcut-title">{shortcut ? "Edit shortcut" : "Add shortcut"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-full btn-icon transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5 overflow-y-auto min-h-0">
          {/* Basic Info */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium pl-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium search-input text-sm"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
                placeholder="e.g. YouTube"
                required
                autoFocus
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium pl-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full h-11 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium search-input text-sm"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
                placeholder="e.g. youtube.com"
                required
              />
            </div>
          </div>

          <div className="h-px w-full" style={{ backgroundColor: 'var(--modal-border)' }} />

          {/* Icon Customization */}
          <div className="flex flex-col gap-4">
            <label className="text-xs font-medium pl-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Icon Style</label>
            
            <div className="flex p-1 rounded-xl" style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
              <button
                type="button"
                onClick={() => setType('image')}
                className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all", type === 'image' ? 'bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 dark:text-zinc-400')}
              >
                <ImageIcon size={16} /> Image
              </button>
              <button
                type="button"
                onClick={() => setType('text')}
                className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all", type === 'text' ? 'bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 dark:text-zinc-400')}
              >
                <Type size={16} /> Text
              </button>
            </div>

            {type === 'image' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl border border-dashed flex items-center justify-center overflow-hidden shrink-0" style={{ borderColor: 'var(--input-border)', backgroundColor: 'var(--input-bg)' }}>
                    {customIconUrl ? (
                      <img src={customIconUrl} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="opacity-30" style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs font-medium bg-[var(--add-btn-bg)] hover:bg-[var(--add-btn-hover)] px-3 py-2 rounded-lg cursor-pointer transition-colors text-center shortcut-title border border-[var(--add-btn-border)]">
                      Upload Custom Logo
                      <input type="file" accept="image/*" className="hidden" onChange={handleIconUpload} />
                    </label>
                    {customIconUrl && (
                      <button 
                        type="button" 
                        onClick={() => setCustomIconUrl("")}
                        className="text-[10px] text-red-500 hover:text-red-600 transition-colors self-start ml-1"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>Image Padding</label>
                  <div className="flex gap-2">
                    {(['sm', 'md', 'lg', 'fill'] as const).map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => setImageScale(scale)}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize border",
                          imageScale === scale 
                            ? "border-blue-500 text-blue-500 bg-blue-500/10" 
                            : "border-transparent text-zinc-500"
                        )}
                        style={imageScale !== scale ? { backgroundColor: 'var(--input-bg)' } : undefined}
                      >
                        {scale}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {type === 'text' && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1.5 w-1/3">
                    <label className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>Display text</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full h-11 px-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-mono font-bold search-input text-lg text-center tracking-widest"
                      style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
                      placeholder="A"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>Typography (Font)</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all search-input text-sm"
                      style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
                    >
                      {FONT_FAMILIES.map(ff => (
                        <option key={ff.value} value={ff.value}>{ff.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>Background Theme</label>
              <div className="flex flex-wrap gap-2.5 p-1">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border relative cursor-pointer hover:scale-105 transition-all shadow-sm" style={{ borderColor: 'var(--modal-border)' }}>
                  <input 
                    type="color" 
                    value={color.startsWith('#') ? color : '#ffffff'}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-[-10px] w-12 h-12 cursor-pointer"
                    title="Choose custom color"
                  />
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <span className="text-white drop-shadow-md text-[10px] mix-blend-difference font-bold">+</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setColor("transparent")}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all ring-offset-2 ring-offset-[var(--modal-bg)] shadow-sm border flex items-center justify-center relative overflow-hidden",
                    color === "transparent" ? "ring-2 ring-blue-500 scale-110" : "hover:scale-105"
                  )}
                  style={{ borderColor: 'var(--modal-border)' }}
                  title="Transparent"
                >
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #888 25%, transparent 25%, transparent 75%, #888 75%, #888), repeating-linear-gradient(45deg, #888 25%, transparent 25%, transparent 75%, #888 75%, #888)', backgroundPosition: '0 0, 4px 4px', backgroundSize: '8px 8px' }} />
                  <span className="text-[14px] font-light z-10 opacity-70" style={{ color: 'var(--text-color)' }}>/</span>
                </button>

                {[...GRADIENTS, ...MORANDI_COLORS].map((val) => {
                  const isGradient = val.startsWith('from-');
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setColor(val)}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all ring-offset-2 ring-offset-[var(--modal-bg)] shadow-sm",
                        isGradient ? `bg-gradient-to-br ${val}` : '',
                        color === val ? "ring-2 ring-blue-500 scale-110" : "hover:scale-105"
                      )}
                      style={!isGradient ? { backgroundColor: val } : {}}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl font-medium transition-colors add-btn-text"
              style={{ backgroundColor: 'var(--add-btn-bg)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              disabled={!title || !url}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
