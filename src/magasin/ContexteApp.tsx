/**
 * Fichier: ContexteApp.tsx
 * Description: Définit le contexte React global de l'application et le
 * provider associé. Centralise l'état partagé entre tous les composants :
 * authentification, profil utilisateur courant, véhicules et réservations.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DonneesConnexion,
  DonneesInscription,
  Reservation,
  RoleUtilisateur,
  Utilisateur,
  Vehicule,
} from '../modeles/types';
import {
  changerRole,
  seConnecter,
  seDeconnecter,
  sinscrire,
} from '../services/serviceAuthentification';
import {
  listerReservationsClient,
  listerReservationsLoueur,
  validerReservation,
  refuserReservation,
  creerReservation,
  annulerReservation,
  noterReservation,
} from '../services/serviceReservations';
import {
  listerVehicules,
  listerVehiculesDuLoueur,
  creerVehicule,
  supprimerVehicule,
} from '../services/serviceVehicules';
import { lireJeton } from '../services/stockageLocal';
import { CLES_STOCKAGE } from '../constantes/configuration';
import { lireValeur } from '../services/stockageLocal';

/**
 * Forme de l'état et des actions exposés par le contexte.
 */
interface ValeurContexte {
  // Authentification
  utilisateurConnecte: Utilisateur | null;
  role: RoleUtilisateur | null;
  estAuthentifie: boolean;
  chargementInitial: boolean;
  // Actions d'authentification
  seConnecter: (donnees: DonneesConnexion) => Promise<void>;
  sinscrire: (donnees: DonneesInscription) => Promise<void>;
  seDeconnecter: () => Promise<void>;
  basculerRole: (nouveauRole: RoleUtilisateur) => Promise<void>;
  // Véhicules
  vehicules: Vehicule[];
  chargerVehicules: () => Promise<void>;
  rechercherVehicules: (terme: string) => Promise<void>;
  // Loueur
  mesVehicules: Vehicule[];
  chargerMesVehicules: () => Promise<void>;
  ajouterVehicule: (vehicule: Omit<Vehicule, 'identifiant' | 'dateCreation'>) => Promise<Vehicule>;
  supprimerVehicule: (identifiant: string) => Promise<void>;
  // Réservations
  mesReservations: Reservation[];
  reservationsAValider: Reservation[];
  chargerReservations: () => Promise<void>;
  creerReservation: (reservation: Omit<Reservation, 'identifiant' | 'statut' | 'dateCreation'>) => Promise<Reservation>;
  validerReservation: (identifiant: string, message?: string) => Promise<void>;
  refuserReservation: (identifiant: string, message: string) => Promise<void>;
  annulerReservation: (identifiant: string) => Promise<void>;
  noterReservation: (identifiant: string, note: number, commentaire?: string) => Promise<void>;
}

const ContexteApp = createContext<ValeurContexte | undefined>(undefined);

/**
 * Hook personnalisé pour accéder au contexte de l'application.
 * @returns La valeur du contexte.
 */
export const utiliserContexteApp = (): ValeurContexte => {
  const contexte = useContext(ContexteApp);
  if (!contexte) {
    throw new Error(
      'utiliserContexteApp doit être utilisé à l\'intérieur d\'un FournisseurContexteApp'
    );
  }
  return contexte;
};

/**
 * Composant Provider qui fournit l'état global à toute l'application.
 */
