/**
 * Fichier: Chargeur.tsx
 * Description: Composant indicateur de chargement (spinner) avec libellé
 * optionnel. Utilisé pendant les appels réseau et les traitements lourds.
 */
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { CouleursNeutres, CouleursPrimaires, Espacements } from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';

/**
 * Propriétés du composant Chargeur.
 */
interface PropsChargeur {
  message?: string;
  pleinEcran?: boolean;
}

/**
 * Spinner de chargement réutilisable dans toute l'application.
 */
const Chargeur: React.FC<PropsChargeur> = ({ message, pleinEcran = false }) => {
  const conteneurStyle = pleinEcran ? styles.pleinEcran : styles.compact;

  return (
    <View style={conteneurStyle}>
      <ActivityIndicator size="large" color={CouleursPrimaires.bleuProfond} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  compact: {
    padding: Espacements.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pleinEcran: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CouleursNeutres.blancPur,
  },
  message: {
    ...Typographie.corps,
    color: CouleursNeutres.gris600,
    marginTop: Espacements.md,
  },
});

export default Chargeur;