/**
 * Fichier: couleurs.ts
 * Description: Définit la charte graphique complète de l'application AutoPartage.
 * Centralise toutes les couleurs utilisées dans l'interface pour garantir
 * une cohérence visuelle sur l'ensemble des écrans.
 */

// Palette principale - Couleurs de marque
export const CouleursPrimaires = {
  bleuProfond: '#1E3A8A',      // Couleur principale (navigation, boutons primaires)
  bleuMoyen: '#2563EB',         // Bleu d'accent secondaire
  bleuClair: '#3B82F6',         // Bleu interactif (liens, états actifs)
  orangeVif: '#F97316',         // Couleur d'accent (CTA, badges promotionnels)
  orangeDoux: '#FB923C',        // Variante claire de l'orange
};

// Couleurs sémantiques - Retours d'état
export const CouleursSemantiques = {
  succes: '#10B981',            // Validation, confirmation
  succesDoux: '#D1FAE5',        // Fond des états de succès
  erreur: '#EF4444',            // Erreurs, suppressions
  erreurDouce: '#FEE2E2',       // Fond des états d'erreur
  avertissement: '#F59E0B',     // Avertissements, états en attente
  avertissementDoux: '#FEF3C7', // Fond des états d'attente
  information: '#3B82F6',       // Messages d'information
  informationDouce: '#DBEAFE',  // Fond des informations
};

// Couleurs neutres - Textes et fonds
export const CouleursNeutres = {
  blancPur: '#FFFFFF',
  gris50: '#F9FAFB',
  gris100: '#F3F4F6',
  gris200: '#E5E7EB',
  gris300: '#D1D5DB',
  gris400: '#9CA3AF',
  gris500: '#6B7280',
  gris600: '#4B5563',
  gris700: '#374151',
  gris800: '#1F2937',
  gris900: '#111827',
  noirPur: '#000000',
};

// Ombres standardisées pour la profondeur des cartes
export const Ombres = {
  petite: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  moyenne: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  grande: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};

// Rayons de bordure standardisés
export const Rayons = {
  petit: 6,
  moyen: 12,
  grand: 16,
  extraGrand: 24,
  circulaire: 999,
};

// Espacements standardisés (grille de 4px)
export const Espacements = {
  aucun: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  enormes: 40,
};