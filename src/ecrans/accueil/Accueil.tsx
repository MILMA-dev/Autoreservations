/**
 * Fichier: Accueil.tsx
 * Description: Écran d'accueil principal. Affiche un message de bienvenue,
 * les actions rapides selon le rôle et une sélection de véhicules en
 * vedette. Permet la navigation vers les écrans de détails.
 */
import React, { useCallback, useEffect } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { utiliserContexteApp } from '../../magasin/ContexteApp';
import { Vehicule } from '../../modeles/types';
import {
  CouleursNeutres,
  CouleursPrimaires,
  CouleursSemantiques,
  Espacements,
  Rayons,
} from '../../constantes/couleurs';
import { Typographie } from '../../constantes/typographie';
import CarteVehicule from '../../composants/CarteVehicule';
import Chargeur from '../../composants/Chargeur';
import EnTete from '../../composants/EnTete';
import { ParametresOnglets } from '../../navigation/NavigationPrincipal';
import { ParametresPileRacine } from '../../navigation/NavigationRacine';

type NavigationAccueil = CompositeNavigationProp<
  BottomTabNavigationProp<ParametresOnglets>,
  NativeStackNavigationProp<ParametresPileRacine>
>;

/**
 * Écran d'accueil de l'application.
 */
const Accueil: React.FC = () => {
  const navigation = useNavigation<NavigationAccueil>();
  const {
    utilisateurConnecte,
    role,
    vehicules,
    chargerVehicules,
    reservationsAValider,
    mesReservations,
  } = utiliserContexteApp();
  const [rafraichissement, setRafraichissement] = React.useState(false);

  // Chargement initial des véhicules
  useEffect(() => {
    chargerVehicules();
  }, []);

  /**
   * Gère le pull-to-refresh.
   */
  const gererRafraichissement = useCallback(async () => {
    setRafraichissement(true);
    await chargerVehicules();
    setRafraichissement(false);
  }, [chargerVehicules]);

  /**
   * Navigue vers les détails d'un véhicule (via la pile racine).
   */
  const ouvrirDetailsVehicule = (vehicule: Vehicule) => {
    navigation.navigate('DetailsVehicule', { identifiant: vehicule.identifiant });
  };

  // Statistiques rapides affichées dans la section d'en-tête
  const statsLoueur = {
    vehicules: 0, // Sera calculé dynamiquement
    enAttente: reservationsAValider.length,
    validees: 0,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={vehicules.slice(0, 6)}
        keyExtractor={(item) => item.identifiant}
        renderItem={({ item }) => (
          <CarteVehicule vehicule={item} onPress={() => ouvrirDetailsVehicule(item)} />
        )}
        contentContainerStyle={styles.liste}
        ListHeaderComponent={
          <View>
            <EnTete
              titre={`Bonjour ${utilisateurConnecte?.prenom || ''} 👋`}
              sousTitre={
                role === 'loueur'
                  ? 'Gérez vos véhicules et vos réservations'
                  : 'Trouvez le véhicule idéal pour vos déplacements'
              }
            />

            {/* Carte de rôle */}
            <View
              style={[
                styles.carteRole,
                {
                  backgroundColor:
                    role === 'loueur'
                      ? CouleursPrimaires.bleuProfond
                      : CouleursPrimaires.orangeVif,
                },
              ]}
            >
              <View style={styles.carteRoleContenu}>
                <View style={styles.carteRoleTexte}>
                  <Text style={styles.carteRoleTitre}>
                    {role === 'loueur' ? 'Espace Propriétaire' : 'Espace Locataire'}
                  </Text>
                  <Text style={styles.carteRoleDescription}>
                    {role === 'loueur'
                      ? 'Ajoutez vos véhicules et validez les demandes de location.'
                      : 'Parcourez le catalogue et réservez en quelques clics.'}
                  </Text>
                </View>
                <Ionicons
                  name={role === 'loueur' ? 'car-sport' : 'rocket'}
                  size={48}
                  color={CouleursNeutres.blancPur}
                  style={styles.carteRoleIcone}
                />
              </View>
            </View>

            {/* Statistiques */}
            <View style={styles.stats}>
              {role === 'loueur' ? (
                <>
                  <CarteStat
                    icone="time-outline"
                    valeur={String(statsLoueur.enAttente)}
                    libelle="En attente"
                    couleur={CouleursSemantiques.avertissement}
                  />
                  <CarteStat
                    icone="car-sport-outline"
                    valeur={String(vehicules.filter((v) => v.proprietaireId === utilisateurConnecte?.identifiant).length)}
                    libelle="Mes véhicules"
                    couleur={CouleursPrimaires.bleuClair}
                  />
                  <CarteStat
                    icone="checkmark-circle-outline"
                    valeur={String(mesReservations.filter((r) => r.statut === 'validee').length)}
                    libelle="Validées"
                    couleur={CouleursSemantiques.succes}
                  />
                </>
              ) : (
                <>
                  <CarteStat
                    icone="car-sport-outline"
                    valeur={String(vehicules.length)}
                    libelle="Disponibles"
                    couleur={CouleursPrimaires.bleuClair}
                  />
                  <CarteStat
                    icone="calendar-outline"
                    valeur={String(mesReservations.length)}
                    libelle="Mes locations"
                    couleur={CouleursPrimaires.orangeVif}
                  />
                  <CarteStat
                    icone="star-outline"
                    valeur="4.8"
                    libelle="Note moyenne"
                    couleur={CouleursSemantiques.avertissement}
                  />
                </>
              )}
            </View>

            {/* Section véhicules en vedette */}
            <View style={styles.section}>
              <View style={styles.enteteSection}>
                <Text style={styles.titreSection}>
                  {role === 'loueur' ? 'Véhicules en vedette' : 'Nos coups de cœur'}
                </Text>
                <Pressable onPress={() => navigation.jumpTo('Recherche' as any)}>
                  <Text style={styles.lienVoirTout}>Voir tout</Text>
                </Pressable>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.chargement}>
            <Chargeur message="Chargement des véhicules…" />
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={rafraichissement}
            onRefresh={gererRafraichissement}
            tintColor={CouleursPrimaires.bleuProfond}
          />
        }
      />
    </SafeAreaView>
  );
};

