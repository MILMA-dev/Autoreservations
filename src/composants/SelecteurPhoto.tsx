/**
 * Fichier: SelecteurPhoto.tsx
 * Description: Composant de gestion de photos de véhicules.
 *
 * Permet au propriétaire d'ajouter des photos de son véhicule via :
 * - Une URL d'image (saisie manuelle)
 * - Un générateur de photos par défaut (placeholder visuel)
 *
 * Les photos sont ensuite persistées localement (URIs) pour être
 * réutilisées lors de l'affichage de l'annonce.
 *
 * Note : ce composant est conçu pour être compatible avec un picker
 * natif (expo-image-picker) ; l'interface actuelle fonctionne en
 * mode dégradé sans dépendance supplémentaire et reste pleinement
 * fonctionnelle pour la démonstration.
 */
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CouleursNeutres,
  CouleursPrimaires,
  CouleursSemantiques,
  Espacements,
  Rayons,
} from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';

/**
 * Liste de photos par défaut pour faciliter la démonstration.
 * Photos libres de droits de voitures (Unsplash).
 */
const PHOTOS_PAR_DEFAUT = [
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
  'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
];

/**
 * Propriétés du composant SelecteurPhoto.
 */
interface PropsSelecteurPhoto {
  photos: string[];
  surChangement: (photos: string[]) => void;
  nombreMax?: number;
  erreur?: string;
}

/**
 * Composant de sélection multiple de photos.
 */
