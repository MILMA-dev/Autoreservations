/**
 * Fichier: Profil.tsx
 * Description: Écran de profil utilisateur. Affiche les informations du
 * compte, permet de basculer de rôle (pour la démonstration) et de se déconnecter.
 */
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { utiliserContexteApp } from '../../magasin/ContexteApp';
import { RoleUtilisateur } from '../../modeles/types';
import {
  CouleursNeutres,
  CouleursPrimaires,
  CouleursSemantiques,
  Espacements,
  Rayons,
} from '../../constantes/couleurs';
import { Typographie } from '../../constantes/typographie';
import Bouton from '../../composants/Bouton';
import EnTete from '../../composants/EnTete';
import { formaterDate } from '../../utilitaires/formatage';

/**
 * Écran de profil de l'utilisateur connecté.
 */
const Profil: React.FC = () => {
  const {
    utilisateurConnecte,
    role,
    seDeconnecter,
    basculerRole,
  } = utiliserContexteApp();

  /**
   * Confirme la déconnexion.
   */
  const confirmerDeconnexion = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => seDeconnecter(),
        },
      ]
    );
  };

  /**
   * Bascule le rôle de l'utilisateur (client ↔ loueur).
   */
  const changerDeRole = async (nouveauRole: RoleUtilisateur) => {
    if (role === nouveauRole) return;
    Alert.alert(
      'Changer de rôle',
      `Basculer vers le mode "${nouveauRole === 'client' ? 'Locataire' : 'Propriétaire'}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            await basculerRole(nouveauRole);
            Alert.alert('Rôle modifié', `Vous êtes maintenant en mode ${nouveauRole === 'client' ? 'Locataire' : 'Propriétaire'}.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.conteneur}>
        <EnTete titre="Mon profil" />

        {/* Carte d'identité principale */}
        <View style={styles.carteIdentite}>
          <View style={styles.avatarGrand}>
            <Text style={styles.initiales}>
              {utilisateurConnecte?.prenom.charAt(0)}
              {utilisateurConnecte?.nom.charAt(0)}
            </Text>
          </View>
          <Text style={styles.nomComplet}>
            {utilisateurConnecte?.prenom} {utilisateurConnecte?.nom}
          </Text>
          <Text style={styles.email}>{utilisateurConnecte?.email}</Text>
          {utilisateurConnecte?.telephone && (
            <Text style={styles.telephone}>{utilisateurConnecte.telephone}</Text>
          )}
          {utilisateurConnecte?.dateInscription && (
            <Text style={styles.dateInscription}>
              Membre depuis {formaterDate(utilisateurConnecte.dateInscription)}
            </Text>
          )}
          <View
            style={[
              styles.badgeRole,
              {
                backgroundColor:
                  role === 'loueur' ? CouleursPrimaires.bleuProfond : CouleursPrimaires.orangeVif,
              },
            ]}
          >
            <Text style={styles.texteBadgeRole}>
              {role === 'loueur' ? 'Propriétaire' : 'Locataire'}
            </Text>
          </View>
        </View>

        {/* Section : changer de rôle (démonstration) */}
        <View style={styles.section}>
          <Text style={styles.titreSection}>Mode d'utilisation</Text>
          <Text style={styles.descriptionSection}>
            Basculez entre les modes pour explorer les deux côtés de l'application.
          </Text>
          <View style={styles.ligneRoles}>
            <CarteRole
              titre="Locataire"
              description="Je cherche à louer"
              icone="search"
              selectionne={role === 'client'}
              onPress={() => changerDeRole('client')}
            />
            <CarteRole
              titre="Propriétaire"
              description="Je propose mes véhicules"
              icone="car-sport"
              selectionne={role === 'loueur'}
              onPress={() => changerDeRole('loueur')}
            />
          </View>
        </View>

        {/* Section : paramètres */}
        <View style={styles.section}>
          <Text style={styles.titreSection}>Paramètres</Text>
          <OptionMenu
            icone="person-outline"
            titre="Informations personnelles"
            description="Modifier mon profil"
            onPress={() => Alert.alert('Bientôt disponible', 'Cette fonctionnalité sera ajoutée prochainement.')}
          />
          <OptionMenu
            icone="notifications-outline"
            titre="Notifications"
            description="Gérer mes alertes"
            onPress={() => Alert.alert('Bientôt disponible', 'Cette fonctionnalité sera ajoutée prochainement.')}
          />
          <OptionMenu
            icone="shield-checkmark-outline"
            titre="Sécurité et confidentialité"
            description="Mot de passe, données personnelles"
            onPress={() => Alert.alert('Bientôt disponible', 'Cette fonctionnalité sera ajoutée prochainement.')}
          />
          <OptionMenu
            icone="help-circle-outline"
            titre="Aide et support"
            description="Contacter l'équipe AutoPartage"
            onPress={() => Alert.alert('Support', 'Contactez-nous à support@autopartage.fr')}
          />
          <OptionMenu
            icone="document-text-outline"
            titre="Conditions générales"
            description="CGU et politique de confidentialité"
            onPress={() => Alert.alert('Informations légales', 'L\'utilisation de ce service implique l\'acceptation des CGU.')}
          />
        </View>

        {/* Bouton de déconnexion */}
        <Bouton
          titre="Se déconnecter"
          onPress={confirmerDeconnexion}
          variante="danger"
          pleineLargeur
          style={styles.boutonDeconnexion}
          iconeGauche={
            <Ionicons name="log-out-outline" size={18} color={CouleursNeutres.blancPur} />
          }
        />

        {/* Version de l'app */}
        <Text style={styles.version}>AutoPartage v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Carte de sélection de rôle.
 */
const CarteRole: React.FC<{
  titre: string;
  description: string;
  icone: keyof typeof Ionicons.glyphMap;
  selectionne: boolean;
  onPress: () => void;
}> = ({ titre, description, icone, selectionne, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.carteRole,
      {
        borderColor: selectionne ? CouleursPrimaires.bleuProfond : CouleursNeutres.gris200,
        backgroundColor: selectionne
          ? CouleursPrimaires.bleuProfond + '10'
          : CouleursNeutres.blancPur,
      },
    ]}
  >
    <Ionicons
      name={icone}
      size={24}
      color={selectionne ? CouleursPrimaires.bleuProfond : CouleursNeutres.gris500}
    />
    <Text
      style={[
        styles.titreCarteRole,
        selectionne && { color: CouleursPrimaires.bleuProfond },
      ]}
    >
      {titre}
    </Text>
    <Text style={styles.descriptionCarteRole}>{description}</Text>
  </Pressable>
);

