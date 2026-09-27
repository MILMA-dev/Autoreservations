/**
 * Fichier: EnTete.tsx
 * Description: Composant d'en-tête d'écran réutilisable. Affiche un titre,
 * un éventuel sous-titre et une action optionnelle à droite.
 */
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { CouleursNeutres, Espacements } from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';

/**
 * Propriétés du composant EnTete.
 */
interface PropsEnTete {
  titre: string;
  sousTitre?: string;
  actionDroite?: React.ReactNode;
  alignement?: 'gauche' | 'centre';
  conteneurStyle?: ViewStyle;
}

/**
 * Composant EnTete utilisé en haut de chaque écran principal.
 */
const EnTete: React.FC<PropsEnTete> = ({
  titre,
  sousTitre,
  actionDroite,
  alignement = 'gauche',
  conteneurStyle,
}) => {
  return (
    <View
      style={[
        styles.conteneur,
        { alignItems: alignement === 'centre' ? 'center' : 'flex-start' },
        conteneurStyle,
      ]}
    >
      <View style={styles.ligneTitre}>
        <View style={styles.blocTitre}>
          <Text style={styles.titre}>{titre}</Text>
          {sousTitre && <Text style={styles.sousTitre}>{sousTitre}</Text>}
        </View>
        {actionDroite && <View style={styles.actionDroite}>{actionDroite}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    paddingHorizontal: Espacements.xl,
    paddingTop: Espacements.lg,
    paddingBottom: Espacements.lg,
  },
  ligneTitre: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  blocTitre: {
    flex: 1,
  },
  titre: {
    ...Typographie.titrePrincipal,
    color: CouleursNeutres.gris900,
  },
  sousTitre: {
    ...Typographie.corps,
    color: CouleursNeutres.gris500,
    marginTop: Espacements.xs,
  },
  actionDroite: {
    marginLeft: Espacements.md,
  },
});

export default EnTete;