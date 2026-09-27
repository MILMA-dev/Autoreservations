/**
 * Fichier: AjouterVehicule.tsx
 * Description: Formulaire d'ajout d'un nouveau véhicule au catalogue
 * du propriétaire. Permet de téléverser plusieurs photos depuis la
 * galerie ou la caméra, inclut la validation des champs et la
 * persistance du véhicule et de ses photos.
 */
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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
import { ParametresOnglets } from '../../navigation/NavigationPrincipal';
import {
  CouleursNeutres,
  CouleursPrimaires,
  Espacements,
  Rayons,
} from '../../constantes/couleurs';
import { Typographie } from '../../constantes/typographie';
import Bouton from '../../composants/Bouton';
import ChampTexte from '../../composants/ChampTexte';
import SelecteurPhoto from '../../composants/SelecteurPhoto';
import {
  CATEGORIES_VEHICULES,
  TYPES_CARBURANT,
  TYPES_TRANSMISSION,
} from '../../constantes/configuration';
import {
  CategorieVehicule,
  Transmission,
  TypeCarburant,
} from '../../modeles/types';
import { validerChampObligatoire } from '../../utilitaires/validation';
import { ajouterPhotoVehicule } from '../../services/stockageLocalAvance';

type NavigationAjout = CompositeNavigationProp<
  BottomTabNavigationProp<ParametresOnglets>,
  NativeStackNavigationProp<any>
>;

/**
 * Villes camerounaises disponibles pour la localisation.
 */
const VILLES_CAMEROUN = [
  'Yaoundé',
  'Douala',
  'Bafoussam',
  'Bamenda',
  'Garoua',
  'Maroua',
  'Ngaoundéré',
  'Bertoua',
  'Ebolowa',
  'Kribi',
  'Limbe',
  'Buea',
  'Dschang',
  'Edéa',
  'Kumba',
];

/**
 * Écran d'ajout d'un véhicule.
 */
