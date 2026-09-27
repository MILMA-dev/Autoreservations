/**
 * Fichier: Rechercher.tsx
 * Description: Écran de recherche et de filtrage du catalogue de véhicules.
 * Affiche une barre de recherche, des filtres par catégorie et la liste
 * des véhicules correspondants. Permet l'accès aux détails d'un véhicule.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { utiliserContexteApp } from '../../magasin/ContexteApp';
import { CategorieVehicule, Vehicule } from '../../modeles/types';
import {
  CouleursNeutres,
  CouleursPrimaires,
  Espacements,
  Rayons,
} from '../../constantes/couleurs';
import { Typographie } from '../../constantes/typographie';
import CarteVehicule from '../../composants/CarteVehicule';
import Chargeur from '../../composants/Chargeur';
import EtatVide from '../../composants/EtatVide';
import SelectionCategorie from '../../composants/SelectionCategorie';
import Bouton from '../../composants/Bouton';
import DetailsVehicule from '../vehicule/DetailsVehicule';

/**
 * Définit les paramètres de la pile de recherche (inclut l'écran détail).
 */
export type ParametresPileRecherche = {
  RechercheListe: undefined;
  DetailsVehicule: { identifiant: string };
};

type Props = NativeStackScreenProps<ParametresPileRecherche, 'RechercheListe'>;

/**
 * Écran principal de recherche avec navigation interne.
 */
const Rechercher: React.FC<Props> = ({ navigation }) => {
  const { vehicules, chargerVehicules, rechercherVehicules } = utiliserContexteApp();
  const [termeRecherche, setTermeRecherche] = useState('');
  const [categorieActive, setCategorieActive] = useState<CategorieVehicule | null>(null);
  const [chargement, setChargement] = useState(false);
  const [rafraichissement, setRafraichissement] = useState(false);

  // Chargement initial
  useEffect(() => {
    chargerVehicules();
  }, []);

  /**
   * Déclenche la recherche avec le terme actuel.
   */
  const executerRecherche = useCallback(async () => {
    setChargement(true);
    await rechercherVehicules(termeRecherche);
    setChargement(false);
  }, [termeRecherche, rechercherVehicules]);

  /**
   * Filtre les véhicules par catégorie côté local pour la réactivité.
   */
  const vehiculesFiltres = React.useMemo(() => {
    if (!categorieActive) return vehicules;
    return vehicules.filter((v) => v.categorie === categorieActive);
  }, [vehicules, categorieActive]);

  /**
   * Gère le pull-to-refresh.
   */
  const gererRafraichissement = async () => {
    setRafraichissement(true);
    await chargerVehicules();
    setRafraichissement(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* En-tête avec barre de recherche */}
      <View style={styles.entete}>
        <Text style={styles.titre}>Catalogue</Text>
        <Text style={styles.sousTitre}>
          {vehiculesFiltres.length} véhicule{vehiculesFiltres.length > 1 ? 's' : ''} disponible
          {vehiculesFiltres.length > 1 ? 's' : ''}
        </Text>

        {/* Barre de recherche */}
        <View style={styles.barreRecherche}>
          <Ionicons name="search" size={20} color={CouleursNeutres.gris500} />
          <TextInput
            style={styles.saisieRecherche}
            placeholder="Rechercher par marque, modèle, ville…"
            placeholderTextColor={CouleursNeutres.gris400}
            value={termeRecherche}
            onChangeText={setTermeRecherche}
            onSubmitEditing={executerRecherche}
            returnKeyType="search"
          />
          {termeRecherche.length > 0 && (
            <Pressable onPress={() => setTermeRecherche('')}>
              <Ionicons name="close-circle" size={20} color={CouleursNeutres.gris400} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filtres par catégorie */}
      <SelectionCategorie
        categorieActive={categorieActive}
        surChangement={setCategorieActive}
      />

      {/* Liste des véhicules */}
      {chargement ? (
        <Chargeur message="Recherche en cours…" />
      ) : (
        <FlatList
          data={vehiculesFiltres}
          keyExtractor={(item) => item.identifiant}
          renderItem={({ item }) => (
            <CarteVehicule
              vehicule={item}
              onPress={() =>
                navigation.navigate('DetailsVehicule', { identifiant: item.identifiant })
              }
            />
          )}
          contentContainerStyle={styles.liste}
          refreshControl={
            <RefreshControl
              refreshing={rafraichissement}
              onRefresh={gererRafraichissement}
              tintColor={CouleursPrimaires.bleuProfond}
            />
          }
          ListEmptyComponent={
            <EtatVide
              icone="car-outline"
              titre="Aucun véhicule trouvé"
              description="Aucun véhicule ne correspond à votre recherche. Essayez avec d'autres critères."
              action={
                <Bouton
                  titre="Réinitialiser les filtres"
                  onPress={() => {
                    setTermeRecherche('');
                    setCategorieActive(null);
                  }}
                  variante="secondaire"
                />
              }
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CouleursNeutres.gris50,
  },
  entete: {
    paddingHorizontal: Espacements.xl,
    paddingTop: Espacements.lg,
    paddingBottom: Espacements.md,
  },
  titre: {
    ...Typographie.titreSection,
    color: CouleursNeutres.gris900,
  },
  sousTitre: {
    ...Typographie.corps,
    color: CouleursNeutres.gris500,
    marginBottom: Espacements.lg,
  },
  barreRecherche: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CouleursNeutres.blancPur,
    borderRadius: Rayons.moyen,
    paddingHorizontal: Espacements.md,
    paddingVertical: Espacements.sm,
    borderWidth: 1,
    borderColor: CouleursNeutres.gris200,
  },
  saisieRecherche: {
    flex: 1,
    paddingHorizontal: Espacements.md,
    fontSize: 15,
    color: CouleursNeutres.gris900,
  },
  liste: {
    paddingHorizontal: Espacements.xl,
    paddingBottom: Espacements.xxl,
  },
});

export default Rechercher;