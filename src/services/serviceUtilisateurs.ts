/**
 * Fichier: serviceUtilisateurs.ts
 * Description: Service métier pour la gestion des profils utilisateurs
 * (lecture publique, recherche de propriétaires, avis).
 */
import { Utilisateur } from '../modeles/types';
import { UTILISATEURS_MOCK } from './donneesMock';
import { appelerApi } from './serviceApi';
import { obtenirUtilisateursInscrits } from './stockageLocalAvance';

/**
 * Récupère le profil public d'un utilisateur par son identifiant.
 * @param identifiant L'identifiant unique de l'utilisateur.
 * @returns Le profil ou null s'il n'existe pas.
 */
export const obtenirUtilisateur = async (
  identifiant: string
): Promise<Utilisateur | null> => {
  const reponseApi = await appelerApi<Utilisateur>(`/utilisateurs/${identifiant}`);
  if (reponseApi) return reponseApi;
  const utilisateursInscrits = await obtenirUtilisateursInscrits();
  const trouveInscrit = utilisateursInscrits.find((u) => u.identifiant === identifiant);
  if (trouveInscrit) return trouveInscrit;
  return UTILISATEURS_MOCK.find((u) => u.identifiant === identifiant) || null;
};

/**
 * Récupère le profil d'un propriétaire de véhicules.
 * @param proprietaireId L'identifiant du propriétaire.
 * @returns Le profil du propriétaire ou null.
 */
export const obtenirProprietaire = async (
  proprietaireId: string
): Promise<Utilisateur | null> => {
  return obtenirUtilisateur(proprietaireId);
};