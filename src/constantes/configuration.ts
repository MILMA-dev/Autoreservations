/**
 * Fichier: configuration.ts
 * Description: Centralise les constantes de configuration de l'application.
 * Définit notamment l'URL de base du backend Python Eve / MongoDB.
 */

/**
 * URL de base de l'API backend Python Eve.
 * En développement local : utiliser l'IP de la machine hôte (10.0.2.2 pour émulateur Android).
 * En production : URL du serveur déployé.
 */
export const URL_API_BASE = 'http://10.0.2.2:5000';

/**
 * Clés de stockage sécurisé utilisées avec expo-secure-store.
 */
export const CLES_STOCKAGE = {
  jetonAuthentification: 'jeton_autopartage',
  identifiantUtilisateur: 'id_utilisateur_autopartage',
  roleUtilisateur: 'role_utilisateur_autopartage',
  /**
   * Clé de stockage de la liste locale des comptes inscrits.
   * Permet la persistance des nouveaux utilisateurs entre les sessions.
   */
  utilisateursInscrits: 'utilisateurs_inscrits_autopartage',
  /**
   * Clé de stockage des photos téléversées par les propriétaires.
   * Stockage local des URI des photos ajoutées par les utilisateurs.
   */
  photosVehicules: 'photos_vehicules_autopartage',
  /**
   * Clé de stockage des véhicules ajoutés localement par les propriétaires.
   */
  vehiculesAjoutes: 'vehicules_ajoutes_autopartage',
};

/**
 * Durée par défaut d'une location (jours).
 */
export const DUREE_LOCATION_PAR_DEFAUT = 3;

/**
 * Nombre maximum de jours réservables à l'avance.
 */
export const JOURS_AVANCE_MAX = 90;

/**
 * Rayon de recherche par défaut en kilomètres.
 */
export const RAYON_RECHERCHE_PAR_DEFAUT = 25;

/**
 * Catégories de véhicules disponibles dans l'application.
 */
export const CATEGORIES_VEHICULES = [
  { identifiant: 'citadine', libelle: 'Citadine', icone: 'car-sport-outline' },
  { identifiant: 'berline', libelle: 'Berline', icone: 'car-outline' },
  { identifiant: 'suv', libelle: 'SUV', icone: 'car-sport-outline' },
  { identifiant: 'utilitaire', libelle: 'Utilitaire', icone: 'bus-outline' },
  { identifiant: 'cabriolet', libelle: 'Cabriolet', icone: 'car-outline' },
  { identifiant: 'premium', libelle: 'Premium', icone: 'car-sport-outline' },
] as const;

/**
 * Types de carburant acceptés.
 */
export const TYPES_CARBURANT = [
  { identifiant: 'essence', libelle: 'Essence' },
  { identifiant: 'diesel', libelle: 'Diesel' },
  { identifiant: 'hybride', libelle: 'Hybride' },
  { identifiant: 'electrique', libelle: 'Électrique' },
] as const;

/**
 * Types de transmission acceptés.
 */
export const TYPES_TRANSMISSION = [
  { identifiant: 'manuelle', libelle: 'Manuelle' },
  { identifiant: 'automatique', libelle: 'Automatique' },
] as const;

/**
 * Étiquettes des statuts de réservation (cycle de validation).
 */
export const STATUTS_RESERVATION: Record<
  'en_attente' | 'validee' | 'refusee' | 'en_cours' | 'terminee' | 'annulee',
  { identifiant: string; libelle: string; couleur: string }
> = {
  en_attente: { identifiant: 'en_attente', libelle: 'En attente', couleur: '#F59E0B' },
  validee: { identifiant: 'validee', libelle: 'Validée', couleur: '#10B981' },
  refusee: { identifiant: 'refusee', libelle: 'Refusée', couleur: '#EF4444' },
  en_cours: { identifiant: 'en_cours', libelle: 'En cours', couleur: '#3B82F6' },
  terminee: { identifiant: 'terminee', libelle: 'Terminée', couleur: '#6B7280' },
  annulee: { identifiant: 'annulee', libelle: 'Annulée', couleur: '#9CA3AF' },
};

/**
 * Rôles utilisateur disponibles dans l'application.
 */
export const ROLES_UTILISATEUR = {
  client: { identifiant: 'client', libelle: 'Locataire' },
  loueur: { identifiant: 'loueur', libelle: 'Propriétaire' },
} as const;