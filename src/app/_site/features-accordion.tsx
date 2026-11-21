"use client";

import { useState } from "react";
import {
  MessageSquare,
  FileText,
  ListChecks,
  Code2,
  Sparkles,
  Users,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  f1: MessageSquare,
  f2: FileText,
  f3: ListChecks,
  f4: Code2,
  f5: Sparkles,
  f6: Users,
};

type Item = { key: string; title: string; short: string; long: string };

/**
 * Griglia di funzionalita' a fisarmonica: ogni card e' cliccabile e si espande
 * col dettaglio. Client component (solo lo stato di apertura); riceve i testi
 * gia' localizzati dal server (LandingPage) e mappa l'icona dalla key.
 */
export function FeaturesAccordion({
  items,
  moreLabel,
}: {
  items: Item[];
  moreLabel: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mt-6 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => {
        const Icon = ICONS[it.key] ?? MessageSquare;
        const isOpen = open === it.key;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => setOpen(isOpen ? null : it.key)}
            aria-expanded={isOpen}
            className="cursor-pointer rounded-xl border border-card-foreground/10 bg-card p-6 text-left text-card-foreground transition hover:border-card-foreground/25 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-4 font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.short}</p>
            {isOpen ? (
              <p className="mt-3 border-t border-card-foreground/10 pt-3 text-sm leading-relaxed text-card-foreground/80">
                {it.long}
              </p>
            ) : (
              <span className="mt-3 inline-block text-xs font-medium text-gold">{moreLabel}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
