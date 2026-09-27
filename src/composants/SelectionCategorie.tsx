/**
 * Fichier: SelectionCategorie.tsx
 * Description: Affiche horizontalement la liste des catégories de véhicules
 * sous forme de pastilles sélectionnables.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { CouleursNeutres, CouleursPrimaires, Espacements, Rayons } from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES_VEHICULES } from '../constantes/configuration';
import { CategorieVehicule } from '../modeles/types';

interface PropsSelectionCategorie {
  categorieActive: CategorieVehicule | null;
  surChangement: (categorie: CategorieVehicule | null) => void;
}

const SelectionCategorie: React.FC<PropsSelectionCategorie> = ({
  categorieActive,
  surChangement,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.conteneur}
    >
      {/* Pastille "Tous" */}
      <Pastille
        titre="Tous"
        icone="grid-outline"
        active={categorieActive === null}
        onPress={() => surChangement(null)}
      />
      {/* Pastilles par catégorie */}
      {CATEGORIES_VEHICULES.map((cat) => (
        <Pastille
          key={cat.identifiant}
          titre={cat.libelle}
          icone={cat.icone as any}
          active={categorieActive === cat.identifiant}
          onPress={() => surChangement(cat.identifiant)}
        />
      ))}
    </ScrollView>
  );
};

const Pastille: React.FC<{
  titre: string;
  icone: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}> = ({ titre, icone, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.pastille,
      {
        backgroundColor: active ? CouleursPrimaires.bleuProfond : CouleursNeutres.blancPur,
        borderColor: active ? CouleursPrimaires.bleuProfond : CouleursNeutres.gris200,
        opacity: pressed ? 0.85 : 1,
      },
    ]}
  >
    <Ionicons
      name={icone}
      size={18}
      color={active ? CouleursNeutres.blancPur : CouleursPrimaires.bleuProfond}
    />
    <Text
      style={[
        styles.textePastille,
        { color: active ? CouleursNeutres.blancPur : CouleursNeutres.gris700 },
      ]}
    >
      {titre}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  conteneur: {
    paddingHorizontal: Espacements.xl,
    paddingVertical: Espacements.md,
  },
  pastille: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Espacements.lg,
    paddingVertical: Espacements.sm,
    borderRadius: Rayons.circulaire,
    borderWidth: 1.5,
    marginRight: Espacements.sm,
  },
  textePastille: {
    ...Typographie.corpsPetit,
    fontWeight: '600',
    marginLeft: Espacements.xs,
  },
});

export default SelectionCategorie;