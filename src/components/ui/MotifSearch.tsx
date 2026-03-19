import React, { useState, useRef, useEffect } from "react";
import { useStringSearch } from "@/hooks/useMotifSearch";
import { MOTIFS } from "@/data/motif";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MotifSearchProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  /** Libellé du bouton (ex. "Rechercher") */
  searchButtonLabel?: string;
  disabled?: boolean;
  className?: string;
  maxSelections?: number;
  multiSelect?: boolean;
  /** Custom list of items to search through. Defaults to MOTIFS. */
  items?: string[];
}

/**
 * MotifSearch Component
 * Petit moteur de recherche pour les motifs : champ de recherche avec icône,
 * résultats affichés en liste sous la barre (pas une liste déroulante).
 * Recherche floue (fuzzy), single ou multi-sélection (max 3).
 */
export const MotifSearch = React.forwardRef<HTMLDivElement, MotifSearchProps>(
  (
    {
      value = "",
      onChange,
      placeholder = "Rechercher un motif (ex. anxiété, burnout…)",
      searchButtonLabel = "Rechercher",
      disabled = false,
      className,
      maxSelections = 3,
      multiSelect = false,
      items: customItems,
    },
    ref,
  ) => {
    const searchItems = customItems ?? MOTIFS;
    const { query, setQuery, results } = useStringSearch(searchItems);
    const [isOpen, setIsOpen] = useState(false);
    /** La recherche (affichage des résultats) ne se fait qu'après clic sur le bouton */
    const [searchTriggered, setSearchTriggered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedMotifs = multiSelect
      ? (Array.isArray(value) ? value : value ? [value] : [])
      : [];

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTriggered(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectMotif = (motif: string) => {
      if (multiSelect) {
        if (selectedMotifs.includes(motif)) {
          onChange(selectedMotifs.filter((m) => m !== motif));
        } else if (selectedMotifs.length < maxSelections) {
          onChange([...selectedMotifs, motif]);
        }
        setQuery("");
      } else {
        onChange(motif);
        setQuery("");
        setIsOpen(false);
      }
    };

    const handleRemoveMotif = (motifToRemove?: string) => {
      if (multiSelect) {
        onChange(
          motifToRemove
            ? selectedMotifs.filter((m) => m !== motifToRemove)
            : [],
        );
      } else {
        onChange("");
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchTriggered(false);
        setQuery("");
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results.length > 0) {
          const first = results[0];
          if (!multiSelect || !selectedMotifs.includes(first)) {
            handleSelectMotif(first);
          }
        } else {
          handleSearchClick();
        }
      }
    };

    const handleSearchClick = () => {
      if (disabled || isAtMax) return;
      setSearchTriggered(true);
      setIsOpen(true);
      inputRef.current?.focus();
    };

    const isAtMax = multiSelect && selectedMotifs.length >= maxSelections;

    return (
      <div ref={ref} className={cn("relative", className)}>
        {/* Bloc "moteur de recherche" : au focus il se détache visuellement des autres champs */}
        <div
          ref={containerRef}
          className={cn(
            "rounded-xl transition-all duration-200",
            "border",
            isOpen && !disabled && !isAtMax
              ? "border-primary/50 bg-primary/[0.04] dark:bg-primary/10 shadow-md ring-2 ring-primary/20"
              : "border-input bg-background",
            disabled || isAtMax ? "opacity-90" : "",
          )}
        >
          {/* Motifs sélectionnés (chips) */}
          {(multiSelect ? selectedMotifs.length > 0 : value) && (
            <div className="flex flex-wrap gap-2 px-3 pt-3">
              {multiSelect ? (
                selectedMotifs.map((motif) => (
                  <div
                    key={motif}
                    className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-sm"
                  >
                    <span className="truncate">{motif}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMotif(motif)}
                      disabled={disabled}
                      className="hover:text-primary/80 transition-colors flex-shrink-0"
                      aria-label={`Retirer ${motif}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-sm">
                  <span className="truncate">{value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMotif()}
                    disabled={disabled}
                    className="hover:text-primary/80 transition-colors flex-shrink-0"
                    aria-label={`Retirer ${value}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Barre de recherche + bouton Rechercher */}
          <div
            className={cn(
              "flex items-center gap-2 mx-3 mb-0 rounded-lg border bg-background transition-colors",
              isOpen && !disabled && !isAtMax
                ? "border-primary/40 shadow-sm"
                : "border-input",
              disabled || isAtMax
                ? "bg-muted cursor-not-allowed border-muted-foreground/20 my-3"
                : "my-3",
            )}
          >
            <Search
              className={cn(
                "h-4 w-4 flex-shrink-0 text-muted-foreground ml-3",
                isOpen && !disabled && !isAtMax && "text-primary/80",
                (disabled || isAtMax) && "opacity-60",
              )}
              aria-hidden
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              placeholder={
                isAtMax
                  ? `Maximum ${maxSelections} motifs sélectionnés`
                  : placeholder
              }
              disabled={disabled || isAtMax}
              className={cn(
                "flex-1 min-w-0 py-2.5 pr-2 bg-transparent outline-none text-sm",
                "placeholder:text-muted-foreground",
                (disabled || isAtMax) &&
                  "text-muted-foreground cursor-not-allowed",
              )}
              aria-label="Rechercher un motif"
              aria-expanded={isOpen}
              aria-controls="motif-search-results"
              aria-autocomplete="list"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleSearchClick}
              disabled={disabled || isAtMax}
              className="mr-2 h-8 shrink-0 gap-1.5 px-3 text-xs font-medium"
              aria-label={searchButtonLabel}
            >
              <Search className="h-3.5 w-3.5" />
              {searchButtonLabel}
            </Button>
          </div>

          {/* Zone résultats : panneau de suggestions (pas une liste déroulante) */}
          {isOpen && !disabled && searchTriggered && query.trim().length > 0 && (
            <section
              id="motif-search-results"
              className="mx-3 mb-3 rounded-lg border border-border/70 bg-muted/20 p-3"
              aria-label="Suggestions de motifs"
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Suggestions
              </p>
              {results.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {results.map((motif) => {
                    const selected = multiSelect
                      ? selectedMotifs.includes(motif)
                      : value === motif;
                    const isDisabled =
                      multiSelect &&
                      !selected &&
                      selectedMotifs.length >= maxSelections;

                    return (
                      <button
                        key={motif}
                        type="button"
                        onClick={() => !isDisabled && handleSelectMotif(motif)}
                        onMouseDown={(e) => e.preventDefault()}
                        disabled={isDisabled}
                        className={cn(
                          "rounded-md border px-3 py-2 text-left text-sm transition-all",
                          "hover:-translate-y-[1px] hover:shadow-sm",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                          selected
                            ? "border-primary/40 bg-primary/10 text-primary font-medium"
                            : "border-border bg-background hover:border-primary/30",
                          isDisabled &&
                            "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none",
                        )}
                        aria-pressed={selected}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{motif}</span>
                          {selected && (
                            <span className="text-primary text-xs">Selectionne</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Aucun motif trouve pour « {query} »
                </p>
              )}
            </section>
          )}

          {isAtMax && (
            <p className="px-3 pb-3 text-xs text-muted-foreground">
              Maximum {maxSelections} motifs sélectionnés
            </p>
          )}
        </div>
      </div>
    );
  },
);

MotifSearch.displayName = "MotifSearch";
