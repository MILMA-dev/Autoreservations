/**
 * Fichier: DetailsVehicule.tsx
 * Description: Écran détaillé d'un véhicule. Affiche toutes les informations
 * (photos, caractéristiques, propriétaire) et propose la réservation.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { utiliserContexteApp } from '../../magasin/ContexteApp';
import { obtenirVehicule } from '../../services/serviceVehicules';
import { obtenirProprietaire } from '../../services/serviceUtilisateurs';
import { Utilisateur, Vehicule } from '../../modeles/types';
import { ParametresPileRacine } from '../../navigation/NavigationRacine';
import {
  CouleursNeutres,
  CouleursPrimaires,
  Espacements,
  Ombres,
  Rayons,
} from '../../constantes/couleurs';
import { Typographie } from '../../constantes/typographie';
import Bouton from '../../composants/Bouton';
import Chargeur from '../../composants/Chargeur';
import { formaterDate, formaterDateCourte, formaterPrix, formaterDuree, calculerNombreJours, calculerPrixTotal } from '../../utilitaires/formatage';
import { CATEGORIES_VEHICULES, TYPES_CARBURANT, TYPES_TRANSMISSION } from '../../constantes/configuration';

type RouteDetails = RouteProp<ParametresPileRacine, 'DetailsVehicule'>;
type NavigationDetails = NativeStackNavigationProp<ParametresPileRacine, 'DetailsVehicule'>;

/**
 * Écran de détails d'un véhicule.
 */
