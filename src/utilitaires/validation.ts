/**
 * Fichier: validation.ts
 * Description: Centralise les fonctions de validation des données saisies
 * par l'utilisateur (emails, mots de passe, dates, etc.).
 */

/**
 * Valide un format d'adresse email.
 * @param email L'email à valider.
 * @returns true si l'email est valide, false sinon.
 */
export const validerEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

/**
 * Vérifie qu'un mot de passe respecte les exigences minimales de sécurité.
 * @param motDePasse Le mot de passe à vérifier.
 * @returns Un message d'erreur ou une chaîne vide si valide.
 */
export const validerMotDePasse = (motDePasse: string): string => {
  if (!motDePasse) return 'Le mot de passe est obligatoire.';
  if (motDePasse.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères.';
  }
  if (!/[A-Z]/.test(motDePasse)) {
    return 'Le mot de passe doit contenir au moins une majuscule.';
  }
  if (!/[0-9]/.test(motDePasse)) {
    return 'Le mot de passe doit contenir au moins un chiffre.';
  }
  return '';
};

/**
 * Vérifie qu'un numéro de téléphone français est valide (10 chiffres).
 * @param telephone Le numéro à valider.
 * @returns true si le numéro est valide.
 */
export const validerTelephone = (telephone: string): boolean => {
  const nettoye = telephone.replace(/\s/g, '');
  return /^0[1-9][0-9]{8}$/.test(nettoye);
};

/**
 * Vérifie qu'une chaîne n'est pas vide.
 * @param valeur La chaîne à vérifier.
 * @param nomChamp Libellé du champ pour le message d'erreur.
 * @returns Message d'erreur ou chaîne vide.
 */
export const validerChampObligatoire = (valeur: string, nomChamp: string): string => {
  if (!valeur || valeur.trim().length === 0) {
    return `Le champ "${nomChamp}" est obligatoire.`;
  }
  return '';
};

/**
 * Valide qu'une date de fin est postérieure à une date de début.
 * @param dateDebut Date de début ISO.
 * @param dateFin Date de fin ISO.
 * @returns Message d'erreur ou chaîne vide.
 */
export const validerPlageDates = (dateDebut: string, dateFin: string): string => {
  if (!dateDebut || !dateFin) return 'Veuillez sélectionner les deux dates.';
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  if (fin <= debut) {
    return 'La date de fin doit être postérieure à la date de début.';
  }
  return '';
};