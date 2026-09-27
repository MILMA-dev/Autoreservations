/**
 * Fichier: IndicateurStatut.tsx
 * Description: Affiche un badge coloré indiquant le statut d'une réservation.
 * Utilisé dans les listes de réservations pour visualiser rapidement
 * l'état du workflow de validation.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CouleursNeutres, Espacements, Rayons } from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';
import { STATUTS_RESERVATION } from '../constantes/configuration';
import { StatutReservation } from '../modeles/types';

/**
 * Propriétés du composant IndicateurStatut.
 */
interface PropsIndicateurStatut {
  statut: StatutReservation;
  petit?: boolean;
}

/**
 * Badge affichant le statut d'une réservation avec sa couleur associée.
 */
const IndicateurStatut: React.FC<PropsIndicateurStatut> = ({ statut, petit = false }) => {
  const config = STATUTS_RESERVATION[statut];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.couleur + '20',
          borderColor: config.couleur,
          paddingVertical: petit ? Espacements.xxs : Espacements.xs,
          paddingHorizontal: petit ? Espacements.sm : Espacements.md,
        },
      ]}
    >
      <View
        style={[
          styles.point,
          { backgroundColor: config.couleur, width: petit ? 6 : 8, height: petit ? 6 : 8 },
        ]}
      />
      <Text style={[styles.libelle, { color: config.couleur, fontSize: petit ? 11 : 13 }]}>
        {config.libelle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Rayons.circulaire,
    borderWidth: 1,
  },
  point: {
    borderRadius: 4,
    marginRight: Espacements.xs,
  },
  libelle: {
    ...Typographie.legende,
    fontWeight: '700',
    color: CouleursNeutres.gris900,
  },
});

export default IndicateurStatut;