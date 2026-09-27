/**
 * Fichier: typographie.ts
 * Description: Définit les styles typographiques cohérents pour toute l'application.
 * Garantit une hiérarchie visuelle claire et une lisibilité optimale.
 */
import { TextStyle } from 'react-native';

/**
 * Échelle typographique normalisée.
 * Chaque taille a une utilisation définie dans l'interface.
 */
export const Typographie: Record<string, TextStyle> = {
  // Titres principaux - Écrans d'accueil, en-têtes
  titrePrincipal: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  titreSection: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  titreCarte: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  sousTitre: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Corps de texte
  corpsGrand: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  corps: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  corpsPetit: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },

  // Étiquettes et libellés
  etiquette: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  legende: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // Boutons
  texteBouton: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
};