const SelecteurPhoto: React.FC<PropsSelecteurPhoto> = ({
  photos,
  surChangement,
  nombreMax = 5,
  erreur,
}) => {
  const [saisieUrlVisible, setSaisieUrlVisible] = useState(false);
  const [urlSaisie, setUrlSaisie] = useState('');

  /**
   * Ajoute une photo depuis la bibliothèque par défaut.
   */
  const ajouterPhotoParDefaut = () => {
    if (photos.length >= nombreMax) {
      Alert.alert(
        'Limite atteinte',
        `Vous ne pouvez ajouter que ${nombreMax} photos maximum.`
      );
      return;
    }
    // Sélectionne une photo par défaut qui n'est pas déjà présente
    const disponibles = PHOTOS_PAR_DEFAUT.filter((p) => !photos.includes(p));
    if (disponibles.length === 0) {
      Alert.alert(
        'Photos épuisées',
        'Toutes les photos par défaut sont déjà ajoutées.'
      );
      return;
    }
    const nouvellePhoto =
      disponibles[Math.floor(Math.random() * disponibles.length)];
    surChangement([...photos, nouvellePhoto]);
  };

  /**
   * Ajoute une photo via URL saisie par l'utilisateur.
   */
  const ajouterPhotoParUrl = () => {
    if (!urlSaisie.trim()) {
      Alert.alert('URL requise', 'Veuillez saisir une URL d\'image valide.');
      return;
    }
    if (!urlSaisie.startsWith('http')) {
      Alert.alert(
        'URL invalide',
        'L\'URL doit commencer par http:// ou https://'
      );
      return;
    }
    if (photos.length >= nombreMax) {
      Alert.alert(
        'Limite atteinte',
        `Vous ne pouvez ajouter que ${nombreMax} photos maximum.`
      );
      return;
    }
    surChangement([...photos, urlSaisie.trim()]);
    setUrlSaisie('');
    setSaisieUrlVisible(false);
  };

  /**
   * Ouvre un menu d'action pour choisir comment ajouter une photo.
   */
  const demanderAjoutPhoto = () => {
    Alert.alert(
      'Ajouter une photo',
      'Choisissez une méthode d\'ajout',
      [
        {
          text: 'Photo par défaut',
          onPress: ajouterPhotoParDefaut,
        },
        {
          text: 'Saisir une URL',
          onPress: () => setSaisieUrlVisible(true),
        },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  /**
   * Supprime une photo de la liste.
   */
  const supprimerPhoto = (index: number) => {
    Alert.alert(
      'Supprimer cette photo ?',
      'La photo sera retirée de votre annonce.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const nouvelles = photos.filter((_, i) => i !== index);
            surChangement(nouvelles);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.conteneur}>
      <Text style={styles.libelle}>
        Photos du véhicule <Text style={styles.obligatoire}>*</Text>
      </Text>
      <Text style={styles.description}>
        Ajoutez jusqu'à {nombreMax} photos ({photos.length}/{nombreMax}).
        La première photo sera utilisée comme photo principale.
      </Text>

      {/* Saisie d'URL */}
      {saisieUrlVisible && (
        <View style={styles.zoneSaisieUrl}>
          <TextInput
            style={styles.saisieUrl}
            placeholder="https://exemple.com/photo.jpg"
            placeholderTextColor={CouleursNeutres.gris400}
            value={urlSaisie}
            onChangeText={setUrlSaisie}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <Pressable style={styles.boutonValiderUrl} onPress={ajouterPhotoParUrl}>
            <Ionicons name="checkmark" size={20} color={CouleursNeutres.blancPur} />
          </Pressable>
          <Pressable
            style={styles.boutonAnnulerUrl}
            onPress={() => {
              setSaisieUrlVisible(false);
              setUrlSaisie('');
            }}
          >
            <Ionicons name="close" size={20} color={CouleursNeutres.gris700} />
          </Pressable>
        </View>
      )}

      {/* Liste horizontale des photos */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listePhotos}
      >
        {/* Bouton d'ajout */}
        {photos.length < nombreMax && (
          <Pressable
            style={({ pressed }) => [
              styles.boutonAjout,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={demanderAjoutPhoto}
          >
            <Ionicons
              name="camera-outline"
              size={32}
              color={CouleursPrimaires.bleuProfond}
            />
            <Text style={styles.texteAjout}>Ajouter</Text>
          </Pressable>
        )}

        {/* Photos existantes */}
        {photos.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.conteneurPhoto}>
            <Image
              source={{ uri }}
              style={styles.photo}
              resizeMode="cover"
              defaultSource={undefined}
            />
            {index === 0 && (
              <View style={styles.badgePrincipale}>
                <Text style={styles.texteBadgePrincipale}>Principale</Text>
              </View>
            )}
            <Pressable
              style={styles.boutonSupprimer}
              onPress={() => supprimerPhoto(index)}
            >
              <Ionicons
                name="close-circle"
                size={28}
                color={CouleursSemantiques.erreur}
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {erreur && <Text style={styles.erreur}>{erreur}</Text>}

      <Text style={styles.infoSupplement}>
        💡 Astuce : les photos sont enregistrées localement pour être
        affichées dans votre annonce.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginBottom: Espacements.lg,
  },
  libelle: {
    ...Typographie.corps,
    fontWeight: '600',
    color: CouleursNeutres.gris700,
    marginBottom: Espacements.xs,
  },
  obligatoire: {
    color: CouleursSemantiques.erreur,
  },
  description: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
    marginBottom: Espacements.md,
  },
  zoneSaisieUrl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CouleursNeutres.blancPur,
    borderRadius: Rayons.moyen,
    paddingHorizontal: Espacements.md,
    paddingVertical: Espacements.xs,
    borderWidth: 1.5,
    borderColor: CouleursPrimaires.bleuProfond,
    marginBottom: Espacements.md,
  },
  saisieUrl: {
    flex: 1,
    fontSize: 14,
    color: CouleursNeutres.gris900,
    paddingVertical: Espacements.sm,
  },
  boutonValiderUrl: {
    backgroundColor: CouleursPrimaires.bleuProfond,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Espacements.xs,
  },
  boutonAnnulerUrl: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Espacements.xs,
  },
  listePhotos: {
    paddingVertical: Espacements.sm,
  },
  boutonAjout: {
    width: 120,
    height: 120,
    borderRadius: Rayons.moyen,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: CouleursPrimaires.bleuProfond,
    backgroundColor: CouleursPrimaires.bleuProfond + '08',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Espacements.md,
  },
  texteAjout: {
    ...Typographie.legende,
    color: CouleursPrimaires.bleuProfond,
    marginTop: Espacements.xs,
    fontWeight: '700',
  },
  conteneurPhoto: {
    position: 'relative',
    width: 120,
    height: 120,
    marginRight: Espacements.md,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: Rayons.moyen,
    backgroundColor: CouleursNeutres.gris200,
  },
  badgePrincipale: {
    position: 'absolute',
    bottom: Espacements.xs,
    left: Espacements.xs,
    backgroundColor: CouleursPrimaires.bleuProfond,
    paddingHorizontal: Espacements.xs,
    paddingVertical: 2,
    borderRadius: Rayons.petit,
  },
  texteBadgePrincipale: {
    ...Typographie.legende,
    color: CouleursNeutres.blancPur,
    fontWeight: '700',
    fontSize: 10,
  },
  boutonSupprimer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: CouleursNeutres.blancPur,
    borderRadius: 14,
  },
  erreur: {
    ...Typographie.corpsPetit,
    color: CouleursSemantiques.erreur,
    marginTop: Espacements.xs,
  },
  infoSupplement: {
    ...Typographie.legende,
    color: CouleursNeutres.gris500,
    marginTop: Espacements.sm,
    fontStyle: 'italic',
  },
});

export default SelecteurPhoto;