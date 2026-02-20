import React, { useState, useRef, useEffect } from "react";
import { useStringSearch } from "@/hooks/useMotifSearch";
import { MOTIFS } from "@/data/motif";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MotifSearchProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxSelections?: number;
  multiSelect?: boolean;
}

/**
 * MotifSearch Component
 * A searchable dropdown for motifs with fuzzy search
 * Supports both single-select and multi-select (max 3) modes
 */
export const MotifSearch = React.forwardRef<HTMLDivElement, MotifSearchProps>(
  (
    {
      value = "",
      onChange,
      placeholder = "Tapez vos motifs ex: anxiété, burnout...",
      disabled = false,
      className,
      maxSelections = 3,
      multiSelect = false,
    },
    ref,
  ) => {
    const { query, setQuery, results, reset } = useStringSearch(MOTIFS);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Normalize value to array for multi-select
    const selectedMotifs = multiSelect
      ? (Array.isArray(value) ? value : value ? [value] : [])
      : [];

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectMotif = (motif: string) => {
      if (multiSelect) {
        // Multi-select mode
        if (selectedMotifs.includes(motif)) {
          // Remove if already selected
          const newValue = selectedMotifs.filter((m) => m !== motif);
          onChange(newValue);
        } else {
          // Add if not at max
          if (selectedMotifs.length < maxSelections) {
            const newValue = [...selectedMotifs, motif];
            onChange(newValue);
          }
        }
        setQuery("");
        // Keep dropdown open for multi-select
      } else {
        // Single-select mode
        onChange(motif);
        setQuery("");
        setIsOpen(false);
      }
    };

    const handleRemoveMotif = (motifToRemove?: string) => {
      if (multiSelect) {
        if (motifToRemove) {
          const newValue = selectedMotifs.filter((m) => m !== motifToRemove);
          onChange(newValue);
        } else {
          onChange([]);
        }
      } else {
        onChange("");
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setIsOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      } else if (e.key === "Enter" && results.length > 0) {
        // Select first result on Enter
        const firstResult = results[0];
        if (!multiSelect || !selectedMotifs.includes(firstResult)) {
          handleSelectMotif(firstResult);
        }
      }
    };

    const isSelected = multiSelect
      ? selectedMotifs.length > 0
      : !!value;
    const isAtMax = multiSelect && selectedMotifs.length >= maxSelections;

    return (
      <div ref={ref} className={cn("relative", className)}>
        <div
          ref={containerRef}
          className={cn(
            "min-h-[44px] rounded-lg border transition-colors",
            "flex flex-wrap items-center gap-2 p-2",
            disabled
              ? "bg-muted cursor-not-allowed border-muted-foreground/20"
              : "bg-white dark:bg-slate-950 border-input hover:border-input focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
          )}
        >
          {/* Selected Motifs Display */}
          {multiSelect
            ? selectedMotifs.map((motif) => (
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
                    aria-label={`Remove ${motif}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            : value && (
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-sm">
                  <span className="truncate">{value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMotif()}
                    disabled={disabled}
                    className="hover:text-primary/80 transition-colors flex-shrink-0"
                    aria-label={`Remove ${value}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

          {/* Search Input */}
          {!isAtMax && (
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              placeholder={
                isAtMax
                  ? `Maximum ${maxSelections} motifs sélectionnés`
                  : selectedMotifs.length > 0 && multiSelect
                    ? ""
                    : placeholder
              }
              disabled={disabled || isAtMax}
              className={cn(
                "flex-1 min-w-[100px] bg-transparent outline-none text-sm",
                "placeholder-muted-foreground",
                disabled || isAtMax
                  ? "text-muted-foreground cursor-not-allowed"
                  : "",
              )}
              aria-label="Search motifs"
              aria-expanded={isOpen}
              aria-controls="motif-dropdown"
              aria-autocomplete="list"
            />
          )}
          {isAtMax && (
            <span className="text-xs text-muted-foreground px-2">
              Maximum {maxSelections} motifs sélectionnés
            </span>
          )}

          {/* Dropdown Results */}
          {isOpen && !disabled && (
            <div
              id="motif-dropdown"
              className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-slate-950 border border-input rounded-lg shadow-lg max-h-[200px] overflow-y-auto w-full"
              role="listbox"
            >
              {results.length > 0 ? (
                results.map((motif) => {
                  const isSelected = multiSelect
                    ? selectedMotifs.includes(motif)
                    : value === motif;
                  const isDisabled =
                    multiSelect &&
                    !isSelected &&
                    selectedMotifs.length >= maxSelections;

                  return (
                    <button
                      key={motif}
                      type="button"
                      onClick={() => {
                        if (!isDisabled) {
                          handleSelectMotif(motif);
                        }
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      disabled={isDisabled}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                        isSelected &&
                          "bg-primary/10 text-primary font-medium",
                        isDisabled &&
                          "opacity-50 cursor-not-allowed hover:bg-transparent",
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span className="flex-1 truncate">{motif}</span>
                      {isSelected && (
                        <span className="text-primary text-xs">✓</span>
                      )}
                    </button>
                  );
                })
              ) : query.length > 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Aucun motif trouvé pour "{query}"
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Commencez à taper pour voir les suggestions
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

MotifSearch.displayName = "MotifSearch";
