/**
 * Fichier: formatage.ts
 * Description: Fournit des fonctions utilitaires pour formater et manipuler
 * les données affichées dans l'interface (dates, prix, durées).
 *
 * Devise utilisée : Franc CFA (FCFA), appliquée à l'ensemble de l'application
 * pour correspondre au contexte camerounais.
 */

/**
 * Formate un montant en francs CFA avec séparateurs de milliers.
 * Format camerounais standard (ex: "10 000 FCFA").
 * @param montant Le montant à formater.
 * @returns Une chaîne formatée (ex: "10 000 FCFA").
 */
export const formaterPrix = (montant: number): string => {
  const montantFormate = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(montant);
  return `${montantFormate} FCFA`;
};

/**
 * Formate une date ISO en format lisible français (ex: "15 juin 2026").
 * @param dateIso Chaîne de date au format ISO 8601.
 * @returns Date formatée en français.
 */
export const formaterDate = (dateIso: string): string => {
  try {
    const date = new Date(dateIso);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateIso;
  }
};

/**
 * Formate une date ISO en format court (ex: "15/06/2026").
 * @param dateIso Chaîne de date au format ISO 8601.
 * @returns Date au format JJ/MM/AAAA.
 */
export const formaterDateCourte = (dateIso: string): string => {
  try {
    const date = new Date(dateIso);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  } catch {
    return dateIso;
  }
};

/**
 * Calcule le nombre de jours entre deux dates ISO.
 * @param dateDebut Date de début au format ISO.
 * @param dateFin Date de fin au format ISO.
 * @returns Nombre de jours (entier, minimum 1).
 */
export const calculerNombreJours = (dateDebut: string, dateFin: string): number => {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  const differenceMs = fin.getTime() - debut.getTime();
  const jours = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  return Math.max(1, jours);
};

/**
 * Formate une durée en jours avec libellé français.
 * @param jours Nombre de jours.
 * @returns Libellé formaté (ex: "3 jours", "1 jour").
 */
export const formaterDuree = (jours: number): string => {
  if (jours <= 1) return '1 jour';
  return `${jours} jours`;
};

/**
 * Génère des initiales à partir d'un nom complet.
 * @param prenom Prénom de l'utilisateur.
 * @param nom Nom de famille.
 * @returns Initiales en majuscules (ex: "ML").
 */
export const genererInitiales = (prenom: string, nom: string): string => {
  const p = prenom ? prenom.charAt(0).toUpperCase() : '';
  const n = nom ? nom.charAt(0).toUpperCase() : '';
  return `${p}${n}`;
};

/**
 * Tronque un texte trop long et ajoute des points de suspension.
 * @param texte Le texte à tronquer.
 * @param longueurMax Longueur maximale souhaitée.
 * @returns Le texte tronqué.
 */
export const tronquerTexte = (texte: string, longueurMax: number): string => {
  if (!texte) return '';
  if (texte.length <= longueurMax) return texte;
  return `${texte.substring(0, longueurMax).trim()}…`;
};

/**
 * Calcule le prix total d'une location.
 * @param prixParJour Prix journalier du véhicule.
 * @param nombreJours Nombre de jours de location.
 * @returns Prix total calculé.
 */
export const calculerPrixTotal = (prixParJour: number, nombreJours: number): number => {
  return Math.round(prixParJour * nombreJours * 100) / 100;
};