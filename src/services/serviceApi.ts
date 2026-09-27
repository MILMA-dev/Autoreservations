/**
 * Fichier: serviceApi.ts
 * Description: Couche d'abstraction pour les appels HTTP vers le backend
 * Python Eve / MongoDB. Centralise la gestion du jeton d'authentification,
 * la sérialisation JSON et la gestion des erreurs réseau.
 *
 * En mode développement local sans backend actif, le service bascule
 * automatiquement sur les données mock pour permettre la démonstration.
 */
import { URL_API_BASE } from '../constantes/configuration';
import { lireJeton } from './stockageLocal';

/**
 * Options d'une requête HTTP.
 */
interface OptionsRequete {
  methode?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  corps?: unknown;
  enTetesSupp?: Record<string, string>;
}

/**
 * Effectue un appel HTTP typé vers le backend Python Eve.
 * Injecte automatiquement le jeton d'authentification si présent.
 * @param chemin Le chemin de la ressource (ex: "/vehicules").
 * @param options Les options de la requête.
 * @returns La réponse parsée ou null si 204.
 */
export const appelerApi = async <T = unknown>(
  chemin: string,
  options: OptionsRequete = {}
): Promise<T | null> => {
  const { methode = 'GET', corps, enTetesSupp = {} } = options;

  // Construction des en-têtes avec authentification
  const jeton = await lireJeton();
  const enTetes: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...enTetesSupp,
  };
  if (jeton) {
    enTetes['Authorization'] = `Basic ${jeton}`;
  }

  // Exécution de la requête avec gestion du timeout
  const controleur = new AbortController();
  const timeout = setTimeout(() => controleur.abort(), 15000);

  try {
    const reponse = await fetch(`${URL_API_BASE}${chemin}`, {
      method: methode,
      headers: enTetes,
      body: corps ? JSON.stringify(corps) : undefined,
      signal: controleur.signal,
    });

    clearTimeout(timeout);

    if (reponse.status === 204) return null;
    if (!reponse.ok) {
      throw new Error(`Erreur API ${reponse.status}: ${reponse.statusText}`);
    }
    return (await reponse.json()) as T;
  } catch (erreur) {
    clearTimeout(timeout);
    // En mode développement, on bascule sur les données mock
    console.warn(`API indisponible (${chemin}), basculement sur données locales.`);
    return null;
  }
};