"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MoteurRechercheMotifsProps {
  selectedMotifs: string[];
  onMotifsChange: (motifs: string[]) => void;
  maxSelections?: number;
  placeholder?: string;
}

const MoteurRechercheMotifs = ({ 
  selectedMotifs, 
  onMotifsChange,
  maxSelections = 3,
  placeholder = "Recherchez un motif (ex: anxiété, scolaire, évaluation)..."
}: MoteurRechercheMotifsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Liste complète des motifs
  const allMotifs = [
    "Abus sexuel",
    "Accident de la route",
    "Accident de travail",
    "Accumulation compulsive",
    "Adaptation à l'école",
    "Addiction sexuelle et hypersexualité",
    "Addictions",
    "Adoption internationale",
    "Affirmation de soi",
    "Agoraphobie",
    "Alcoolisme / toxicomanies",
    "Aliénation mentale",
    "Anxiété",
    "Anxiété chez les personnes âgées",
    "Anxiété de performance",
    "Anxiété de séparation",
    "Anxiété liée à la santé",
    "Anxiété post-partum",
    "Approche humaniste",
    "Approche intégrative",
    "Approche TCC",
    "Arrêt de travail",
    "Asexualité et aromantisme",
    "Attachement chez les adultes",
    "Autosabotage",
    "Blessure morale",
    "Boulimie",
    "Burnout",
    "Changement organisationnel",
    "Changements sociaux",
    "Charge mentale",
    "Climat de travail",
    "Colère",
    "Communication",
    "Compétences parentales",
    "Conflits interpersonnels",
    "Curatelle publique",
    "Déficit de l'attention/hyperactivité",
    "Déficience intellectuelle",
    "Dépendance affective",
    "Dépendance aux jeux de hasard",
    "Dépendance aux jeux vidéo",
    "Dépression",
    "Deuil",
    "Difficultés académiques",
    "Difficultés à prendre des décisions",
    "Difficultés de concentration",
    "Difficultés masculines",
    "Diversité culturelle",
    "Douance",
    "Douleur chronique / fibromyalgie",
    "Dynamique organisationnelle",
    "Dysrégulation émotionnelle",
    "EMDR",
    "Épuisement professionnel",
    "Estime de soi",
    "Étape de la vie",
    "État dépressif",
    "Évaluation neuropsychologique",
    "Évaluation psychologique",
    "Évaluation psychologique milieu scolaire",
    "Exposition mentale",
    "Famille recomposée",
    "Fatigabilité",
    "Fatigue chronique",
    "Fertilité / Procréation assistée",
    "Fugue",
    "Garde d'enfants",
    "Gestion d'équipe",
    "Gestion de carrière",
    "Gestion de la colère",
    "Gestion de la colère ordonnée par le tribunal",
    "Gestion de la douleur chronique",
    "Gestion des émotions",
    "Gestion du stress",
    "Gestion du temps et organisation",
    "Grossesse et maternité",
    "Guerre / conflits armés (vétérans)",
    "Guerre / conflits armés (victimes)",
    "Habiletés de gestion",
    "Harcèlement au travail",
    "HPI-adulte",
    "Hypnose thérapeutique",
    "Identité de genre",
    "Identité de genre / LGBTQ+",
    "Immigration",
    "IMO",
    "Insomnie",
    "Intervention en milieu de travail",
    "Interventions/moyens TDAH",
    "Intérêts / Aptitudes au travail",
    "Intimidation",
    "Irritabilité",
    "Leadership",
    "Le mensonge",
    "Maladie dégénératives / sida",
    "Maladies physiques / handicaps",
    "Médiation en milieu de travail",
    "Médiation familiale",
    "Monoparentalité / famille recomposée",
    "Motivation",
    "Oncologie",
    "Orientation scolaire et professionnelle",
    "Orientation sexuelle",
    "Perfectionnisme",
    "Périnatalité",
    "Personnalité dépendante",
    "Peur d'avoir peur",
    "Peur de mourir",
    "Peur de vieillir",
    "Peur de vomir",
    "Phobie",
    "Pleine conscience",
    "Procrastination",
    "Proche aidant",
    "Problématiques propres aux agriculteurs",
    "Problématiques propres aux autochtones",
    "Problématiques propres aux réfugiés",
    "Problèmes de sommeil",
    "Problèmes professionnels",
    "Problèmes relationnels",
    "Psychodynamique",
    "Psychologie du sport",
    "Psychose",
    "Racisme, soutien à la discrimination",
    "Recherche de sens",
    "Relation de couple",
    "Relations amoureuses",
    "Relations au travail",
    "Relations familiales",
    "Relations interpersonnelles",
    "Retour progressif au travail",
    "Rôle de gestionnaire",
    "Santé psychologique au travail",
    "Sectes",
    "Sélection de personnel/réaffectation",
    "Séparation/divorce",
    "Situations de crise",
    "Soins palliatifs",
    "Soutien aux réfugiés et aux immigrants",
    "Spiritualité",
    "Stress financier",
    "Stress post-traumatique",
    "Survivre à la maltraitance",
    "Transexualité",
    "Traitement du jeu pathologique",
    "Traumatisme",
    "Trouble affectif saisonnier (TAS)",
    "Trouble de l'adaptation",
    "Trouble de la dépersonnalisation-déréalisation",
    "Troubles alimentaires",
    "Troubles anxieux",
    "Troubles d'apprentissages",
    "Troubles de l'attachement",
    "Troubles de l'humeur",
    "Troubles de la personnalité",
    "Troubles du comportement",
    "Troubles du langage",
    "Troubles du sommeil",
    "Troubles mentaux sévères",
    "Troubles neuropsychologiques",
    "Troubles obsessifs-compulsifs",
    "TSA",
    "TSA adulte évaluation",
    "TSA adulte intervention",
    "Vieillissement",
    "Violence (agresseurs)",
    "Violence (victimes)"
  ];

  // Filtrer les suggestions basées sur le terme de recherche
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = allMotifs
      .filter(motif => 
        motif.toLowerCase().includes(searchLower) && 
        !selectedMotifs.includes(motif)
      )
      .slice(0, 8);

    setSuggestions(filtered);
  }, [searchTerm, selectedMotifs]);

  const addMotif = (motif: string) => {
    if (selectedMotifs.length < maxSelections && !selectedMotifs.includes(motif)) {
      const newMotifs = [...selectedMotifs, motif].sort();
      onMotifsChange(newMotifs);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  const removeMotif = (motif: string) => {
    onMotifsChange(selectedMotifs.filter(m => m !== motif));
  };

  return (
    <div className="space-y-4">
      <Label>
        Motif(s) de consultation *
        <span className="text-xs text-muted-foreground ml-2">
          (Sélectionnez {maxSelections} motifs maximum - {selectedMotifs.length}/{maxSelections})
        </span>
      </Label>

      {/* Barre de recherche */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="pl-10"
            disabled={selectedMotifs.length >= maxSelections}
          />
        </div>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && searchTerm.length >= 2 && (
          <div className="absolute z-10 w-full mt-1 bg-card border border-border/40 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addMotif(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-accent/50 transition-colors text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Motifs sélectionnés */}
      {selectedMotifs.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedMotifs.map((motif) => (
            <div
              key={motif}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              <span>{motif}</span>
              <button
                type="button"
                onClick={() => removeMotif(motif)}
                className="hover:text-primary/70 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message d'information */}
      <p className="text-xs text-muted-foreground">
        Commencez à taper pour voir les suggestions. Vous pouvez sélectionner jusqu'à {maxSelections} motifs.
        Ces informations nous aideront à vous jumeler avec le professionnel le plus adapté.
      </p>
    </div>
  );
};

export default MoteurRechercheMotifs;