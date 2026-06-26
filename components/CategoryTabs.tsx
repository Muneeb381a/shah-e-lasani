"use client";

import { Category } from "@/data/menu";

const CATEGORY_EMOJI: Record<string, string> = {
  "cat-deals":  "🔥",
  "cat-pizza":  "🍕",
  "cat-burger": "🍔",
  "cat-sides":  "🍟",
  "cat-drinks": "🥤",
};

export default function CategoryTabs({
  categories,
  activeId,
  onChange,
}: {
  categories: Category[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
      {categories.map((cat) => {
        const isActive = activeId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
            style={{
              backgroundColor: isActive ? "#E4002B" : "#242424",
              borderColor: isActive ? "#E4002B" : "#333333",
              color: isActive ? "#ffffff" : "#9ca3af",
            }}
          >
            <span>{CATEGORY_EMOJI[cat.id] ?? "🍽️"}</span>
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
