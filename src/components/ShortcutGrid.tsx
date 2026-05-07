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

        </div>
      </DndContext>
    </div>
  );
}