const DetailsVehicule: React.FC = () => {
  const route = useRoute<RouteDetails>();
  const navigation = useNavigation<NavigationDetails>();
  const { utilisateurConnecte, role, creerReservation } = utiliserContexteApp();
  const [vehicule, setVehicule] = useState<Vehicule | null>(null);
  const [proprietaire, setProprietaire] = useState<Utilisateur | null>(null);
  const [chargement, setChargement] = useState(true);

  // Charge le véhicule et son propriétaire
  useEffect(() => {
    const chargerDonnees = async () => {
      const v = await obtenirVehicule(route.params.identifiant);
      setVehicule(v);
      if (v) {
        const p = await obtenirProprietaire(v.proprietaireId);
        setProprietaire(p);
      }
      setChargement(false);
    };
    chargerDonnees();
  }, [route.params.identifiant]);

  /**
   * Initie le processus de réservation.
   */
  const demarrerReservation = useCallback(async () => {
    if (!vehicule || !utilisateurConnecte) return;
    if (role !== 'client') {
      Alert.alert(
        'Action non autorisée',
        'Seuls les locataires peuvent effectuer une réservation.'
      );
      return;
    }

    // Calcul des dates par défaut : aujourd'hui + 3 jours
    const aujourdhui = new Date();
    const dans3Jours = new Date();
    dans3Jours.setDate(aujourdhui.getDate() + 3);
    const nombreJours = calculerNombreJours(
      aujourdhui.toISOString(),
      dans3Jours.toISOString()
    );

    try {
      await creerReservation({
        vehiculeId: vehicule.identifiant,
        clientId: utilisateurConnecte.identifiant,
        loueurId: vehicule.proprietaireId,
        dateDebut: aujourdhui.toISOString(),
        dateFin: dans3Jours.toISOString(),
        nombreJours,
        prixTotal: calculerPrixTotal(vehicule.prixParJour, nombreJours),
        caution: vehicule.caution,
        lieuPriseEnCharge: `${vehicule.ville} (${vehicule.codePostal})`,
      });
      Alert.alert(
        'Demande envoyée',
        'Votre demande de réservation a été transmise au propriétaire. Vous recevrez une réponse sous peu.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (erreur: any) {
      Alert.alert('Erreur', erreur.message || 'Impossible d\'envoyer la demande.');
    }
  }, [vehicule, utilisateurConnecte, role, creerReservation, navigation]);

  if (chargement) return <Chargeur pleinEcran message="Chargement du véhicule…" />;
  if (!vehicule) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.erreurConteneur}>
          <Text style={styles.texteErreur}>Véhicule introuvable</Text>
          <Bouton titre="Retour" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const categorie = CATEGORIES_VEHICULES.find((c) => c.identifiant === vehicule.categorie);
  const carburant = TYPES_CARBURANT.find((c) => c.identifiant === vehicule.carburant);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Bouton retour flottant */}
        <Pressable style={styles.boutonRetour} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={CouleursNeutres.gris900} />
        </Pressable>

        {/* Galerie photo */}
        <View style={styles.galerie}>
          {vehicule.photos.length > 0 ? (
            <Image source={{ uri: vehicule.photos[0] }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.textePlaceholder}>Pas de photo</Text>
            </View>
          )}
          <View style={styles.badgeCategorie}>
            <Text style={styles.texteBadge}>{categorie?.libelle || vehicule.categorie}</Text>
          </View>
        </View>

        <View style={styles.contenu}>
          {/* Titre et prix */}
          <View style={styles.entete}>
            <View style={styles.titreBloc}>
              <Text style={styles.titre}>
                {vehicule.marque} {vehicule.modele}
              </Text>
              <Text style={styles.sousTitre}>
                {vehicule.annee} • {vehicule.couleur} • {vehicule.ville}
              </Text>
            </View>
            <View style={styles.prixBloc}>
              <Text style={styles.prix}>{formaterPrix(vehicule.prixParJour)}</Text>
              <Text style={styles.prixUnite}>par jour</Text>
            </View>
          </View>

          {/* Caractéristiques principales */}
          <View style={styles.grilleCaracteristiques}>
            <Caracteristique
              icone="people-outline"
              libelle="Places"
              valeur={`${vehicule.nombrePlaces}`}
            />
            <Caracteristique
              icone="speedometer-outline"
              libelle="Kilométrage"
              valeur={`${vehicule.kilometrage.toLocaleString('fr-FR')} km`}
            />
            <Caracteristique
              icone={vehicule.transmission === 'automatique' ? 'settings-outline' : 'git-compare-outline'}
              libelle="Transmission"
              valeur={
                TYPES_TRANSMISSION.find((t) => t.identifiant === vehicule.transmission)?.libelle ||
                vehicule.transmission
              }
            />
            <Caracteristique
              icone="flash-outline"
              libelle="Carburant"
              valeur={carburant?.libelle || vehicule.carburant}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.titreSection}>Description</Text>
            <Text style={styles.description}>{vehicule.description}</Text>
          </View>

          {/* Équipements */}
          {vehicule.equipements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.titreSection}>Équipements</Text>
              <View style={styles.listeEquipements}>
                {vehicule.equipements.map((equipement, index) => (
                  <View key={index} style={styles.equipement}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={CouleursPrimaires.bleuProfond}
                    />
                    <Text style={styles.texteEquipement}>{equipement}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Propriétaire */}
          {proprietaire && (
            <View style={styles.section}>
              <Text style={styles.titreSection}>Propriétaire</Text>
              <View style={styles.carteProprietaire}>
                <View style={styles.avatar}>
                  <Text style={styles.initiales}>
                    {proprietaire.prenom.charAt(0)}
                    {proprietaire.nom.charAt(0)}
                  </Text>
                </View>
                <View style={styles.infoProprietaire}>
                  <Text style={styles.nomProprietaire}>
                    {proprietaire.prenom} {proprietaire.nom}
                  </Text>
                  <View style={styles.ligneNote}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.note}>
                      {proprietaire.noteMoyenne?.toFixed(1) || '4.8'} (
                      {proprietaire.nombreAvis || 0} avis)
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Conditions financières */}
          <View style={styles.carteConditions}>
            <Text style={styles.titreConditions}>Conditions de location</Text>
            <View style={styles.ligneCondition}>
              <Text style={styles.libelleCondition}>Prix journalier</Text>
              <Text style={styles.valeurCondition}>{formaterPrix(vehicule.prixParJour)}</Text>
            </View>
            <View style={styles.ligneCondition}>
              <Text style={styles.libelleCondition}>Caution</Text>
              <Text style={styles.valeurCondition}>{formaterPrix(vehicule.caution)}</Text>
            </View>
            <View style={styles.ligneCondition}>
              <Text style={styles.libelleCondition}>Disponibilité</Text>
              <Text
                style={[
                  styles.valeurCondition,
                  {
                    color: vehicule.disponible
                      ? CouleursPrimaires.bleuProfond
                      : CouleursNeutres.gris500,
                  },
                ]}
              >
                {vehicule.disponible ? 'Disponible' : 'Indisponible'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bouton d'action fixe en bas */}
      <View style={styles.barreAction}>
        <View style={styles.infoAction}>
          <Text style={styles.libelleAction}>À partir de</Text>
          <Text style={styles.prixAction}>{formaterPrix(vehicule.prixParJour)}</Text>
          <Text style={styles.uniteAction}>/ jour</Text>
        </View>
        <Bouton
          titre={role === 'client' ? 'Réserver ce véhicule' : 'Réserver (clients uniquement)'}
          onPress={demarrerReservation}
          variante="primaire"
          desactive={role !== 'client' || !vehicule.disponible}
        />
      </View>
    </SafeAreaView>
  );
};

/**
 * Petite carte de caractéristique.
 */
const Caracteristique: React.FC<{
  icone: keyof typeof Ionicons.glyphMap;
  libelle: string;
  valeur: string;
}> = ({ icone, libelle, valeur }) => (
  <View style={styles.caracteristique}>
    <View style={styles.iconeCaract}>
      <Ionicons name={icone} size={22} color={CouleursPrimaires.bleuProfond} />
    </View>
    <Text style={styles.libelleCaract}>{libelle}</Text>
    <Text style={styles.valeurCaract}>{valeur}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CouleursNeutres.blancPur,
  },
  scroll: {
    paddingBottom: 120,
  },
  boutonRetour: {
    position: 'absolute',
    top: Espacements.lg,
    left: Espacements.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CouleursNeutres.blancPur,
    alignItems: 'center',
    justifyContent: 'center',
    ...Ombres.moyenne,
  },
  galerie: {
    position: 'relative',
    width: '100%',
    height: 280,
    backgroundColor: CouleursNeutres.gris200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textePlaceholder: {
    ...Typographie.corps,
    color: CouleursNeutres.gris500,
  },
  badgeCategorie: {
    position: 'absolute',
    bottom: Espacements.lg,
    left: Espacements.lg,
    backgroundColor: CouleursNeutres.blancPur,
    paddingHorizontal: Espacements.md,
    paddingVertical: Espacements.xs,
    borderRadius: Rayons.petit,
    ...Ombres.petite,
  },
  texteBadge: {
    ...Typographie.legende,
    color: CouleursPrimaires.bleuProfond,
    fontWeight: '700',
  },
  contenu: {
    padding: Espacements.xl,
  },
  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Espacements.xl,
  },
  titreBloc: {
    flex: 1,
  },
  titre: {
    ...Typographie.titreSection,
    color: CouleursNeutres.gris900,
    marginBottom: Espacements.xxs,
  },
  sousTitre: {
    ...Typographie.corps,
    color: CouleursNeutres.gris500,
  },
  prixBloc: {
    alignItems: 'flex-end',
  },
  prix: {
    ...Typographie.titreCarte,
    fontSize: 24,
    color: CouleursPrimaires.bleuProfond,
  },
  prixUnite: {
    ...Typographie.legende,
    color: CouleursNeutres.gris500,
  },
  grilleCaracteristiques: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Espacements.xl,
  },
  caracteristique: {
    width: '48%',
    backgroundColor: CouleursNeutres.gris50,
    padding: Espacements.md,
    borderRadius: Rayons.moyen,
    alignItems: 'center',
    marginBottom: Espacements.sm,
  },
  iconeCaract: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CouleursPrimaires.bleuProfond + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Espacements.xs,
  },
  libelleCaract: {
    ...Typographie.legende,
    color: CouleursNeutres.gris500,
    marginBottom: Espacements.xxs,
  },
  valeurCaract: {
    ...Typographie.corpsPetit,
    fontWeight: '700',
    color: CouleursNeutres.gris900,
  },
  section: {
    marginBottom: Espacements.xl,
  },
  titreSection: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris900,
    marginBottom: Espacements.md,
  },
  description: {
    ...Typographie.corps,
    color: CouleursNeutres.gris600,
    lineHeight: 24,
  },
  listeEquipements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipement: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: Espacements.sm,
  },
  texteEquipement: {
    ...Typographie.corps,
    color: CouleursNeutres.gris700,
    marginLeft: Espacements.sm,
  },
  carteProprietaire: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CouleursNeutres.gris50,
    padding: Espacements.md,
    borderRadius: Rayons.moyen,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: CouleursPrimaires.bleuProfond,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Espacements.md,
  },
  initiales: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.blancPur,
  },
  infoProprietaire: {
    flex: 1,
  },
  nomProprietaire: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris900,
    marginBottom: Espacements.xxs,
  },
  ligneNote: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  note: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris600,
    marginLeft: Espacements.xs,
  },
  carteConditions: {
    backgroundColor: CouleursNeutres.gris50,
    padding: Espacements.lg,
    borderRadius: Rayons.moyen,
  },
  titreConditions: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris900,
    marginBottom: Espacements.md,
  },
  ligneCondition: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Espacements.sm,
    borderBottomWidth: 1,
    borderBottomColor: CouleursNeutres.gris100,
  },
  libelleCondition: {
    ...Typographie.corps,
    color: CouleursNeutres.gris600,
  },
  valeurCondition: {
    ...Typographie.corps,
    fontWeight: '700',
    color: CouleursNeutres.gris900,
  },
  barreAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CouleursNeutres.blancPur,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Espacements.lg,
    paddingBottom: Espacements.xxxl,
    borderTopWidth: 1,
    borderTopColor: CouleursNeutres.gris100,
    ...Ombres.grande,
  },
  infoAction: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: Espacements.md,
  },
  libelleAction: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
    marginRight: Espacements.xs,
  },
  prixAction: {
    ...Typographie.titreCarte,
    color: CouleursPrimaires.bleuProfond,
  },
  uniteAction: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
  },
  erreurConteneur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Espacements.xl,
  },
  texteErreur: {
    ...Typographie.titreCarte,
    color: CouleursNeutres.gris700,
    marginBottom: Espacements.xl,
  },
});

export default DetailsVehicule;