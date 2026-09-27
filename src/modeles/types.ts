/**
 * Fichier: types.ts
 * Description: Définit tous les types TypeScript métier de l'application.
 * Ces types modélisent les entités manipulées (utilisateur, véhicule, réservation)
 * et garantissent la cohérence des données échangées avec le backend.
 */

/**
 * Rôle d'un utilisateur dans le système multi-vendeurs.
 * - client : loue des véhicules
 * - loueur : possède des véhicules et valide les réservations
 */
export type RoleUtilisateur = 'client' | 'loueur';

/**
 * Représente un utilisateur enregistré (locataire ou propriétaire).
 */
export interface Utilisateur {
  identifiant: string;        // Identifiant unique (ObjectId MongoDB)
  nom: string;                // Nom de famille
  prenom: string;             // Prénom
  email: string;              // Adresse email (unique)
  telephone?: string;         // Numéro de téléphone (optionnel)
  role: RoleUtilisateur;      // Rôle dans l'application
  dateInscription: string;    // Date ISO de création du compte
  photoProfil?: string;       // URL de la photo de profil
  noteMoyenne?: number;       // Note moyenne (si propriétaire)
  nombreAvis?: number;        // Nombre d'avis reçus
}

/**
 * Catégorie de véhicule (citadine, berline, etc.).
 */
export type CategorieVehicule =
  | 'citadine'
  | 'berline'
  | 'suv'
  | 'utilitaire'
  | 'cabriolet'
  | 'premium';

/**
 * Type de carburant du véhicule.
 */
export type TypeCarburant = 'essence' | 'diesel' | 'hybride' | 'electrique';

/**
 * Type de transmission du véhicule.
 */
export type Transmission = 'manuelle' | 'automatique';

/**
 * Représente un véhicule proposé à la location par un propriétaire.
 */
export interface Vehicule {
  identifiant: string;            // Identifiant unique
  proprietaireId: string;         // Identifiant du propriétaire (loueur)
  marque: string;                 // Marque (ex: Peugeot)
  modele: string;                 // Modèle (ex: 308)
  annee: number;                  // Année de mise en circulation
  categorie: CategorieVehicule;   // Catégorie du véhicule
  carburant: TypeCarburant;       // Type de carburant
  transmission: Transmission;     // Type de transmission
  nombrePlaces: number;           // Nombre de places assises
  couleur: string;                // Couleur du véhicule
  kilometrage: number;            // Kilométrage actuel
  prixParJour: number;            // Prix de location par jour (€)
  caution: number;                // Montant de la caution (€)
  description: string;            // Description détaillée
  equipements: string[];          // Liste des équipements (GPS, clim, etc.)
  photos: string[];               // URLs des photos du véhicule
  ville: string;                  // Ville où se trouve le véhicule
  codePostal: string;             // Code postal
  disponible: boolean;            // Indique si le véhicule est réservable
  dateCreation: string;           // Date d'ajout du véhicule
}

/**
 * Statut possible d'une réservation dans son cycle de vie.
 */
export type StatutReservation =
  | 'en_attente'
  | 'validee'
  | 'refusee'
  | 'en_cours'
  | 'terminee'
  | 'annulee';

/**
 * Représente une demande de réservation d'un véhicule.
 * Le propriétaire (loueur) doit valider ou refuser la demande.
 */
export interface Reservation {
  identifiant: string;             // Identifiant unique
  vehiculeId: string;              // Identifiant du véhicule réservé
  clientId: string;                // Identifiant du client réservant
  loueurId: string;                // Identifiant du propriétaire du véhicule
  dateDebut: string;               // Date de début (ISO)
  dateFin: string;                 // Date de fin (ISO)
  nombreJours: number;             // Nombre de jours calculé
  prixTotal: number;               // Prix total de la location
  caution: number;                 // Caution demandée
  statut: StatutReservation;       // Statut actuel
  messageClient?: string;          // Message laissé par le client
  messageLoueur?: string;          // Réponse du propriétaire
  noteClient?: number;             // Note (1 à 5 étoiles) laissée par le client après location
  commentaireNote?: string;        // Commentaire associé à la note
  dateCreation: string;            // Date de la demande
  dateValidation?: string;         // Date de validation/refus par le loueur
  lieuPriseEnCharge: string;       // Adresse de prise en charge
}

/**
 * Données d'authentification renvoyées après connexion.
 */
export interface ReponseAuthentification {
  jeton: string;                   // Jeton d'authentification (JWT)
  utilisateur: Utilisateur;        // Profil utilisateur complet
}

/**
 * Données nécessaires à la création d'un compte.
 */
export interface DonneesInscription {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  role: RoleUtilisateur;
}

/**
 * Données de connexion utilisateur.
 */
export interface DonneesConnexion {
  email: string;
  motDePasse: string;
}

/**
 * Critères de filtrage pour la recherche de véhicules.
 */
export interface FiltresRecherche {
  recherche?: string;              // Texte libre (marque, modèle)
  categorie?: CategorieVehicule;
  prixMin?: number;
  prixMax?: number;
  ville?: string;
  dateDebut?: string;
  dateFin?: string;
}