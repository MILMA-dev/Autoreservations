/**
 * Fichier: CarteReservation.tsx
 * Description: Carte affichant les informations d'une réservation (locataire
 * ou loueur). Affiche le statut, les dates, le véhicule et le prix total.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CouleursNeutres, Espacements, Ombres, Rayons } from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';
import { Reservation, Vehicule } from '../modeles/types';
import { formaterDateCourte, formaterPrix, formaterDuree } from '../utilitaires/formatage';
import IndicateurStatut from './IndicateurStatut';

interface PropsCarteReservation {
  reservation: Reservation;
  vehicule?: Vehicule;
  nomInterlocuteur?: string;
  onPress?: () => void;
  afficherActions?: boolean;
  messageActions?: React.ReactNode;
}

const CarteReservation: React.FC<PropsCarteReservation> = ({
  reservation,
  vehicule,
  nomInterlocuteur,
  onPress,
  afficherActions = false,
  messageActions,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.carte, { opacity: pressed ? 0.9 : 1 }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.entete}>
        <View style={styles.blocGauche}>
          <Text style={styles.titre}>
            {vehicule ? `${vehicule.marque} ${vehicule.modele}` : 'Véhicule'}
          </Text>
          {nomInterlocuteur && (
            <Text style={styles.sousTitre}>{nomInterlocuteur}</Text>
          )}
        </View>
        <IndicateurStatut statut={reservation.statut} petit />
      </View>

      <View style={styles.ligneInfos}>
        <View style={styles.info}>
          <Text style={styles.libelleInfo}>Du</Text>
          <Text style={styles.valeurInfo}>{formaterDateCourte(reservation.dateDebut)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.libelleInfo}>Au</Text>
          <Text style={styles.valeurInfo}>{formaterDateCourte(reservation.dateFin)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.libelleInfo}>Durée</Text>
          <Text style={styles.valeurInfo}>{formaterDuree(reservation.nombreJours)}</Text>
        </View>
      </View>

      <View style={styles.pied}>
        <View>
          <Text style={styles.libellePrix}>Total</Text>
          <Text style={styles.prix}>{formaterPrix(reservation.prixTotal)}</Text>
        </View>
        {vehicule && (
          <View style={styles.localisation}>
            <Text style={styles.libelleInfo}>Lieu</Text>
            <Text style={styles.valeurInfo}>{reservation.lieuPriseEnCharge}</Text>
          </View>
        )}
      </View>

      {afficherActions && messageActions && (
        <View style={styles.actions}>{messageActions}</View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  carte: {
    backgroundColor: CouleursNeutres.blancPur,
    borderRadius: Rayons.grand,
    padding: Espacements.lg,
    marginBottom: Espacements.md,
    ...Ombres.petite,
  },
  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Espacements.lg,
  },
  blocGauche: {
    flex: 1,
  },
  titre: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris900,
    marginBottom: Espacements.xxs,
  },
  sousTitre: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
  },
  ligneInfos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: CouleursNeutres.gris50,
    padding: Espacements.md,
    borderRadius: Rayons.moyen,
    marginBottom: Espacements.md,
  },
  info: {
    alignItems: 'center',
    flex: 1,
  },
  libelleInfo: {
    ...Typographie.legende,
    color: CouleursNeutres.gris500,
    marginBottom: Espacements.xxs,
  },
  valeurInfo: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris900,
    fontWeight: '600',
  },
  pied: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Espacements.md,
    borderTopWidth: 1,
    borderTopColor: CouleursNeutres.gris100,
  },
  libellePrix: {
    ...Typographie.legende,
    color: CouleursNeutres.gris500,
    marginBottom: Espacements.xxs,
  },
  prix: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris900,
  },
  localisation: {
    alignItems: 'flex-end',
    maxWidth: '50%',
  },
  actions: {
    marginTop: Espacements.lg,
    paddingTop: Espacements.lg,
    borderTopWidth: 1,
    borderTopColor: CouleursNeutres.gris100,
  },
});

export default CarteReservation;