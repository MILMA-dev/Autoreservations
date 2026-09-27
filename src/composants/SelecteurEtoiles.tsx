/**
 * Fichier: SelecteurEtoiles.tsx
 * Description: Composant interactif permettant à un client de noter un
 * véhicule ou un propriétaire avec un système d'étoiles (1 à 5).
 * Utilisé après une location terminée.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CouleursNeutres,
  CouleursPrimaires,
  CouleursSemantiques,
  Espacements,
} from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';

/**
 * Propriétés du composant SelecteurEtoiles.
 */
interface PropsSelecteurEtoiles {
  valeur: number;
  surChangement: (note: number) => void;
  taille?: number;
  editable?: boolean;
  libelle?: string;
}

/**
 * Sélecteur d'étoiles 1 à 5 pour la notation d'un véhicule.
 */
const SelecteurEtoiles: React.FC<PropsSelecteurEtoiles> = ({
  valeur,
  surChangement,
  taille = 36,
  editable = true,
  libelle,
}) => {
  return (
    <View style={styles.conteneur}>
      {libelle && <Text style={styles.libelle}>{libelle}</Text>}
      <View style={styles.ligneEtoiles}>
        {[1, 2, 3, 4, 5].map((index) => (
          <Pressable
            key={index}
            onPress={() => editable && surChangement(index)}
            disabled={!editable}
            style={({ pressed }) => [
              styles.etoileBouton,
              { opacity: pressed && editable ? 0.7 : 1 },
            ]}
            hitSlop={8}
          >
            <Ionicons
              name={index <= valeur ? 'star' : 'star-outline'}
              size={taille}
              color={
                index <= valeur
                  ? CouleursSemantiques.avertissement
                  : CouleursNeutres.gris300
              }
            />
          </Pressable>
        ))}
      </View>
      {editable && (
        <Text style={styles.description}>
          {valeur === 0
            ? 'Touchez les étoiles pour noter'
            : valeur === 1
            ? 'Très mauvais'
            : valeur === 2
            ? 'Moyen'
            : valeur === 3
            ? 'Bien'
            : valeur === 4
            ? 'Très bien'
            : 'Excellent'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    alignItems: 'center',
  },
  libelle: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris800,
    marginBottom: Espacements.sm,
  },
  ligneEtoiles: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  etoileBouton: {
    paddingHorizontal: Espacements.xs,
    paddingVertical: Espacements.xxs,
  },
  description: {
    ...Typographie.corpsPetit,
    color: CouleursPrimaires.bleuProfond,
    marginTop: Espacements.sm,
    fontWeight: '600',
  },
});

export default SelecteurEtoiles;