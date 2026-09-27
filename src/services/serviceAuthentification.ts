/**
 * Fichier: serviceAuthentification.ts
 * Description: Service métier pour l'authentification des utilisateurs.
 * Gère la connexion, l'inscription et la déconnexion. Compatible avec
 * l'API Python Eve (authentification basique HTTP) et bascule en mode
 * local (persistant) si le backend n'est pas disponible.
 *
 * Les nouveaux comptes inscrits sont persistés localement via
 * AsyncStorage pour permettre aux utilisateurs créés via l'application
 * de se reconnecter ultérieurement.
 */
import {
  DonneesConnexion,
  DonneesInscription,
  ReponseAuthentification,
  RoleUtilisateur,
  Utilisateur,
} from '../modeles/types';
import { UTILISATEURS_MOCK } from './donneesMock';
import {
  nettoyerSession,
  sauvegarderJeton,
  stockerValeur,
} from './stockageLocal';
import { CLES_STOCKAGE } from '../constantes/configuration';
import { appelerApi } from './serviceApi';
import {
  ajouterUtilisateurInscrit,
  trouverUtilisateurParEmail,
  verifierIdentifiants,
  enregistrerCompteAvecMotDePasse,
} from './stockageLocalAvance';

/**
 * Authentifie un utilisateur.
 * @param donnees Les identifiants de connexion.
 * @returns La réponse d'authentification (jeton + profil).
 */
export const seConnecter = async (
  donnees: DonneesConnexion
): Promise<ReponseAuthentification> => {
  // Tentative d'appel au backend Python Eve (authentification basique)
  const reponseApi = await appelerApi<ReponseAuthentification>('/utilisateurs/connexion', {
    methode: 'POST',
    corps: donnees,
  });

  if (reponseApi) {
    await sauvegarderJeton(reponseApi.jeton);
    await stockerValeur(
      CLES_STOCKAGE.identifiantUtilisateur,
      reponseApi.utilisateur.identifiant
    );
    await stockerValeur(
      CLES_STOCKAGE.roleUtilisateur,
      reponseApi.utilisateur.role
    );
    return reponseApi;
  }

  // Mode local : vérification contre les comptes persistés
  // 1) Cherche d'abord parmi les comptes réellement inscrits via l'app
  const comptePersistant = await verifierIdentifiants(
    donnees.email,
    donnees.motDePasse
  );
  if (comptePersistant) {
    const jetonDemo = encoderEnBase64(`${comptePersistant.email}:${donnees.motDePasse}`);
    await sauvegarderJeton(jetonDemo);
    await stockerValeur(CLES_STOCKAGE.identifiantUtilisateur, comptePersistant.identifiant);
    await stockerValeur(CLES_STOCKAGE.roleUtilisateur, comptePersistant.role);
    return { jeton: jetonDemo, utilisateur: comptePersistant };
  }

  // 2) Sinon, vérifie contre la base de démonstration
  const utilisateurTrouve = UTILISATEURS_MOCK.find(
    (u) => u.email.toLowerCase() === donnees.email.toLowerCase()
  );
  if (!utilisateurTrouve) {
    throw new Error('Adresse email introuvable.');
  }
  // En mode démo, le mot de passe "demo1234" est accepté pour les comptes de démo
  if (donnees.motDePasse !== 'demo1234') {
    throw new Error('Mot de passe incorrect.');
  }

  const jetonDemo = encoderEnBase64(`${utilisateurTrouve.email}:demo1234`);
  await sauvegarderJeton(jetonDemo);
  await stockerValeur(CLES_STOCKAGE.identifiantUtilisateur, utilisateurTrouve.identifiant);
  await stockerValeur(CLES_STOCKAGE.roleUtilisateur, utilisateurTrouve.role);

  return { jeton: jetonDemo, utilisateur: utilisateurTrouve };
};

/**
 * Inscrit un nouvel utilisateur.
 * @param donnees Les informations d'inscription.
 * @returns La réponse d'authentification (connexion automatique après inscription).
 */
