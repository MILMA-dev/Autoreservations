/**
 * Fichier: serviceReservations.ts
 * Description: Service métier pour la gestion du cycle de vie des réservations.
 * Implémente le workflow complet : demande du client, validation ou refus
 * par le propriétaire, suivi et annulation.
 */
import { Reservation, StatutReservation } from '../modeles/types';
import { RESERVATIONS_MOCK } from './donneesMock';
import { appelerApi } from './serviceApi';

/**
 * Crée une nouvelle demande de réservation.
 * @param reservation Les données de la réservation à créer.
 * @returns La réservation créée avec son identifiant et statut "en_attente".
 */
export const creerReservation = async (
  reservation: Omit<Reservation, 'identifiant' | 'statut' | 'dateCreation'>
): Promise<Reservation> => {
  const complete = {
    ...reservation,
    statut: 'en_attente' as StatutReservation,
    dateCreation: new Date().toISOString(),
  };

  const reponseApi = await appelerApi<Reservation>('/reservations', {
    methode: 'POST',
    corps: complete,
  });
  if (reponseApi) return reponseApi;

  const nouvelle: Reservation = {
    ...complete,
    identifiant: `reservation_${Date.now()}`,
  };
  RESERVATIONS_MOCK.push(nouvelle);
  return nouvelle;
};

/**
 * Liste les réservations d'un client (en tant que locataire).
 * @param clientId L'identifiant du client.
 * @returns La liste de ses réservations.
 */
export const listerReservationsClient = async (
  clientId: string
): Promise<Reservation[]> => {
  const reponseApi = await appelerApi<{ _items: Reservation[] }>(
    `/reservations?where=client_id=="${clientId}"`
  );
  if (reponseApi && reponseApi._items) return reponseApi._items;
  return RESERVATIONS_MOCK.filter((r) => r.clientId === clientId).sort(
    (a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
  );
};

/**
 * Liste les réservations concernant les véhicules d'un loueur.
 * Le propriétaire voit toutes les demandes pour ses véhicules.
 * @param loueurId L'identifiant du loueur.
 * @returns La liste des réservations à traiter ou à suivre.
 */
export const listerReservationsLoueur = async (
  loueurId: string
): Promise<Reservation[]> => {
  const reponseApi = await appelerApi<{ _items: Reservation[] }>(
    `/reservations?where=loueur_id=="${loueurId}"`
  );
  if (reponseApi && reponseApi._items) return reponseApi._items;
  return RESERVATIONS_MOCK.filter((r) => r.loueurId === loueurId).sort(
    (a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
  );
};

/**
 * Valide une réservation en attente (action du propriétaire).
 * @param identifiant L'identifiant de la réservation.
 * @param messageLoueur Message optionnel du propriétaire.
 * @returns La réservation mise à jour.
 */
export const validerReservation = async (
  identifiant: string,
  messageLoueur?: string
): Promise<Reservation | null> => {
  const reponseApi = await appelerApi<Reservation>(`/reservations/${identifiant}`, {
    methode: 'PATCH',
    corps: {
      statut: 'validee',
      message_loueur: messageLoueur,
      date_validation: new Date().toISOString(),
    },
  });
  if (reponseApi) return reponseApi;

  const reservation = RESERVATIONS_MOCK.find((r) => r.identifiant === identifiant);
  if (!reservation) return null;
  reservation.statut = 'validee';
  reservation.messageLoueur = messageLoueur;
  reservation.dateValidation = new Date().toISOString();
  return reservation;
};

/**
 * Refuse une réservation en attente (action du propriétaire).
 * @param identifiant L'identifiant de la réservation.
 * @param messageLoueur Raison du refus.
 * @returns La réservation mise à jour.
 */
export const refuserReservation = async (
  identifiant: string,
  messageLoueur: string
): Promise<Reservation | null> => {
  const reponseApi = await appelerApi<Reservation>(`/reservations/${identifiant}`, {
    methode: 'PATCH',
    corps: {
      statut: 'refusee',
      message_loueur: messageLoueur,
      date_validation: new Date().toISOString(),
    },
  });
  if (reponseApi) return reponseApi;

  const reservation = RESERVATIONS_MOCK.find((r) => r.identifiant === identifiant);
  if (!reservation) return null;
  reservation.statut = 'refusee';
  reservation.messageLoueur = messageLoueur;
  reservation.dateValidation = new Date().toISOString();
  return reservation;
};

/**
 * Annule une réservation par le client ou le propriétaire.
 * @param identifiant L'identifiant de la réservation.
 */
export const annulerReservation = async (identifiant: string): Promise<void> => {
  await appelerApi(`/reservations/${identifiant}`, {
    methode: 'PATCH',
    corps: { statut: 'annulee' },
  });

  const reservation = RESERVATIONS_MOCK.find((r) => r.identifiant === identifiant);
  if (reservation) reservation.statut = 'annulee';
};

/**
 * Permet à un client de noter un véhicule et son propriétaire après une
 * location terminée. Note de 1 à 5 étoiles.
 * @param identifiant L'identifiant de la réservation.
 * @param note La note entre 1 et 5.
 * @param commentaire Commentaire optionnel.
 */
export const noterReservation = async (
  identifiant: string,
  note: number,
  commentaire?: string
): Promise<Reservation | null> => {
  if (note < 1 || note > 5) {
    throw new Error('La note doit être comprise entre 1 et 5 étoiles.');
  }

  const reponseApi = await appelerApi<Reservation>(`/reservations/${identifiant}`, {
    methode: 'PATCH',
    corps: { note_client: note, commentaire_note: commentaire },
  });
  if (reponseApi) return reponseApi;

  const reservation = RESERVATIONS_MOCK.find((r) => r.identifiant === identifiant);
  if (!reservation) return null;
  reservation.noteClient = note;
  reservation.commentaireNote = commentaire;
  return reservation;
};