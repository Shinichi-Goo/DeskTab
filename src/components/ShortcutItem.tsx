import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Shortcut } from "../types";
import { cn } from "../lib/utils";
import { Edit2 } from "lucide-react";
import { GRADIENTS } from "./ShortcutModal";

interface ShortcutItemProps {
  shortcut: Shortcut;
  isEditMode: boolean;
  onRemove: () => void;
  onEdit: () => void;
}

const LONG_PRESS_MS = 600;
const LONG_PRESS_MOVE_TOLERANCE = 5;

export function ShortcutItem({ shortcut, isEditMode, onRemove, onEdit }: ShortcutItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: shortcut.id,
    disabled: false,
  });

  const itemRef = useRef<HTMLDivElement | null>(null);
  const setRefs = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    itemRef.current = node;
  };

  const [showActions, setShowActions] = useState(false);
  const pressTimerRef = useRef<number | null>(null);
  const pressStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const clearPressTimer = () => {
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handlePointerDownCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isEditMode) return;
    pressStartPosRef.current = { x: e.clientX, y: e.clientY };
    clearPressTimer();
    pressTimerRef.current = window.setTimeout(() => {
      setShowActions(true);
    }, LONG_PRESS_MS);
  };

  const handlePointerMoveCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pressStartPosRef.current) return;
    const dx = Math.abs(e.clientX - pressStartPosRef.current.x);
    const dy = Math.abs(e.clientY - pressStartPosRef.current.y);
    if (dx > LONG_PRESS_MOVE_TOLERANCE || dy > LONG_PRESS_MOVE_TOLERANCE) {
      clearPressTimer();
    }
  };

  const handlePointerEndCapture = () => {
    clearPressTimer();
    pressStartPosRef.current = null;
  };

  useEffect(() => {
    if (isDragging) clearPressTimer();
  }, [isDragging]);

  useEffect(() => () => clearPressTimer(), []);

  useEffect(() => {
    if (!showActions) return;
    const handleOutside = (e: PointerEvent) => {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };
    const t = window.setTimeout(() => {
      document.addEventListener("pointerdown", handleOutside);
    }, 100);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, [showActions]);

  useEffect(() => {
    if (isEditMode) setShowActions(false);
  }, [isEditMode]);

  const showButtons = isEditMode || showActions;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  let domain = "";
  try {
    domain = new URL(shortcut.url).hostname;
  } catch (e) {
    domain = shortcut.url;
  }
  const faviconUrl = shortcut.iconUrl || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  const gradientIndex = (shortcut.title.charCodeAt(0) || 0) % GRADIENTS.length;
  const defaultGradient = GRADIENTS[gradientIndex];
  const colorVal = shortcut.color || defaultGradient;
  const isTransparent = colorVal === 'transparent';
  const isGradient = !isTransparent && colorVal.includes('from-');
  const bgClass = isTransparent ? 'bg-transparent' : (isGradient ? `bg-gradient-to-br ${colorVal}` : '');
  const bgStyle = (!isGradient && !isTransparent) ? { backgroundColor: colorVal } : {};

  // Determine inner image classes based on scale preference
  let imageClass = "object-contain drop-shadow-md";
  if (shortcut.imageScale === 'sm') imageClass += " w-[50%] h-[50%]";
  else if (shortcut.imageScale === 'lg') imageClass += " w-[90%] h-[90%]";
  else if (shortcut.imageScale === 'fill') imageClass = "w-full h-full object-cover";
  else imageClass += " w-[70%] h-[70%]"; // md

  const displayIconUrl = shortcut.customIconUrl || faviconUrl;
  const textFontFamily = shortcut.fontFamily || 'inherit';

  return (
    <div
      ref={setRefs}
      style={style}
      className={cn(
        "site-card glass-panel rounded-2xl p-3 relative flex flex-col group cursor-grab w-full",
        showButtons && "jiggle",
        isDragging && "opacity-50 scale-105 shadow-2xl z-50 cursor-grabbing"
      )}
      onPointerDownCapture={handlePointerDownCapture}
      onPointerMoveCapture={handlePointerMoveCapture}
      onPointerUpCapture={handlePointerEndCapture}
      onPointerCancelCapture={handlePointerEndCapture}
      {...attributes}
      {...listeners}
    >
      {showButtons && (
        <>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(false);
              onRemove();
            }}
            className="absolute -top-2 -left-2 w-7 h-7 bg-red-500/90 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-500 hover:scale-110 transition-all z-20 cursor-pointer pointer-events-auto border border-white/20"
          >
            <span className="text-[10px] font-bold">✕</span>
          </button>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(false);
              onEdit();
            }}
            className="absolute -top-2 -right-2 w-7 h-7 bg-blue-500/90 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-500 hover:scale-110 transition-all z-20 cursor-pointer pointer-events-auto border border-white/20"
          >
            <Edit2 size={12} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* The Icon Box */}
      <a
        href={showButtons ? undefined : shortcut.url}
        draggable={false}
        onClick={(e) => {
          if (isEditMode) {
            e.preventDefault();
            onEdit();
          } else if (showActions) {
            e.preventDefault();
          }
        }}
        className="flex flex-col flex-1 focus:outline-none pointer-events-auto"
      >
        <div 
          className={`aspect-[3/2] w-full rounded-xl ${bgClass} mb-3 overflow-hidden ${!isTransparent ? 'shadow-inner' : ''} flex items-center justify-center relative`}
          style={bgStyle}
        >
          
          {shortcut.type === 'text' ? (
             <span 
                className={cn(
                  "leading-none font-bold text-white tracking-tighter drop-shadow-lg opacity-90 text-center px-1 truncate w-full",
                  (shortcut.text?.length || 1) <= 2 ? "text-[2.5rem]" : 
                  (shortcut.text?.length || 1) === 3 ? "text-[1.8rem]" : "text-[1.4rem]"
                )}
                style={{ fontFamily: textFontFamily }}
             >
               {shortcut.text || shortcut.title.charAt(0).toUpperCase()}
             </span>
          ) : (
             <div className={cn(
               "flex items-center justify-center overflow-hidden",
               shortcut.imageScale === 'fill' ? 'w-full h-full' : 'w-[50%] aspect-square bg-white/20 rounded-2xl backdrop-blur-md shadow-lg border border-white/20'
             )}>
                <img
                  src={displayIconUrl}
                  alt={shortcut.title}
                  className={imageClass}
                  draggable={false}
                  title={shortcut.title}
                />
             </div>
          )}
        </div>
        
        {/* Title */}
        <div className="flex items-center px-1">
          {(!shortcut.type || shortcut.type === 'image') ? (
            <div className="w-5 h-5 flex items-center justify-center overflow-hidden mr-2 shrink-0" style={{ backgroundColor: 'var(--icon-bg)', borderRadius: '4px' }}>
              <img src={displayIconUrl} className="w-3.5 h-3.5 object-contain" draggable={false} alt="" />
            </div>
          ) : (
            <div 
              className={`w-5 h-5 flex items-center justify-center overflow-hidden mr-2 shrink-0 ${bgClass}`} 
              style={{ borderRadius: '4px', ...bgStyle }}
            >
              <span className="text-[9px] font-bold text-white" style={{ fontFamily: textFontFamily }}>
                {shortcut.text?.charAt(0) || shortcut.title.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-sm font-medium shortcut-title truncate w-full">
            {shortcut.title}
          </span>
        </div>
      </a>
    </div>
  );
}
