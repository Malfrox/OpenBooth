import { useBooth } from "@/lib/photobooth-context";

type Group = {
  title: string;
  serif: boolean;
  accent: string;
  filters: { name: string; css: string }[];
};

const groups: Group[] = [
  {
    title: "Standard",
    serif: false,
    accent: "var(--foreground)",
    filters: [
      { name: "Normal", css: "none" },
      { name: "Classic B&W", css: "grayscale(1) contrast(1.1) brightness(1.05)" },
      { name: "High Contrast B&W", css: "grayscale(1) contrast(1.4) brightness(0.95)" },
    ],
  },
  {
    title: "Vintage Film",
    serif: true,
    accent: "var(--primary)",
    filters: [
      { name: "Kodak Gold 200", css: "sepia(.25) saturate(1.3) contrast(1.1) brightness(1.05)" },
      { name: "Fujifilm Superia", css: "hue-rotate(-10deg) saturate(1.2) contrast(1.05)" },
      { name: "Polaroid SX70", css: "sepia(.35) contrast(0.9) brightness(1.1) saturate(0.8)" },
      {
        name: "Cinestill 800T",
        css: "hue-rotate(-15deg) saturate(1.4) brightness(1.1) contrast(1.2)",
      },
    ],
  },
  {
    title: "Modern & Effects",
    serif: false,
    accent: "var(--secondary)",
    filters: [
      { name: "Vibrant", css: "saturate(1.5) contrast(1.1)" },
      { name: "Pastel", css: "saturate(.75) contrast(.95) brightness(1.15)" },
      { name: "Golden Hour", css: "sepia(.3) saturate(1.2) brightness(1.1) hue-rotate(-5deg)" },
      { name: "Cyberpunk", css: "saturate(1.4) contrast(1.3) hue-rotate(-30deg)" },
    ],
  },
];

const swatch = "linear-gradient(135deg, #D4A574 0%, #D97040 45%, #6BA89E 100%)";

export function FilterStrip() {
  const { selectedFilterName, setSelectedFilter, setSelectedFilterName } = useBooth();

  return (
    <div className="border-t border-border bg-border/30">
      <div className="space-y-4 px-4 py-4">
        {groups.map((group) => (
          <div key={group.title}>
            <p
              className="mb-2 text-[12px] text-muted-foreground"
              style={{
                fontFamily: group.serif ? "var(--font-serif)" : "var(--font-sans)",
                fontWeight: group.serif ? 500 : 600,
                letterSpacing: "0.3px",
              }}
            >
              {group.title}
            </p>
            <div className="scroll-x flex gap-3 pb-1">
              {group.filters.map((filter) => {
                const active = selectedFilterName === filter.name;
                return (
                  <button
                    key={filter.name}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(filter.css);
                      setSelectedFilterName(filter.name);
                    }}
                    className="shrink-0 rounded-[4px] bg-card p-1 transition-shadow"
                    style={{
                      width: 70,
                      border: active ? `2px solid ${group.accent}` : "1px solid var(--border)",
                      background: active ? "rgba(217,112,64,0.05)" : "var(--card)",
                    }}
                    aria-pressed={active}
                  >
                    <div
                      className="mx-auto rounded-[2px]"
                      style={{
                        width: 62,
                        height: 56,
                        background: swatch,
                        filter: filter.css,
                      }}
                    />
                    <p className="mt-1 truncate text-center text-[11px] text-muted-foreground">
                      {filter.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
