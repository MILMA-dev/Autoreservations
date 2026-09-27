/**
 * Fichier: CarteVehicule.tsx
 * Description: Composant carte représentant un véhicule dans une liste.
 * Affiche l'image, les informations principales et le prix journalier.
 */
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CouleursNeutres, CouleursPrimaires, Espacements, Ombres, Rayons } from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';
import { Vehicule } from '../modeles/types';
import { formaterPrix } from '../utilitaires/formatage';
import { CATEGORIES_VEHICULES } from '../constantes/configuration';

/**
 * Propriétés du composant CarteVehicule.
 */
interface PropsCarteVehicule {
  vehicule: Vehicule;
  onPress: () => void;
}

/**
 * Carte affichant un véhicule dans une liste (catalogue, mes véhicules).
 */
const CarteVehicule: React.FC<PropsCarteVehicule> = ({ vehicule, onPress }) => {
  const categorie = CATEGORIES_VEHICULES.find((c) => c.identifiant === vehicule.categorie);

  return (
    <Pressable
      style={({ pressed }) => [styles.carte, { opacity: pressed ? 0.9 : 1 }]}
      onPress={onPress}
    >
      {/* Image principale du véhicule */}
      <View style={styles.conteneurImage}>
        {vehicule.photos.length > 0 ? (
          <Image
            source={{ uri: vehicule.photos[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.textePlaceholder}>Photo indisponible</Text>
          </View>
        )}
        {/* Badge de catégorie */}
        <View style={styles.badge}>
          <Text style={styles.texteBadge}>{categorie?.libelle || vehicule.categorie}</Text>
        </View>
      </View>

      {/* Corps de la carte avec les informations */}
      <View style={styles.corps}>
        <Text style={styles.titre} numberOfLines={1}>
          {vehicule.marque} {vehicule.modele}
        </Text>
        <Text style={styles.sousTitre}>
          {vehicule.annee} • {vehicule.ville}
        </Text>

        <View style={styles.detailsLigne}>
          <Text style={styles.detail}>{vehicule.carburant}</Text>
          <Text style={styles.separateur}>•</Text>
          <Text style={styles.detail}>
            {vehicule.transmission === 'automatique' ? 'Automatique' : 'Manuelle'}
          </Text>
          <Text style={styles.separateur}>•</Text>
          <Text style={styles.detail}>{vehicule.nombrePlaces} places</Text>
        </View>

        {/* Prix journalier en évidence */}
        <View style={styles.pied}>
          <Text style={styles.prix}>{formaterPrix(vehicule.prixParJour)}</Text>
          <Text style={styles.prixUnite}> / jour</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  carte: {
    backgroundColor: CouleursNeutres.blancPur,
    borderRadius: Rayons.grand,
    marginBottom: Espacements.lg,
    overflow: 'hidden',
    ...Ombres.moyenne,
  },
  conteneurImage: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: CouleursNeutres.gris200,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textePlaceholder: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
  },
  badge: {
    position: 'absolute',
    top: Espacements.md,
    left: Espacements.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: Espacements.md,
    paddingVertical: Espacements.xs,
    borderRadius: Rayons.petit,
  },
  texteBadge: {
    ...Typographie.legende,
    color: CouleursPrimaires.bleuProfond,
  },
  corps: {
    padding: Espacements.lg,
  },
  titre: {
    ...Typographie.titreCarte,
    color: CouleursNeutres.gris900,
    marginBottom: Espacements.xxs,
  },
  sousTitre: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
    marginBottom: Espacements.md,
  },
  detailsLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Espacements.md,
  },
  detail: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris600,
  },
  separateur: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris300,
    marginHorizontal: Espacements.sm,
  },
  pied: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingTop: Espacements.md,
    borderTopWidth: 1,
    borderTopColor: CouleursNeutres.gris100,
  },
  prix: {
    ...Typographie.sousTitre,
    fontSize: 22,
    color: CouleursPrimaires.bleuProfond,
  },
  prixUnite: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
  },
});

export default CarteVehicule;