/**
 * Fichier: Inscription.tsx
 * Description: Écran d'inscription permettant de créer un nouveau compte
 * utilisateur. Permet également de choisir son rôle (locataire ou propriétaire).
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParametresPileAuthentification } from '../../navigation/NavigationAuthentification';
import { utiliserContexteApp } from '../../magasin/ContexteApp';
import {
  CouleursNeutres,
  CouleursPrimaires,
  CouleursSemantiques,
  Espacements,
  Rayons,
} from '../../constantes/couleurs';
import { Typographie } from '../../constantes/typographie';
import Bouton from '../../composants/Bouton';
import ChampTexte from '../../composants/ChampTexte';
import { RoleUtilisateur } from '../../modeles/types';
import {
  validerChampObligatoire,
  validerEmail,
  validerMotDePasse,
} from '../../utilitaires/validation';

type Props = NativeStackScreenProps<ParametresPileAuthentification, 'Inscription'>;

/**
 * Écran d'inscription d'un nouvel utilisateur.
 */
const Inscription: React.FC<Props> = ({ navigation }) => {
  const { sinscrire } = utiliserContexteApp();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [roleChoisi, setRoleChoisi] = useState<RoleUtilisateur>('client');

  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [chargement, setChargement] = useState(false);

  /**
   * Valide tous les champs et procède à l'inscription.
   */
  const validerEtInscrire = async () => {
    const nouvellesErreurs: Record<string, string> = {};

    nouvellesErreurs.nom = validerChampObligatoire(nom, 'Nom');
    nouvellesErreurs.prenom = validerChampObligatoire(prenom, 'Prénom');

    if (!email.trim()) nouvellesErreurs.email = 'L\'email est obligatoire.';
    else if (!validerEmail(email))
      nouvellesErreurs.email = 'Le format de l\'email est invalide.';

    const erreurMdp = validerMotDePasse(motDePasse);
    if (erreurMdp) nouvellesErreurs.motDePasse = erreurMdp;
    else if (motDePasse !== confirmation)
      nouvellesErreurs.confirmation = 'Les mots de passe ne correspondent pas.';

    // Filtrage des erreurs vides
    const erreursFiltrees: Record<string, string> = {};
    Object.keys(nouvellesErreurs).forEach((cle) => {
      if (nouvellesErreurs[cle]) erreursFiltrees[cle] = nouvellesErreurs[cle];
    });

    setErreurs(erreursFiltrees);
    if (Object.keys(erreursFiltrees).length > 0) return;

    setChargement(true);
    try {
      await sinscrire({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim().toLowerCase(),
        telephone: telephone.trim() || undefined,
        motDePasse,
        role: roleChoisi,
      });
    } catch (erreur: any) {
      Alert.alert(
        'Échec de l\'inscription',
        erreur.message || 'Une erreur est survenue. Veuillez réessayer.'
      );
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
          {/* Bouton retour */}
          <Pressable style={styles.boutonRetour} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={CouleursNeutres.gris900} />
          </Pressable>

          <View style={styles.entete}>
            <Text style={styles.titre}>Créer un compte</Text>
            <Text style={styles.sousTitre}>
              Rejoignez la communauté AutoPartage en quelques secondes.
            </Text>
          </View>

          {/* Sélection du rôle */}
          <View style={styles.section}>
            <Text style={styles.libelleSection}>Je souhaite…</Text>
            <View style={styles.ligneRole}>
              <CarteRole
                titre="Louer un véhicule"
                description="Je cherche une voiture à louer pour mes déplacements."
                icone="search"
                selectionne={roleChoisi === 'client'}
                onPress={() => setRoleChoisi('client')}
              />
              <CarteRole
                titre="Mettre en location"
                description="Je possède un véhicule que je souhaite louer."
                icone="car-sport"
                selectionne={roleChoisi === 'loueur'}
                onPress={() => setRoleChoisi('loueur')}
              />
            </View>
          </View>

          {/* Formulaire d'inscription */}
          <View style={styles.section}>
            <View style={styles.ligneChamps}>
              <ChampTexte
                libelle="Prénom"
                value={prenom}
                onChangeText={setPrenom}
                placeholder="Jean"
                erreur={erreurs.prenom}
                obligatoire
                conteneurStyle={styles.champPetit}
              />
              <ChampTexte
                libelle="Nom"
                value={nom}
                onChangeText={setNom}
                placeholder="Dupont"
                erreur={erreurs.nom}
                obligatoire
                conteneurStyle={styles.champPetit}
              />
            </View>

            <ChampTexte
              libelle="Adresse email"
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.fr"
              type="email"
              erreur={erreurs.email}
              obligatoire
              autoCapitalize="none"
            />

            <ChampTexte
              libelle="Téléphone (optionnel)"
              value={telephone}
              onChangeText={setTelephone}
              placeholder="0612345678"
              type="telephone"
              erreur={erreurs.telephone}
            />

            <ChampTexte
              libelle="Mot de passe"
              value={motDePasse}
              onChangeText={setMotDePasse}
              placeholder="8 caractères minimum"
              type="motdepasse"
              erreur={erreurs.motDePasse}
              obligatoire
            />

            <ChampTexte
              libelle="Confirmation du mot de passe"
              value={confirmation}
              onChangeText={setConfirmation}
              placeholder="Retapez votre mot de passe"
              type="motdepasse"
              erreur={erreurs.confirmation}
              obligatoire
            />
          </View>

          <Bouton
            titre="Créer mon compte"
            onPress={validerEtInscrire}
            chargeur={chargement}
            pleineLargeur
          />

          {/* Lien vers la connexion */}
          <View style={styles.lienConnexion}>
            <Text style={styles.texteLien}>Déjà inscrit ?</Text>
            <Text style={styles.lien} onPress={() => navigation.navigate('Connexion')}>
              Se connecter
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/**
 * Composant interne : carte de sélection de rôle.
 */
const CarteRole: React.FC<{
  titre: string;
  description: string;
  icone: keyof typeof Ionicons.glyphMap;
  selectionne: boolean;
  onPress: () => void;
}> = ({ titre, description, icone, selectionne, onPress }) => (
  <Pressable
    style={[
      styles.carteRole,
      {
        borderColor: selectionne ? CouleursPrimaires.bleuProfond : CouleursNeutres.gris200,
        backgroundColor: selectionne ? CouleursPrimaires.bleuProfond + '10' : CouleursNeutres.blancPur,
      },
    ]}
    onPress={onPress}
  >
    <Ionicons
      name={icone}
      size={28}
      color={selectionne ? CouleursPrimaires.bleuProfond : CouleursNeutres.gris500}
    />
    <Text style={[styles.titreRole, selectionne && { color: CouleursPrimaires.bleuProfond }]}>
      {titre}
    </Text>
    <Text style={styles.descriptionRole}>{description}</Text>
    {selectionne && (
      <Ionicons
        name="checkmark-circle"
        size={20}
        color={CouleursPrimaires.bleuProfond}
        style={styles.checkRole}
      />
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CouleursNeutres.gris50,
  },
  flex: { flex: 1 },
  conteneur: {
    flexGrow: 1,
    padding: Espacements.xl,
    paddingTop: Espacements.md,
  },
  boutonRetour: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Espacements.md,
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
  section: {
    marginBottom: Espacements.lg,
  },
  libelleSection: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris800,
    marginBottom: Espacements.md,
  },
  ligneRole: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carteRole: {
    flex: 1,
    borderWidth: 2,
    borderRadius: Rayons.grand,
    padding: Espacements.lg,
    marginHorizontal: Espacements.xxs,
    alignItems: 'flex-start',
    position: 'relative',
  },
  titreRole: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris900,
    marginTop: Espacements.sm,
    marginBottom: Espacements.xs,
  },
  descriptionRole: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris500,
    lineHeight: 18,
  },
  checkRole: {
    position: 'absolute',
    top: Espacements.md,
    right: Espacements.md,
  },
  ligneChamps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  champPetit: {
    flex: 1,
    marginRight: Espacements.sm,
  },
  lienConnexion: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Espacements.xl,
  },
  texteLien: {
    ...Typographie.corps,
    color: CouleursNeutres.gris600,
  },
  lien: {
    ...Typographie.corps,
    color: CouleursPrimaires.bleuProfond,
    fontWeight: '700',
    marginLeft: Espacements.xs,
  },
});

export default Inscription;