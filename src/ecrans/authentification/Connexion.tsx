/**
 * Fichier: Connexion.tsx
 * Description: Écran de connexion permettant à un utilisateur existant de
 * s'authentifier avec son email et son mot de passe. Propose également
 * un accès à l'écran d'inscription.
 */
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  Espacements,
  Rayons,
} from '../../constantes/couleurs';
import { Typographie } from '../../constantes/typographie';
import Bouton from '../../composants/Bouton';
import ChampTexte from '../../composants/ChampTexte';

type Props = NativeStackScreenProps<ParametresPileAuthentification, 'Connexion'>;

/**
 * Écran de connexion.
 */
const Connexion: React.FC<Props> = ({ navigation }) => {
  const { seConnecter } = utiliserContexteApp();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreurEmail, setErreurEmail] = useState('');
  const [erreurMotDePasse, setErreurMotDePasse] = useState('');
  const [chargement, setChargement] = useState(false);

  /**
   * Valide les champs puis déclenche la connexion.
   */
  const validerEtConnecter = async () => {
    // Réinitialisation des erreurs
    setErreurEmail('');
    setErreurMotDePasse('');

    // Validation locale
    let valide = true;
    if (!email.trim()) {
      setErreurEmail('Veuillez saisir votre adresse email.');
      valide = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErreurEmail('Le format de l\'email est invalide.');
      valide = false;
    }
    if (!motDePasse) {
      setErreurMotDePasse('Veuillez saisir votre mot de passe.');
      valide = false;
    }
    if (!valide) return;

    setChargement(true);
    try {
      await seConnecter({ email: email.trim().toLowerCase(), motDePasse });
    } catch (erreur: any) {
      Alert.alert('Échec de la connexion', erreur.message || 'Identifiants incorrects.');
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
          {/* En-tête avec logo et titre */}
          <View style={styles.entete}>
            <View style={styles.logo}>
              <Ionicons name="car-sport" size={40} color={CouleursNeutres.blancPur} />
            </View>
            <Text style={styles.titreApp}>AutoPartage</Text>
            <Text style={styles.sousTitreApp}>
              La plateforme multi-vendeurs de location de voitures
            </Text>
          </View>

          {/* Formulaire de connexion */}
          <View style={styles.formulaire}>
            <Text style={styles.titreFormulaire}>Connexion</Text>
            <Text style={styles.descriptionFormulaire}>
              Connectez-vous pour accéder à votre espace personnel.
            </Text>

            <View style={styles.champs}>
              <ChampTexte
                libelle="Adresse email"
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.fr"
                type="email"
                erreur={erreurEmail}
                obligatoire
                autoCapitalize="none"
                autoCorrect={false}
                iconeGauche={
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={CouleursNeutres.gris500}
                  />
                }
              />
              <ChampTexte
                libelle="Mot de passe"
                value={motDePasse}
                onChangeText={setMotDePasse}
                placeholder="Votre mot de passe"
                type="motdepasse"
                erreur={erreurMotDePasse}
                obligatoire
                iconeGauche={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={CouleursNeutres.gris500}
                  />
                }
              />
            </View>

            <Bouton
              titre="Se connecter"
              onPress={validerEtConnecter}
              chargeur={chargement}
              pleineLargeur
            />

            {/* Lien vers l'inscription */}
            <View style={styles.lienInscription}>
              <Text style={styles.texteLien}>Pas encore de compte ?</Text>
              <Text
                style={styles.lien}
                onPress={() => navigation.navigate('Inscription')}
              >
                Créer un compte
              </Text>
            </View>
          </View>

          {/* Section d'aide à la démonstration */}
          <View style={styles.aide}>
            <Text style={styles.titreAide}>Comptes de démonstration (Cameroun)</Text>
            <Text style={styles.ligneAide}>👤 Client : lucas.essomba@autopartage.cm</Text>
            <Text style={styles.ligneAide}>🏪 Loueur : jean.mbarga@autopartage.cm</Text>
            <Text style={styles.ligneAide}>🏪 Loueur : sylvie.ngobessala@autopartage.cm</Text>
            <Text style={styles.ligneAide}>🔑 Mot de passe : demo1234</Text>
            <Text style={styles.ligneAide}>💰 Tarifs affichés en FCFA</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CouleursNeutres.gris50,
  },
  flex: {
    flex: 1,
  },
  conteneur: {
    flexGrow: 1,
    paddingHorizontal: Espacements.xl,
    paddingTop: Espacements.xxxl,
    paddingBottom: Espacements.xl,
  },
  entete: {
    alignItems: 'center',
    marginBottom: Espacements.xxxl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CouleursPrimaires.bleuProfond,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Espacements.lg,
    shadowColor: CouleursPrimaires.bleuProfond,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  titreApp: {
    ...Typographie.titrePrincipal,
    color: CouleursPrimaires.bleuProfond,
    marginBottom: Espacements.xs,
  },
  sousTitreApp: {
    ...Typographie.corps,
    color: CouleursNeutres.gris500,
    textAlign: 'center',
  },
  formulaire: {
    backgroundColor: CouleursNeutres.blancPur,
    borderRadius: Rayons.grand,
    padding: Espacements.xxl,
    marginBottom: Espacements.xl,
  },
  titreFormulaire: {
    ...Typographie.titreSection,
    color: CouleursNeutres.gris900,
    marginBottom: Espacements.xs,
  },
  descriptionFormulaire: {
    ...Typographie.corps,
    color: CouleursNeutres.gris500,
    marginBottom: Espacements.xl,
  },
  champs: {
    marginBottom: Espacements.lg,
  },
  lienInscription: {
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
  aide: {
    backgroundColor: CouleursNeutres.gris100,
    borderRadius: Rayons.moyen,
    padding: Espacements.lg,
    borderLeftWidth: 4,
    borderLeftColor: CouleursPrimaires.bleuClair,
  },
  titreAide: {
    ...Typographie.sousTitre,
    color: CouleursNeutres.gris800,
    marginBottom: Espacements.sm,
  },
  ligneAide: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris600,
    marginBottom: Espacements.xs,
  },
});

export default Connexion;