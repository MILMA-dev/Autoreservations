/**
 * Fichier: serviceVehicules.ts
 * Description: Service métier pour la gestion des véhicules (CRUD).
 * Permet de lister, filtrer, créer, modifier et supprimer des véhicules.
 * Bascule automatiquement sur les données mock si le backend n'est pas
 * accessible.
 */
import { Vehicule, FiltresRecherche } from '../modeles/types';
import { VEHICULES_MOCK } from './donneesMock';
import { appelerApi } from './serviceApi';

/**
 * Récupère la liste des véhicules selon des filtres optionnels.
 * @param filtres Critères de filtrage de la recherche.
 * @returns La liste des véhicules correspondants.
 */
export const listerVehicules = async (
  filtres: FiltresRecherche = {}
): Promise<Vehicule[]> => {
  // Tentative d'appel au backend Python Eve
  const params = new URLSearchParams();
  if (filtres.recherche) params.append('q', filtres.recherche);
  if (filtres.categorie) params.append('categorie', filtres.categorie);
  if (filtres.ville) params.append('ville', filtres.ville);
  if (filtres.prixMin) params.append('prix_min', String(filtres.prixMin));
  if (filtres.prixMax) params.append('prix_max', String(filtres.prixMax));

  const reponseApi = await appelerApi<{
    _items: Vehicule[];
  }>(`/vehicules?${params.toString()}`);

  if (reponseApi && reponseApi._items) {
    return reponseApi._items;
  }

  // Mode local : filtrage sur les données mock
  let resultats = [...VEHICULES_MOCK];
  if (filtres.recherche) {
    const r = filtres.recherche.toLowerCase();
    resultats = resultats.filter(
      (v) =>
        v.marque.toLowerCase().includes(r) ||
        v.modele.toLowerCase().includes(r) ||
        v.ville.toLowerCase().includes(r)
    );
  }
  if (filtres.categorie) {
    resultats = resultats.filter((v) => v.categorie === filtres.categorie);
  }
  if (filtres.ville) {
    resultats = resultats.filter((v) =>
      v.ville.toLowerCase().includes(filtres.ville!.toLowerCase())
    );
  }
  if (filtres.prixMin !== undefined) {
    resultats = resultats.filter((v) => v.prixParJour >= filtres.prixMin!);
  }
  if (filtres.prixMax !== undefined) {
    resultats = resultats.filter((v) => v.prixParJour <= filtres.prixMax!);
  }
  return resultats.filter((v) => v.disponible);
};

/**
 * Récupère un véhicule par son identifiant.
 * @param identifiant L'identifiant unique du véhicule.
 * @returns Le véhicule correspondant ou null.
 */
export const obtenirVehicule = async (
  identifiant: string
): Promise<Vehicule | null> => {
  const reponseApi = await appelerApi<Vehicule>(`/vehicules/${identifiant}`);
  if (reponseApi) return reponseApi;
  return VEHICULES_MOCK.find((v) => v.identifiant === identifiant) || null;
};

/**
 * Récupère tous les véhicules appartenant à un propriétaire donné.
 * @param proprietaireId L'identifiant du propriétaire.
 * @returns La liste de ses véhicules.
 */
export const listerVehiculesDuLoueur = async (
  proprietaireId: string
): Promise<Vehicule[]> => {
  const reponseApi = await appelerApi<{ _items: Vehicule[] }>(
    `/vehicules?where=proprietaire_id=="${proprietaireId}"`
  );
  if (reponseApi && reponseApi._items) return reponseApi._items;
  return VEHICULES_MOCK.filter((v) => v.proprietaireId === proprietaireId);
};

/**
 * Crée un nouveau véhicule dans le catalogue.
 * @param vehicule Les données du véhicule à créer.
 * @returns Le véhicule créé avec son identifiant.
 */
export const creerVehicule = async (
  vehicule: Omit<Vehicule, 'identifiant' | 'dateCreation'>
): Promise<Vehicule> => {
  const reponseApi = await appelerApi<Vehicule>('/vehicules', {
    methode: 'POST',
    corps: vehicule,
  });
  if (reponseApi) return reponseApi;
  const nouveau: Vehicule = {
    ...vehicule,
    identifiant: `vehicule_${Date.now()}`,
    dateCreation: new Date().toISOString(),
  };
  VEHICULES_MOCK.push(nouveau);
  return nouveau;
};

/**
 * Supprime un véhicule du catalogue.
 * @param identifiant L'identifiant du véhicule à supprimer.
 */
export const supprimerVehicule = async (identifiant: string): Promise<void> => {
  await appelerApi(`/vehicules/${identifiant}`, { methode: 'DELETE' });
  const index = VEHICULES_MOCK.findIndex((v) => v.identifiant === identifiant);
  if (index >= 0) VEHICULES_MOCK.splice(index, 1);
};