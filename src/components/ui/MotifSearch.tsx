import React, { useState, useRef, useEffect } from "react";
import { useStringSearch } from "@/hooks/useMotifSearch";
import { MOTIFS } from "@/data/motif";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MotifSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * MotifSearch Component
 * A searchable, single-select dropdown for motifs with fuzzy search
 */
export const MotifSearch = React.forwardRef<HTMLDivElement, MotifSearchProps>(
  (
    {
      value = "",
      onChange,
      placeholder = "Tapez vos motifs ex: anxiété, burnout...",
      disabled = false,
      className,
    },
    ref,
  ) => {
    const { query, setQuery, results, reset } = useStringSearch(MOTIFS);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
      onChange(motif);
      setQuery("");
      setIsOpen(false);
    };

    const handleRemoveMotif = () => {
      onChange("");
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
        handleSelectMotif(results[0]);
      }
    };

    const isSelected = !!value;

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
          {/* Selected Motif Display */}
          {value && (
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
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={value ? "" : placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-[100px] bg-transparent outline-none text-sm",
              "placeholder-muted-foreground",
              disabled ? "text-muted-foreground cursor-not-allowed" : "",
            )}
            aria-label="Search motifs"
            aria-expanded={isOpen}
            aria-controls="motif-dropdown"
            aria-autocomplete="list"
          />

          {/* Dropdown Results */}
          {isOpen && !disabled && (
            <div
              id="motif-dropdown"
              className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-slate-950 border border-input rounded-lg shadow-lg max-h-[200px] overflow-y-auto w-full"
              role="listbox"
            >
              {results.length > 0 ? (
                results.map((motif) => (
                  <button
                    key={motif}
                    type="button"
                    onClick={() => {
                      handleSelectMotif(motif);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      value === motif &&
                        "bg-primary/10 text-primary font-medium",
                    )}
                    role="option"
                    aria-selected={value === motif}
                  >
                    <span className="flex-1 truncate">{motif}</span>
                  </button>
                ))
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
