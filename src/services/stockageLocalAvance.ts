/**
 * Fichier: stockageLocalAvance.ts
 * Description: Service de persistance locale avancé utilisant AsyncStorage.
 * Permet de stocker les nouveaux comptes utilisateurs inscrits, les véhicules
 * ajoutés par les propriétaires et les photos téléversées, pour assurer
 * la persistance des données même en mode déconnecté.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Utilisateur, Vehicule } from '../modeles/types';
import { CLES_STOCKAGE } from '../constantes/configuration';

/**
 * Récupère la liste complète des utilisateurs inscrits localement.
 * @returns Liste des utilisateurs (vide si aucune inscription).
 */
export const obtenirUtilisateursInscrits = async (): Promise<Utilisateur[]> => {
  try {
    const donnees = await AsyncStorage.getItem(CLES_STOCKAGE.utilisateursInscrits);
    if (!donnees) return [];
    return JSON.parse(donnees) as Utilisateur[];
  } catch (erreur) {
    console.warn('Erreur lors de la lecture des utilisateurs inscrits:', erreur);
    return [];
  }
};

/**
 * Sauvegarde la liste complète des utilisateurs inscrits.
 * @param utilisateurs La liste à persister.
 */
export const sauvegarderUtilisateursInscrits = async (
  utilisateurs: Utilisateur[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      CLES_STOCKAGE.utilisateursInscrits,
      JSON.stringify(utilisateurs)
    );
  } catch (erreur) {
    console.warn('Erreur lors de la sauvegarde des utilisateurs:', erreur);
  }
};

/**
 * Ajoute un nouvel utilisateur à la liste persistée et le retourne.
 * @param utilisateur L'utilisateur à ajouter.
 * @returns L'utilisateur enregistré.
 */
export const ajouterUtilisateurInscrit = async (
  utilisateur: Utilisateur
): Promise<Utilisateur> => {
  const liste = await obtenirUtilisateursInscrits();
  // Vérification d'unicité par email
  const existe = liste.find((u) => u.email.toLowerCase() === utilisateur.email.toLowerCase());
  if (existe) {
    throw new Error('Un compte existe déjà avec cette adresse email.');
  }
  const nouvelleListe = [...liste, utilisateur];
  await sauvegarderUtilisateursInscrits(nouvelleListe);
  return utilisateur;
};

/**
 * Recherche un utilisateur par email dans la liste persistée.
 * @param email L'email à rechercher.
 * @returns L'utilisateur trouvé ou null.
 */
export const trouverUtilisateurParEmail = async (
  email: string
): Promise<Utilisateur | null> => {
  const liste = await obtenirUtilisateursInscrits();
  return (
    liste.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  );
};

/**
 * Récupère la liste des véhicules ajoutés localement par les propriétaires.
 * @returns Liste des véhicules ajoutés.
 */
export const obtenirVehiculesAjoutes = async (): Promise<Vehicule[]> => {
  try {
    const donnees = await AsyncStorage.getItem(CLES_STOCKAGE.vehiculesAjoutes);
    if (!donnees) return [];
    return JSON.parse(donnees) as Vehicule[];
  } catch {
    return [];
  }
};

/**
 * Sauvegarde la liste des véhicules ajoutés localement.
 * @param vehicules La liste à persister.
 */
export const sauvegarderVehiculesAjoutes = async (
  vehicules: Vehicule[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      CLES_STOCKAGE.vehiculesAjoutes,
      JSON.stringify(vehicules)
    );
  } catch (erreur) {
    console.warn('Erreur lors de la sauvegarde des véhicules:', erreur);
  }
};

/**
 * Enregistre l'URI d'une photo téléversée par le propriétaire.
 * @param identifiantVehicule L'identifiant du véhicule concerné.
 * @param uriPhoto L'URI locale de la photo.
 */
export const ajouterPhotoVehicule = async (
  identifiantVehicule: string,
  uriPhoto: string
): Promise<void> => {
  try {
    const cle = `${CLES_STOCKAGE.photosVehicules}_${identifiantVehicule}`;
    const donnees = await AsyncStorage.getItem(cle);
    const liste: string[] = donnees ? JSON.parse(donnees) : [];
    if (!liste.includes(uriPhoto)) {
      liste.push(uriPhoto);
      await AsyncStorage.setItem(cle, JSON.stringify(liste));
    }
  } catch (erreur) {
    console.warn('Erreur lors de l\'enregistrement de la photo:', erreur);
  }
};

/**
 * Récupère les URIs des photos enregistrées pour un véhicule donné.
 * @param identifiantVehicule L'identifiant du véhicule.
 * @returns Liste des URIs des photos.
 */
export const obtenirPhotosVehicule = async (
  identifiantVehicule: string
): Promise<string[]> => {
  try {
    const cle = `${CLES_STOCKAGE.photosVehicules}_${identifiantVehicule}`;
    const donnees = await AsyncStorage.getItem(cle);
    return donnees ? (JSON.parse(donnees) as string[]) : [];
  } catch {
    return [];
  }
};

/**
 * Vérifie si des identifiants correspondent à un compte persistant.
 * @param email L'email fourni.
 * @param motDePasse Le mot de passe fourni.
 * @returns L'utilisateur trouvé ou null.
 */
export const verifierIdentifiants = async (
  email: string,
  motDePasse: string
): Promise<Utilisateur | null> => {
  // Comparaison sur la liste des inscrits réels (avec mot de passe encodé)
  const cle = 'comptes_avec_mdp_autopartage';
  try {
    const donnees = await AsyncStorage.getItem(cle);
    if (!donnees) return null;
    const comptes = JSON.parse(donnees) as Array<{
      email: string;
      motDePasse: string;
      identifiant: string;
    }>;
    const compte = comptes.find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );
    if (!compte || compte.motDePasse !== motDePasse) return null;
    // Récupération du profil complet
    const liste = await obtenirUtilisateursInscrits();
    return liste.find((u) => u.identifiant === compte.identifiant) || null;
  } catch {
    return null;
  }
};

/**
 * Enregistre un nouveau compte avec son mot de passe pour authentification future.
 * @param email L'email du compte.
 * @param motDePasse Le mot de passe en clair (stockage local uniquement).
 * @param identifiant L'identifiant utilisateur.
 */
export const enregistrerCompteAvecMotDePasse = async (
  email: string,
  motDePasse: string,
  identifiant: string
): Promise<void> => {
  const cle = 'comptes_avec_mdp_autopartage';
  try {
    const donnees = await AsyncStorage.getItem(cle);
    const comptes: Array<{ email: string; motDePasse: string; identifiant: string }> =
      donnees ? JSON.parse(donnees) : [];
    comptes.push({ email: email.toLowerCase(), motDePasse, identifiant });
    await AsyncStorage.setItem(cle, JSON.stringify(comptes));
  } catch (erreur) {
    console.warn('Erreur lors de l\'enregistrement du compte:', erreur);
  }
};