const AjouterVehicule: React.FC = () => {
  const navigation = useNavigation<NavigationAjout>();
  const { utilisateurConnecte, ajouterVehicule } = utiliserContexteApp();

  // État du formulaire
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [annee, setAnnee] = useState('');
  const [couleur, setCouleur] = useState('');
  const [prix, setPrix] = useState('');
  const [caution, setCaution] = useState('');
  const [ville, setVille] = useState('');
  const [description, setDescription] = useState('');
  const [kilometrage, setKilometrage] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Sélections
  const [categorie, setCategorie] = useState<CategorieVehicule>('citadine');
  const [carburant, setCarburant] = useState<TypeCarburant>('essence');
  const [transmission, setTransmission] = useState<Transmission>('manuelle');

  const [nombrePlaces, setNombrePlaces] = useState('5');
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [chargement, setChargement] = useState(false);

  /**
   * Valide les champs et crée le véhicule avec ses photos.
   */
  const validerEtAjouter = async () => {
    const nouvellesErreurs: Record<string, string> = {};
    nouvellesErreurs.marque = validerChampObligatoire(marque, 'Marque');
    nouvellesErreurs.modele = validerChampObligatoire(modele, 'Modèle');
    nouvellesErreurs.annee = !annee || isNaN(Number(annee)) || Number(annee) < 1990 || Number(annee) > 2030
      ? 'Année invalide (entre 1990 et 2030)'
      : '';
    nouvellesErreurs.couleur = validerChampObligatoire(couleur, 'Couleur');
    nouvellesErreurs.prix = !prix || isNaN(Number(prix)) || Number(prix) <= 0
      ? 'Prix invalide'
      : '';
    nouvellesErreurs.ville = validerChampObligatoire(ville, 'Ville');
    nouvellesErreurs.description = validerChampObligatoire(description, 'Description');
    if (photos.length === 0) {
      nouvellesErreurs.photos = 'Veuillez ajouter au moins une photo';
    }

    const erreursFiltrees: Record<string, string> = {};
    Object.keys(nouvellesErreurs).forEach((cle) => {
      if (nouvellesErreurs[cle]) erreursFiltrees[cle] = nouvellesErreurs[cle];
    });
    setErreurs(erreursFiltrees);
    if (Object.keys(erreursFiltrees).length > 0) return;

    setChargement(true);
    try {
      // Création du véhicule via le service
      const nouveauVehicule = await ajouterVehicule({
        proprietaireId: utilisateurConnecte?.identifiant || '',
        marque: marque.trim(),
        modele: modele.trim(),
        annee: Number(annee),
        categorie,
        carburant,
        transmission,
        nombrePlaces: Number(nombrePlaces),
        couleur: couleur.trim(),
        kilometrage: Number(kilometrage) || 0,
        prixParJour: Number(prix),
        caution: Number(caution) || 0,
        description: description.trim(),
        equipements: ['Climatisation', 'Bluetooth'],
        photos,
        ville: ville.trim(),
        codePostal: '00000',
        disponible: true,
      });

      // Persistance des photos localement pour ce véhicule
      for (const photoUri of photos) {
        await ajouterPhotoVehicule(nouveauVehicule.identifiant, photoUri);
      }

      Alert.alert(
        'Véhicule ajouté',
        `${marque} ${modele} est désormais visible par les locataires.`,
        [{ text: 'OK', onPress: () => navigation.navigate('MesVehicules') }]
      );
      // Réinitialisation du formulaire
      setMarque('');
      setModele('');
      setAnnee('');
      setCouleur('');
      setPrix('');
      setCaution('');
      setVille('');
      setDescription('');
      setKilometrage('');
      setPhotos([]);
    } catch (erreur: any) {
      Alert.alert('Erreur', erreur.message || 'Impossible d\'ajouter le véhicule.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.conteneur}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.entete}>
            <Text style={styles.titre}>Ajouter un véhicule</Text>
            <Text style={styles.sousTitre}>
              Renseignez les informations et ajoutez des photos de votre véhicule.
            </Text>
          </View>

          {/* Section photos */}
          <Text style={styles.titreSection}>Photos du véhicule</Text>
          <SelecteurPhoto
            photos={photos}
            surChangement={setPhotos}
            nombreMax={5}
            erreur={erreurs.photos}
          />

          {/* Section informations générales */}
          <Text style={styles.titreSection}>Informations générales</Text>
          <View style={styles.ligneChamps}>
            <ChampTexte
              libelle="Marque"
              value={marque}
              onChangeText={setMarque}
              placeholder="Toyota"
              erreur={erreurs.marque}
              obligatoire
              conteneurStyle={styles.champDemi}
            />
            <ChampTexte
              libelle="Modèle"
              value={modele}
              onChangeText={setModele}
              placeholder="RAV4"
              erreur={erreurs.modele}
              obligatoire
              conteneurStyle={styles.champDemi}
            />
          </View>

          <View style={styles.ligneChamps}>
            <ChampTexte
              libelle="Année"
              value={annee}
              onChangeText={setAnnee}
              placeholder="2024"
              type="numerique"
              erreur={erreurs.annee}
              obligatoire
              conteneurStyle={styles.champDemi}
            />
            <ChampTexte
              libelle="Couleur"
              value={couleur}
              onChangeText={setCouleur}
              placeholder="Gris Argent"
              erreur={erreurs.couleur}
              obligatoire
              conteneurStyle={styles.champDemi}
            />
          </View>

          {/* Catégorie */}
          <View style={styles.selectionGroupe}>
            <Text style={styles.libelleSelection}>Catégorie</Text>
            <View style={styles.ligneOptions}>
              {CATEGORIES_VEHICULES.map((cat) => (
                <PastilleSelection
                  key={cat.identifiant}
                  titre={cat.libelle}
                  active={categorie === cat.identifiant}
                  onPress={() => setCategorie(cat.identifiant)}
                />
              ))}
            </View>
          </View>

          {/* Carburant */}
          <View style={styles.selectionGroupe}>
            <Text style={styles.libelleSelection}>Carburant</Text>
            <View style={styles.ligneOptions}>
              {TYPES_CARBURANT.map((c) => (
                <PastilleSelection
                  key={c.identifiant}
                  titre={c.libelle}
                  active={carburant === c.identifiant}
                  onPress={() => setCarburant(c.identifiant)}
                />
              ))}
            </View>
          </View>

          {/* Transmission */}
          <View style={styles.selectionGroupe}>
            <Text style={styles.libelleSelection}>Transmission</Text>
            <View style={styles.ligneOptions}>
              {TYPES_TRANSMISSION.map((t) => (
                <PastilleSelection
                  key={t.identifiant}
                  titre={t.libelle}
                  active={transmission === t.identifiant}
                  onPress={() => setTransmission(t.identifiant)}
                />
              ))}
            </View>
          </View>

          {/* Spécifications */}
          <Text style={styles.titreSection}>Spécifications</Text>
          <View style={styles.ligneChamps}>
            <ChampTexte
              libelle="Places"
              value={nombrePlaces}
              onChangeText={setNombrePlaces}
              placeholder="5"
              type="numerique"
              conteneurStyle={styles.champDemi}
            />
            <ChampTexte
              libelle="Kilométrage"
              value={kilometrage}
              onChangeText={setKilometrage}
              placeholder="25000"
              type="numerique"
              conteneurStyle={styles.champDemi}
            />
          </View>

          {/* Tarification */}
          <Text style={styles.titreSection}>Tarification (FCFA)</Text>
          <View style={styles.ligneChamps}>
            <ChampTexte
              libelle="Prix par jour (FCFA)"
              value={prix}
              onChangeText={setPrix}
              placeholder="35000"
              type="numerique"
              erreur={erreurs.prix}
              obligatoire
              conteneurStyle={styles.champDemi}
            />
            <ChampTexte
              libelle="Caution (FCFA)"
              value={caution}
              onChangeText={setCaution}
              placeholder="150000"
              type="numerique"
              conteneurStyle={styles.champDemi}
            />
          </View>

          {/* Localisation */}
          <Text style={styles.titreSection}>Localisation</Text>
          <View style={styles.selectionGroupe}>
            <Text style={styles.libelleSelection}>
              Ville <Text style={styles.obligatoire}>*</Text>
            </Text>
            <View style={styles.ligneOptions}>
              {VILLES_CAMEROUN.map((nomVille) => (
                <PastilleSelection
                  key={nomVille}
                  titre={nomVille}
                  active={ville === nomVille}
                  onPress={() => setVille(nomVille)}
                />
              ))}
            </View>
            {erreurs.ville && <Text style={styles.erreur}>{erreurs.ville}</Text>}
          </View>

          {/* Description */}
          <ChampTexte
            libelle="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez votre véhicule, ses points forts, son état…"
            erreur={erreurs.description}
            obligatoire
            type="multiligne"
            nombreLignes={5}
          />

          <Bouton
            titre="Ajouter le véhicule"
            onPress={validerEtAjouter}
            chargeur={chargement}
            pleineLargeur
            style={styles.boutonSoumettre}
            iconeGauche={
              <Ionicons name="add-circle-outline" size={18} color={CouleursNeutres.blancPur} />
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/**
 * Composant interne : pastille de sélection cliquable.
 */
const PastilleSelection: React.FC<{
  titre: string;
  active: boolean;
  onPress: () => void;
}> = ({ titre, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.pastille,
      {
        backgroundColor: active ? CouleursPrimaires.bleuProfond : CouleursNeutres.blancPur,
        borderColor: active ? CouleursPrimaires.bleuProfond : CouleursNeutres.gris300,
      },
    ]}
  >
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
  safeArea: {
    flex: 1,
    backgroundColor: CouleursNeutres.gris50,
  },
  flex: { flex: 1 },
  conteneur: {
    padding: Espacements.xl,
    paddingBottom: Espacements.xxxl,
  },
  entete: {
    marginBottom: Espacements.xl,
  },
  titre: {
    ...Typographie.titreSection,
    color: CouleursNeutres.gris900,
    marginBottom: Espacements.xs,
  },
  sousTitre: {
    ...Typographie.corps,
    color: CouleursNeutres.gris500,
  },
  titreSection: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris800,
    marginTop: Espacements.lg,
    marginBottom: Espacements.md,
  },
  ligneChamps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  champDemi: {
    flex: 1,
    marginRight: Espacements.sm,
  },
  selectionGroupe: {
    marginBottom: Espacements.md,
  },
  libelleSelection: {
    ...Typographie.corps,
    fontWeight: '600',
    color: CouleursNeutres.gris700,
    marginBottom: Espacements.sm,
  },
  obligatoire: {
    color: '#EF4444',
  },
  erreur: {
    ...Typographie.corpsPetit,
    color: '#EF4444',
    marginTop: Espacements.xs,
  },
  ligneOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pastille: {
    paddingHorizontal: Espacements.md,
    paddingVertical: Espacements.sm,
    borderRadius: Rayons.circulaire,
    borderWidth: 1.5,
    marginRight: Espacements.sm,
    marginBottom: Espacements.sm,
  },
  textePastille: {
    ...Typographie.corpsPetit,
    fontWeight: '600',
  },
  boutonSoumettre: {
    marginTop: Espacements.xl,
  },
});

export default AjouterVehicule;