export const sinscrire = async (
  donnees: DonneesInscription
): Promise<ReponseAuthentification> => {
  // Tentative d'appel au backend Python Eve
  const reponseApi = await appelerApi<ReponseAuthentification>('/utilisateurs', {
    methode: 'POST',
    corps: donnees,
  });

  if (reponseApi) {
    await sauvegarderJeton(reponseApi.jeton);
    await stockerValeur(
      CLES_STOCKAGE.identifiantUtilisateur,
      reponseApi.utilisateur.identifiant
    );
    await stockerValeur(
      CLES_STOCKAGE.roleUtilisateur,
      reponseApi.utilisateur.role
    );
    return reponseApi;
  }

  // Mode local : création du profil et persistance pour permettre
  // la reconnexion ultérieure du nouvel utilisateur.
  const nouvelUtilisateur: Utilisateur = {
    identifiant: `utilisateur_${Date.now()}`,
    nom: donnees.nom,
    prenom: donnees.prenom,
    email: donnees.email.toLowerCase(),
    telephone: donnees.telephone,
    role: donnees.role,
    dateInscription: new Date().toISOString(),
  };

  // Persistance du profil utilisateur
  await ajouterUtilisateurInscrit(nouvelUtilisateur);
  // Persistance des identifiants (email + mot de passe) pour reconnexion
  await enregistrerCompteAvecMotDePasse(
    nouvelUtilisateur.email,
    donnees.motDePasse,
    nouvelUtilisateur.identifiant
  );
  // Ajout également à la base mock en mémoire pour cette session
  UTILISATEURS_MOCK.push(nouvelUtilisateur);

  const jetonDemo = encoderEnBase64(`${nouvelUtilisateur.email}:${donnees.motDePasse}`);
  await sauvegarderJeton(jetonDemo);
  await stockerValeur(CLES_STOCKAGE.identifiantUtilisateur, nouvelUtilisateur.identifiant);
  await stockerValeur(CLES_STOCKAGE.roleUtilisateur, donnees.role);

  return { jeton: jetonDemo, utilisateur: nouvelUtilisateur };
};

/**
 * Encode une chaîne en base64 (compatible React Native sans dépendance Node).
 * Utilise btoa si disponible (web) ou une implémentation manuelle sinon.
 * @param valeur La chaîne à encoder.
 * @returns La valeur encodée en base64.
 */
const encoderEnBase64 = (valeur: string): string => {
  // Tentative avec btoa (disponible dans les navigateurs web)
  try {
    if (typeof btoa !== 'undefined') {
      return btoa(unescape(encodeURIComponent(valeur)));
    }
  } catch {
    // Fallback manuel
  }
  // Implémentation manuelle base64
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let resultat = '';
  let i = 0;
  const entree = unescape(encodeURIComponent(valeur));
  while (i < entree.length) {
    const a = entree.charCodeAt(i++);
    const b = i < entree.length ? entree.charCodeAt(i++) : NaN;
    const c = i < entree.length ? entree.charCodeAt(i++) : NaN;
    const e1 = a >> 2;
    const e2 = ((a & 3) << 4) | (isNaN(b) ? 0 : b >> 4);
    const e3 = isNaN(b) ? 64 : (((b & 15) << 2) | (isNaN(c) ? 0 : c >> 6));
    const e4 = isNaN(c) ? 64 : c & 63;
    resultat += caracteres.charAt(e1) + caracteres.charAt(e2) +
      (e3 === 64 ? '=' : caracteres.charAt(e3)) +
      (e4 === 64 ? '=' : caracteres.charAt(e4));
  }
  return resultat;
};

/**
 * Déconnecte l'utilisateur en supprimant toutes les données de session.
 */
export const seDeconnecter = async (): Promise<void> => {
  await appelerApi('/utilisateurs/deconnexion', { methode: 'POST' });
  await nettoyerSession();
};

/**
 * Met à jour le rôle de l'utilisateur (pour la démonstration).
 * @param nouveauRole Le nouveau rôle.
 */
export const changerRole = async (nouveauRole: RoleUtilisateur): Promise<void> => {
  await stockerValeur(CLES_STOCKAGE.roleUtilisateur, nouveauRole);
};