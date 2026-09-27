/**
 * Fichier: stockageLocal.ts
 * Description: Service de persistance locale utilisant expo-secure-store.
 * Stocke de manière sécurisée le jeton d'authentification et le profil
 * utilisateur pour permettre la persistance de session entre les lancements.
 */
import * as SecureStore from 'expo-secure-store';
import { CLES_STOCKAGE } from '../constantes/configuration';

/**
 * Stocke une valeur dans le coffre sécurisé de l'appareil.
 * @param cle La clé d'identification de la valeur.
 * @param valeur La valeur à stocker (chaîne).
 */
export const stockerValeur = async (cle: string, valeur: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(cle, valeur);
  } catch (erreur) {
    console.error('Erreur lors du stockage sécurisé:', erreur);
  }
};

/**
 * Récupère une valeur depuis le coffre sécurisé.
 * @param cle La clé d'identification de la valeur.
 * @returns La valeur stockée ou null si absente.
 */
export const lireValeur = async (cle: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(cle);
  } catch {
    return null;
  }
};

/**
 * Supprime une valeur du coffre sécurisé.
 * @param cle La clé d'identification de la valeur à supprimer.
 */
export const supprimerValeur = async (cle: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(cle);
  } catch (erreur) {
    console.error('Erreur lors de la suppression:', erreur);
  }
};

/**
 * Sauvegarde le jeton d'authentification de manière sécurisée.
 * @param jeton Le jeton JWT renvoyé par le backend.
 */
export const sauvegarderJeton = (jeton: string): Promise<void> =>
  stockerValeur(CLES_STOCKAGE.jetonAuthentification, jeton);

/**
 * Récupère le jeton d'authentification s'il existe.
 */
export const lireJeton = (): Promise<string | null> =>
  lireValeur(CLES_STOCKAGE.jetonAuthentification);

/**
 * Supprime toutes les données de session (déconnexion).
 */
export const nettoyerSession = (): Promise<void[]> =>
  Promise.all([
    supprimerValeur(CLES_STOCKAGE.jetonAuthentification),
    supprimerValeur(CLES_STOCKAGE.identifiantUtilisateur),
    supprimerValeur(CLES_STOCKAGE.roleUtilisateur),
  ]);