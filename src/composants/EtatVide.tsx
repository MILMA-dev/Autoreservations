/**
 * Fichier: EtatVide.tsx
 * Description: Composant affiché lorsqu'une liste est vide (aucun véhicule,
 * aucune réservation, etc.). Fournit un message clair et une action
 * optionnelle pour encourager l'utilisateur.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CouleursNeutres, Espacements } from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';
import { Ionicons } from '@expo/vector-icons';

/**
 * Propriétés du composant EtatVide.
 */
interface PropsEtatVide {
  icone: keyof typeof Ionicons.glyphMap;
  titre: string;
  description: string;
  action?: React.ReactNode;
}

/**
 * Affichage d'un état vide pour toute liste ou écran de données.
 */
const EtatVide: React.FC<PropsEtatVide> = ({ icone, titre, description, action }) => {
  return (
    <View style={styles.conteneur}>
      <View style={styles.conteneurIcone}>
        <Ionicons name={icone} size={48} color={CouleursNeutres.gris400} />
      </View>
      <Text style={styles.titre}>{titre}</Text>
      <Text style={styles.description}>{description}</Text>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Espacements.xxxl,
    paddingVertical: Espacements.enormes,
  },
  conteneurIcone: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: CouleursNeutres.gris100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Espacements.xl,
  },
  titre: {
    ...Typographie.titreCarte,
    color: CouleursNeutres.gris800,
    textAlign: 'center',
    marginBottom: Espacements.sm,
  },
  description: {
    ...Typographie.corps,
    color: CouleursNeutres.gris500,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: Espacements.xxl,
  },
});

export default EtatVide;