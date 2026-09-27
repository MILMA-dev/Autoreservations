/**
 * Fichier: MesVehicules.tsx
 * Description: Écran listant les véhicules appartenant au loueur connecté.
 * Permet l'accès à la modification, à la suppression et aux statistiques.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { utiliserContexteApp } from '../../magasin/ContexteApp';
import { ParametresPileRacine } from '../../navigation/NavigationRacine';
import { ParametresOnglets } from '../../navigation/NavigationPrincipal';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CouleursNeutres, CouleursPrimaires, Espacements } from '../../constantes/couleurs';
import { Typographie } from '../../constantes/typographie';
import CarteVehicule from '../../composants/CarteVehicule';
import Chargeur from '../../composants/Chargeur';
import EtatVide from '../../composants/EtatVide';
import EnTete from '../../composants/EnTete';
import Bouton from '../../composants/Bouton';
import ModalConfirmation from '../../composants/ModalConfirmation';
import { Vehicule } from '../../modeles/types';

type NavigationMesVehicules = CompositeNavigationProp<
  BottomTabNavigationProp<ParametresOnglets>,
  NativeStackNavigationProp<ParametresPileRacine>
>;

/**
 * Écran des véhicules du propriétaire.
 */
const MesVehicules: React.FC = () => {
  const navigation = useNavigation<NavigationMesVehicules>();
  const {
    mesVehicules,
    chargerMesVehicules,
    supprimerVehicule,
  } = utiliserContexteApp();
  const [rafraichissement, setRafraichissement] = useState(false);
  const [vehiculeASupprimer, setVehiculeASupprimer] = useState<Vehicule | null>(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  // Chargement initial
  useEffect(() => {
    chargerMesVehicules();
  }, []);

  /**
   * Gère le pull-to-refresh.
   */
  const gererRafraichissement = useCallback(async () => {
    setRafraichissement(true);
    await chargerMesVehicules();
    setRafraichissement(false);
  }, [chargerMesVehicules]);

  /**
   * Confirme puis supprime un véhicule.
   */
  const confirmerSuppression = async () => {
    if (!vehiculeASupprimer) return;
    setSuppressionEnCours(true);
    try {
      await supprimerVehicule(vehiculeASupprimer.identifiant);
      setVehiculeASupprimer(null);
      Alert.alert('Véhicule supprimé', 'Le véhicule a été retiré de votre catalogue.');
    } catch (erreur: any) {
      Alert.alert('Erreur', erreur.message || 'Suppression impossible.');
    } finally {
      setSuppressionEnCours(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={mesVehicules}
        keyExtractor={(item) => item.identifiant}
        renderItem={({ item }) => (
          <View>
            <CarteVehicule
              vehicule={item}
              onPress={() =>
                navigation.navigate('DetailsVehicule', { identifiant: item.identifiant })
              }
            />
            <View style={styles.actions}>
              <Bouton
                titre="Voir les détails"
                onPress={() =>
                  navigation.navigate('DetailsVehicule', { identifiant: item.identifiant })
                }
                variante="secondaire"
                style={styles.boutonAction}
                iconeGauche={
                  <Ionicons name="eye-outline" size={16} color={CouleursPrimaires.bleuProfond} />
                }
              />
              <Bouton
                titre="Supprimer"
                onPress={() => setVehiculeASupprimer(item)}
                variante="danger"
                style={styles.boutonAction}
                iconeGauche={
                  <Ionicons name="trash-outline" size={16} color={CouleursNeutres.blancPur} />
                }
              />
            </View>
          </View>
        )}
        ListHeaderComponent={
          <EnTete
            titre="Mes véhicules"
            sousTitre={`${mesVehicules.length} véhicule${mesVehicules.length > 1 ? 's' : ''} dans votre catalogue`}
          />
        }
        ListEmptyComponent={
          <EtatVide
            icone="car-outline"
            titre="Aucun véhicule"
            description="Vous n'avez pas encore ajouté de véhicule à votre catalogue. Commencez par en ajouter un."
            action={
              <Bouton
                titre="Ajouter un véhicule"
                onPress={() => navigation.navigate('AjouterVehicule')}
              />
            }
          />
        }
        contentContainerStyle={styles.liste}
        refreshControl={
          <RefreshControl
            refreshing={rafraichissement}
            onRefresh={gererRafraichissement}
            tintColor={CouleursPrimaires.bleuProfond}
          />
        }
      />

      {/* Modal de confirmation de suppression */}
      <ModalConfirmation
        visible={vehiculeASupprimer !== null}
        titre="Supprimer ce véhicule ?"
        message={`Le véhicule ${vehiculeASupprimer?.marque} ${vehiculeASupprimer?.modele} sera définitivement retiré de votre catalogue.`}
        type="refuser"
        texteConfirmer="Supprimer"
        texteAnnuler="Annuler"
        avecChampMessage
        libelleChampMessage="Raison (optionnel)"
        placeholderChampMessage="Indiquez pourquoi vous retirez ce véhicule…"
        surConfirmer={confirmerSuppression}
        surAnnuler={() => setVehiculeASupprimer(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CouleursNeutres.gris50,
  },
  liste: {
    paddingBottom: Espacements.xxxl,
    flexGrow: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -Espacements.md,
    marginBottom: Espacements.lg,
  },
  boutonAction: {
    flex: 1,
    marginHorizontal: Espacements.xxs,
  },
});

export default MesVehicules;