import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { ShortcutItem } from "./ShortcutItem";
import { Shortcut } from "../types";
import { Plus } from "lucide-react";

interface ShortcutGridProps {
  shortcuts: Shortcut[];
  setShortcuts: (shortcuts: Shortcut[]) => void;
  isEditMode: boolean;
  onAddClick: () => void;
  onRemoveItem: (id: string) => void;
  onEditItem: (shortcut: Shortcut) => void;
  iconScale: number;
}

export function ShortcutGrid({
  shortcuts,
  setShortcuts,
  isEditMode,
  onAddClick,
  onRemoveItem,
  onEditItem,
  iconScale,
}: ShortcutGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200, // require 200ms long press to drag
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setShortcuts((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pb-32">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div 
          className="grid gap-4 sm:gap-6 justify-center"
          style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${130 * iconScale}px, 1fr))` }}
        >
          <SortableContext items={shortcuts.map(s => s.id)} strategy={rectSortingStrategy}>
            {shortcuts.map((shortcut) => (
              <ShortcutItem
                key={shortcut.id}
                shortcut={shortcut}
                isEditMode={isEditMode}
                onRemove={() => onRemoveItem(shortcut.id)}
                onEdit={() => onEditItem(shortcut)}
              />
            ))}
          </SortableContext>

          {/* Add Button */}
          <button
            onClick={onAddClick}
            className="border-2 border-dashed border-white/20 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-white/40 transition-colors w-full aspect-square add-btn"
          >
            <div className="w-[30%] aspect-square rounded-full flex items-center justify-center mb-2 add-btn-icon-wrapper">
              <span className="text-2xl font-light text-muted opacity-60">+</span>
            </div>
            <span className="text-sm font-medium truncate px-2 add-btn-text">
              Add Shortcut
            </span>
          </button>
        </div>
      </DndContext>
    </div>
  );
}