/**
 * Option de menu avec icône.
 */
const OptionMenu: React.FC<{
  icone: keyof typeof Ionicons.glyphMap;
  titre: string;
  description: string;
  onPress: () => void;
}> = ({ icone, titre, description, onPress }) => (
  <Pressable style={styles.optionMenu} onPress={onPress}>
    <View style={styles.iconeOption}>
      <Ionicons name={icone} size={20} color={CouleursPrimaires.bleuProfond} />
    </View>
    <View style={styles.contenuOption}>
      <Text style={styles.titreOption}>{titre}</Text>
      <Text style={styles.descriptionOption}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={CouleursNeutres.gris400} />
  </Pressable>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CouleursNeutres.gris50,
  },
  conteneur: {
    paddingBottom: Espacements.xxxl,
  },
  carteIdentite: {
    backgroundColor: CouleursNeutres.blancPur,
    marginHorizontal: Espacements.xl,
    padding: Espacements.xl,
    borderRadius: Rayons.grand,
    alignItems: 'center',
    marginBottom: Espacements.xl,
  },
  avatarGrand: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: CouleursPrimaires.bleuProfond,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Espacements.md,
  },
  initiales: {
    ...Typographie.titreSection,
    fontSize: 32,
    color: CouleursNeutres.blancPur,
  },
  nomComplet: {
    ...Typographie.titreCarte,
    color: CouleursNeutres.gris900,
    marginBottom: Espacements.xxs,
  },
  email: {
    ...Typographie.corps,
    color: CouleursNeutres.gris600,
  },
  telephone: {
    ...Typographie.corps,
    color: CouleursNeutres.gris600,
    marginTop: Espacements.xxs,
  },
  dateInscription: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
    marginTop: Espacements.sm,
  },
  badgeRole: {
    marginTop: Espacements.md,
    paddingHorizontal: Espacements.lg,
    paddingVertical: Espacements.xs,
    borderRadius: Rayons.circulaire,
  },
  texteBadgeRole: {
    ...Typographie.legende,
    fontWeight: '700',
    color: CouleursNeutres.blancPur,
  },
  section: {
    marginHorizontal: Espacements.xl,
    marginBottom: Espacements.xl,
  },
  titreSection: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris900,
    marginBottom: Espacements.xs,
  },
  descriptionSection: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
    marginBottom: Espacements.md,
  },
  ligneRoles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carteRole: {
    flex: 1,
    borderWidth: 2,
    borderRadius: Rayons.moyen,
    padding: Espacements.md,
    marginHorizontal: Espacements.xxs,
    alignItems: 'center',
  },
  titreCarteRole: {
    ...Typographie.corps,
    fontWeight: '700',
    color: CouleursNeutres.gris900,
    marginTop: Espacements.sm,
  },
  descriptionCarteRole: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
    textAlign: 'center',
    marginTop: Espacements.xxs,
  },
  optionMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CouleursNeutres.blancPur,
    padding: Espacements.md,
    borderRadius: Rayons.moyen,
    marginBottom: Espacements.sm,
  },
  iconeOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CouleursPrimaires.bleuProfond + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Espacements.md,
  },
  contenuOption: {
    flex: 1,
  },
  titreOption: {
    ...Typographie.corps,
    fontWeight: '600',
    color: CouleursNeutres.gris900,
    marginBottom: 2,
  },
  descriptionOption: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
  },
  boutonDeconnexion: {
    marginHorizontal: Espacements.xl,
    marginBottom: Espacements.lg,
  },
  version: {
    ...Typographie.legende,
    color: CouleursNeutres.gris400,
    textAlign: 'center',
  },
});

export default Profil;