/**
 * Petite carte de statistique affichée sur l'accueil.
 */
const CarteStat: React.FC<{
  icone: keyof typeof Ionicons.glyphMap;
  valeur: string;
  libelle: string;
  couleur: string;
}> = ({ icone, valeur, libelle, couleur }) => (
  <View style={styles.carteStat}>
    <View style={[styles.iconeStat, { backgroundColor: couleur + '15' }]}>
      <Ionicons name={icone} size={22} color={couleur} />
    </View>
    <Text style={styles.valeurStat}>{valeur}</Text>
    <Text style={styles.libelleStat}>{libelle}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CouleursNeutres.gris50,
  },
  liste: {
    paddingHorizontal: Espacements.xl,
    paddingBottom: Espacements.xxl,
  },
  carteRole: {
    borderRadius: Rayons.grand,
    padding: Espacements.xl,
    marginBottom: Espacements.xl,
  },
  carteRoleContenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  carteRoleTexte: {
    flex: 1,
  },
  carteRoleTitre: {
    ...Typographie.titreCarte,
    color: CouleursNeutres.blancPur,
    marginBottom: Espacements.xs,
  },
  carteRoleDescription: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.blancPur,
    opacity: 0.9,
    lineHeight: 20,
  },
  carteRoleIcone: {
    marginLeft: Espacements.md,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Espacements.xl,
  },
  carteStat: {
    flex: 1,
    backgroundColor: CouleursNeutres.blancPur,
    borderRadius: Rayons.moyen,
    padding: Espacements.md,
    alignItems: 'center',
    marginHorizontal: Espacements.xxs,
  },
  iconeStat: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Espacements.sm,
  },
  valeurStat: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris900,
  },
  libelleStat: {
    ...Typographie.legende,
    color: CouleursNeutres.gris500,
    marginTop: Espacements.xxs,
    textAlign: 'center',
  },
  section: {
    marginBottom: Espacements.md,
  },
  enteteSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Espacements.md,
  },
  titreSection: {
    ...Typographie.titreCarte,
    color: CouleursNeutres.gris900,
  },
  lienVoirTout: {
    ...Typographie.corps,
    color: CouleursPrimaires.bleuProfond,
    fontWeight: '600',
  },
  chargement: {
    paddingVertical: Espacements.xxxl,
  },
});

export default Accueil;