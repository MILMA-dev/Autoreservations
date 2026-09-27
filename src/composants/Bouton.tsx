/**
 * Fichier: Bouton.tsx
 * Description: Composant bouton réutilisable avec plusieurs variantes
 * (primaire, secondaire, tertiaire, danger) et états (chargement, désactivé).
 */
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { CouleursNeutres, CouleursPrimaires, CouleursSemantiques, Espacements, Rayons } from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';

/**
 * Variantes visuelles du bouton.
 */
export type VarianteBouton = 'primaire' | 'secondaire' | 'tertiaire' | 'danger' | 'succes';

/**
 * Propriétés du composant Bouton.
 */
interface PropsBouton {
  titre: string;
  onPress: () => void;
  variante?: VarianteBouton;
  chargeur?: boolean;
  desactive?: boolean;
  pleineLargeur?: boolean;
  style?: ViewStyle;
  iconeGauche?: React.ReactNode;
}

/**
 * Composant Bouton principal de l'application.
 */
const Bouton: React.FC<PropsBouton> = ({
  titre,
  onPress,
  variante = 'primaire',
  chargeur = false,
  desactive = false,
  pleineLargeur = false,
  style,
  iconeGauche,
}) => {
  // Calcul des couleurs selon la variante
  const couleurs = obtenirCouleursVariante(variante, desactive);

  return (
    <Pressable
      onPress={onPress}
      disabled={desactive || chargeur}
      style={({ pressed }) => [
        styles.bouton,
        {
          backgroundColor: couleurs.fond,
          borderColor: couleurs.bordure,
          opacity: pressed ? 0.85 : 1,
          width: pleineLargeur ? '100%' : undefined,
        },
        style,
      ]}
    >
      {chargeur ? (
        <ActivityIndicator color={couleurs.texte} />
      ) : (
        <View style={styles.contenu}>
          {iconeGauche && <View style={styles.icone}>{iconeGauche}</View>}
          <Text style={[styles.texte, { color: couleurs.texte }]}>{titre}</Text>
        </View>
      )}
    </Pressable>
  );
};

/**
 * Retourne les couleurs associées à une variante.
 */
const obtenirCouleursVariante = (variante: VarianteBouton, desactive: boolean) => {
  if (desactive) {
    return {
      fond: CouleursNeutres.gris200,
      bordure: CouleursNeutres.gris200,
      texte: CouleursNeutres.gris500,
    };
  }
  switch (variante) {
    case 'primaire':
      return {
        fond: CouleursPrimaires.bleuProfond,
        bordure: CouleursPrimaires.bleuProfond,
        texte: CouleursNeutres.blancPur,
      };
    case 'secondaire':
      return {
        fond: CouleursNeutres.blancPur,
        bordure: CouleursPrimaires.bleuProfond,
        texte: CouleursPrimaires.bleuProfond,
      };
    case 'tertiaire':
      return {
        fond: 'transparent',
        bordure: 'transparent',
        texte: CouleursPrimaires.bleuProfond,
      };
    case 'danger':
      return {
        fond: CouleursSemantiques.erreur,
        bordure: CouleursSemantiques.erreur,
        texte: CouleursNeutres.blancPur,
      };
    case 'succes':
      return {
        fond: CouleursSemantiques.succes,
        bordure: CouleursSemantiques.succes,
        texte: CouleursNeutres.blancPur,
      };
  }
};

const styles = StyleSheet.create({
  bouton: {
    paddingVertical: Espacements.md,
    paddingHorizontal: Espacements.xl,
    borderRadius: Rayons.moyen,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  contenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icone: {
    marginRight: Espacements.sm,
  },
  texte: {
    ...Typographie.texteBouton,
  },
});

export default Bouton;