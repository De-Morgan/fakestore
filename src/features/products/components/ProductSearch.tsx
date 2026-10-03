import { useEffect, useEffectEvent, useId, useState } from "react";
import { useSearchParams } from "react-router";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { updateParams } from "../searchParams";

export function ProductSearch({ q }: { q: string }) {
  const [, setSearchParams] = useSearchParams();
  const id = useId();
  // The input owns every keystroke. The URL only hears about it once typing pauses.
  const [text, setText] = useState(q);
  const debounced = useDebouncedValue(text.trim(), 300);

  // The URL changed without us (Back, or a nav link to /products): show its value instead.
  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    if (q !== debounced) setText(q);
  }

  // An effect event reads the latest `q` without depending on it. Only a settled value
  // triggers a write, so pressing Back never writes the old text back into the URL.
  const writeQuery = useEffectEvent((value: string) => {
    if (value === q) return;
    setSearchParams((prev) => updateParams(prev, "q", value || null), {
      replace: true, // refining a search shouldn't add Back-button entries
    });
  });
  useEffect(() => writeQuery(debounced), [debounced]);

  return (
    <div className="grid w-full gap-1.5 sm:w-auto">
      <Label htmlFor={id}>Search</Label>
      <div className="relative">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id={id}
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search products"
          autoComplete="off"
          className="w-full pl-8 sm:w-56"
        />
      </div>
    </div>
  );
}