export const FournisseurContexteApp: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  // État d'authentification
  const [utilisateurConnecte, setUtilisateurConnecte] = useState<Utilisateur | null>(null);
  const [role, setRole] = useState<RoleUtilisateur | null>(null);
  const [chargementInitial, setChargementInitial] = useState<boolean>(true);

  // État des véhicules
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [mesVehicules, setMesVehicules] = useState<Vehicule[]>([]);

  // État des réservations
  const [mesReservations, setMesReservations] = useState<Reservation[]>([]);
  const [reservationsAValider, setReservationsAValider] = useState<Reservation[]>([]);

  /**
   * Tente de restaurer la session au démarrage de l'application.
   */
  useEffect(() => {
    const restaurerSession = async () => {
      try {
        const jeton = await lireJeton();
        const roleStocke = await lireValeur(CLES_STOCKAGE.roleUtilisateur);
        if (jeton && roleStocke) {
          setRole(roleStocke as RoleUtilisateur);
          // En mode démo, on reconstruit un profil minimal depuis le token
          setUtilisateurConnecte({
            identifiant: 'session_restauree',
            nom: 'Utilisateur',
            prenom: 'Connecté',
            email: 'session@autopartage.fr',
            role: roleStocke as RoleUtilisateur,
            dateInscription: new Date().toISOString(),
          });
        }
      } finally {
        setChargementInitial(false);
      }
    };
    restaurerSession();
  }, []);

  // ========== Actions d'authentification ==========

  const gererConnexion = useCallback(async (donnees: DonneesConnexion) => {
    const reponse = await seConnecter(donnees);
    setUtilisateurConnecte(reponse.utilisateur);
    setRole(reponse.utilisateur.role);
  }, []);

  const gererInscription = useCallback(async (donnees: DonneesInscription) => {
    const reponse = await sinscrire(donnees);
    setUtilisateurConnecte(reponse.utilisateur);
    setRole(reponse.utilisateur.role);
  }, []);

  const gererDeconnexion = useCallback(async () => {
    await seDeconnecter();
    setUtilisateurConnecte(null);
    setRole(null);
    setVehicules([]);
    setMesVehicules([]);
    setMesReservations([]);
    setReservationsAValider([]);
  }, []);

  const gererChangementRole = useCallback(async (nouveauRole: RoleUtilisateur) => {
    await changerRole(nouveauRole);
    setRole(nouveauRole);
    if (utilisateurConnecte) {
      setUtilisateurConnecte({ ...utilisateurConnecte, role: nouveauRole });
    }
  }, [utilisateurConnecte]);

  // ========== Actions sur les véhicules ==========

  const chargerVehicules = useCallback(async () => {
    const liste = await listerVehicules();
    setVehicules(liste);
  }, []);

  const rechercherVehicules = useCallback(async (terme: string) => {
    const resultats = await listerVehicules({ recherche: terme });
    setVehicules(resultats);
  }, []);

  const chargerMesVehicules = useCallback(async () => {
    if (!utilisateurConnecte) return;
    const liste = await listerVehiculesDuLoueur(utilisateurConnecte.identifiant);
    setMesVehicules(liste);
  }, [utilisateurConnecte]);

  const ajouterVehicule = useCallback(
    async (vehicule: Omit<Vehicule, 'identifiant' | 'dateCreation'>) => {
      const nouveau = await creerVehicule(vehicule);
      setMesVehicules((precedent) => [...precedent, nouveau]);
      return nouveau;
    },
    []
  );

  const supprimerUnVehicule = useCallback(async (identifiant: string) => {
    await supprimerVehicule(identifiant);
    setMesVehicules((precedent) => precedent.filter((v) => v.identifiant !== identifiant));
  }, []);

  // ========== Actions sur les réservations ==========

  const chargerReservations = useCallback(async () => {
    if (!utilisateurConnecte) return;
    const [reservationsClient, reservationsLoueur] = await Promise.all([
      listerReservationsClient(utilisateurConnecte.identifiant),
      listerReservationsLoueur(utilisateurConnecte.identifiant),
    ]);
    setMesReservations(reservationsClient);
    // Le loueur ne voit que les réservations à valider si son rôle est loueur
    if (role === 'loueur') {
      setReservationsAValider(
        reservationsLoueur.filter((r) => r.statut === 'en_attente')
      );
    } else {
      setReservationsAValider([]);
    }
  }, [utilisateurConnecte, role]);

  const creerUneReservation = useCallback(
    async (
      reservation: Omit<Reservation, 'identifiant' | 'statut' | 'dateCreation'>
    ) => {
      const nouvelle = await creerReservation(reservation);
      setMesReservations((precedent) => [nouvelle, ...precedent]);
      return nouvelle;
    },
    []
  );

  const validerUneReservation = useCallback(
    async (identifiant: string, message?: string) => {
      const miseAJour = await validerReservation(identifiant, message);
      if (miseAJour) {
        setReservationsAValider((precedent) =>
          precedent.filter((r) => r.identifiant !== identifiant)
        );
        setMesReservations((precedent) =>
          precedent.map((r) => (r.identifiant === identifiant ? miseAJour : r))
        );
      }
    },
    []
  );

  const refuserUneReservation = useCallback(
    async (identifiant: string, message: string) => {
      const miseAJour = await refuserReservation(identifiant, message);
      if (miseAJour) {
        setReservationsAValider((precedent) =>
          precedent.filter((r) => r.identifiant !== identifiant)
        );
        setMesReservations((precedent) =>
          precedent.map((r) => (r.identifiant === identifiant ? miseAJour : r))
        );
      }
    },
    []
  );

  const annulerUneReservation = useCallback(async (identifiant: string) => {
    await annulerReservation(identifiant);
    setMesReservations((precedent) =>
      precedent.map((r) =>
        r.identifiant === identifiant ? { ...r, statut: 'annulee' as any } : r
      )
    );
  }, []);

  const noterUneReservation = useCallback(
    async (identifiant: string, note: number, commentaire?: string) => {
      const miseAJour = await noterReservation(identifiant, note, commentaire);
      if (miseAJour) {
        setMesReservations((precedent) =>
          precedent.map((r) => (r.identifiant === identifiant ? miseAJour : r))
        );
      }
    },
    []
  );

  // ========== Valeur mémoïsée du contexte ==========

  const valeur = useMemo<ValeurContexte>(
    () => ({
      utilisateurConnecte,
      role,
      estAuthentifie: !!utilisateurConnecte,
      chargementInitial,
      seConnecter: gererConnexion,
      sinscrire: gererInscription,
      seDeconnecter: gererDeconnexion,
      basculerRole: gererChangementRole,
      vehicules,
      chargerVehicules,
      rechercherVehicules,
      mesVehicules,
      chargerMesVehicules,
      ajouterVehicule,
      supprimerVehicule: supprimerUnVehicule,
      mesReservations,
      reservationsAValider,
      chargerReservations,
      creerReservation: creerUneReservation,
      validerReservation: validerUneReservation,
      refuserReservation: refuserUneReservation,
      annulerReservation: annulerUneReservation,
      noterReservation: noterUneReservation,
    }),
    [
      utilisateurConnecte,
      role,
      chargementInitial,
      gererConnexion,
      gererInscription,
      gererDeconnexion,
      gererChangementRole,
      vehicules,
      chargerVehicules,
      rechercherVehicules,
      mesVehicules,
      chargerMesVehicules,
      ajouterVehicule,
      supprimerUnVehicule,
      mesReservations,
      reservationsAValider,
      chargerReservations,
      creerUneReservation,
      validerUneReservation,
      refuserUneReservation,
      annulerUneReservation,
      noterUneReservation,
    ]
  );

  return <ContexteApp.Provider value={valeur}>{children}</ContexteApp.Provider>;
};