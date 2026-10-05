import { useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FLOORS, TOP_FLOOR, type Floor } from "./floors";

type Lift = { floor: number; direction: "up" | "down" };

// The store directory: a felt letterboard listing the floors, with an elevator indicator
// and a shop-window preview that follow whichever floor is hovered or focused.
// Fully static, so it renders the same whether or not the API is reachable.
export function DirectoryBoard() {
  const [lift, setLift] = useState<Lift>({
    floor: TOP_FLOOR,
    direction: "up",
  });
  const active = FLOORS.find((f) => f.floor === lift.floor);

  const callLift = (floor: number) =>
    setLift((current) =>
      current.floor === floor
        ? current
        : { floor, direction: floor > current.floor ? "up" : "down" },
    );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <nav
        aria-label="Store directory"
        className="rounded-2xl felt-grooves p-5 text-letter shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06),inset_0_2px_12px_rgb(0_0_0/0.45),0_0_0_6px_#2a1426,0_18px_40px_-18px_rgb(42_20_38/0.6)] sm:p-8"
      >
        <div className="flex items-center justify-between gap-4 border-b border-letter/15 pb-3 font-display text-sm font-semibold tracking-[0.3em] text-letter/70 uppercase sm:text-base">
          <span>FakeStore · Directory</span>
          {/* Small screens: the indicator rides in the board's title row. */}
          <FloorIndicator lift={lift} className="lg:hidden" compact />
        </div>
        <ul className="mt-2">
          {FLOORS.toReversed().map((floor, i) => (
            <li key={floor.floor}>
              <FloorRow
                floor={floor}
                isActive={floor.floor === lift.floor}
                onEnter={() => callLift(floor.floor)}
                style={{ animationDelay: `${120 + i * 70}ms` }}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div
        aria-hidden="true"
        className="hidden gap-4 lg:grid lg:grid-rows-[auto_1fr]"
      >
        <FloorIndicator lift={lift} />
        {active && <ShopWindow floor={active} />}
      </div>
    </div>
  );
}

type FloorRowProps = {
  floor: Floor;
  isActive: boolean;
  onEnter: () => void;
  style: CSSProperties;
};

function FloorRow({ floor, isActive, onEnter, style }: FloorRowProps) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(floor.category)}`}
      onPointerEnter={onEnter}
      onFocus={onEnter}
      aria-label={`Floor ${floor.floor}, ${floor.label}: ${floor.blurb}`}
      className="group flex items-baseline gap-3 rounded-md px-1 py-2 font-display font-bold tracking-[0.04em] uppercase outline-none [text-shadow:0_1px_0_rgb(0_0_0/0.45)] focus-visible:ring-3 focus-visible:ring-letter/60 sm:gap-5 sm:py-3"
    >
      <span
        style={style}
        className={cn(
          "w-[1.5ch] shrink-0 text-3xl tabular-nums transition-colors motion-safe:animate-press-in sm:text-5xl",
          isActive ? "text-brass" : "text-letter/45",
        )}
      >
        {floor.floor}
      </span>
      <span
        style={style}
        className={cn(
          "text-3xl transition-colors motion-safe:animate-press-in sm:text-5xl",
          isActive ? "text-letter" : "text-letter/80 group-hover:text-letter",
        )}
      >
        {floor.label}
      </span>
      {/* Dot leader, as on a printed directory. */}
      <span
        aria-hidden="true"
        className="mb-1.5 hidden min-w-6 flex-1 border-b-2 border-dotted border-letter/25 sm:block"
      />
      <span
        style={style}
        className="ml-auto hidden text-right text-lg font-semibold tracking-[0.08em] text-letter/60 motion-safe:animate-press-in sm:block md:text-2xl"
      >
        {floor.blurb}
      </span>
    </Link>
  );
}

function FloorIndicator({
  lift,
  className,
  compact = false,
}: {
  lift: Lift;
  className?: string;
  compact?: boolean;
}) {
  const Arrow = lift.direction === "up" ? ArrowUpIcon : ArrowDownIcon;
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#1f0f1b] font-display font-extrabold text-brass shadow-[inset_0_2px_10px_rgb(0_0_0/0.6),0_0_0_1px_rgb(184_145_58/0.35)] [text-shadow:0_0_14px_rgb(184_145_58/0.55)]",
        compact ? "h-9 px-3 text-2xl tracking-normal" : "h-32 gap-4 text-8xl",
        className,
      )}
    >
      <Arrow
        className={cn("shrink-0", compact ? "size-4" : "size-10")}
        strokeWidth={2.5}
      />
      {/* key: a new floor remounts the digit, which replays the roll. */}
      <span
        key={lift.floor}
        style={
          {
            "--roll-from": lift.direction === "up" ? "60%" : "-60%",
          } as CSSProperties
        }
        className="tabular-nums motion-safe:animate-digit-roll"
      >
        {lift.floor}
      </span>
    </div>
  );
}

function ShopWindow({ floor }: { floor: Floor }) {
  const { Icon } = floor;
  return (
    <div className="flex flex-col justify-between rounded-xl bg-window p-5">
      <p className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
        Floor {floor.floor}
      </p>
      <Icon className="mx-auto my-4 size-24 text-brass" strokeWidth={1.1} />
      <div>
        <p className="font-display text-3xl font-bold tracking-[0.04em] uppercase">
          {floor.label}
        </p>
        <p className="text-sm text-muted-foreground">{floor.blurb}</p>
      </div>
    </div>
  );
}
