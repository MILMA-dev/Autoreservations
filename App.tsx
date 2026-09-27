/**
 * Fichier: App.tsx
 * Description: Point d'entrée principal de l'application AutoPartage.
 *
 * Ce fichier :
 * 1. Précharge les polices d'icônes (obligatoire pour le rendu web).
 * 2. Configure le provider de contexte global de l'application.
 * 3. Initialise le navigateur racine qui gère la navigation.
 *
 * L'application est une plateforme multi-vendeurs de location de voitures
 * avec deux rôles : locataire (client) et propriétaire (loueur).
 * Architecture modulaire par domaines (authentification, véhicules,
 * réservations, profil) avec charte graphique professionnelle.
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import { FournisseurContexteApp } from './src/magasin/ContexteApp';
import NavigationRacine from './src/navigation/NavigationRacine';

/**
 * Composant racine de l'application.
 */
const App: React.FC = () => {
  // Préchargement des polices d'icônes pour un rendu correct
  const [policesChargees] = useFonts({
    ...Ionicons.font,
  });

  // Attendre le chargement des polices avant d'afficher l'interface
  if (!policesChargees) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.conteneurRacine}>
      <SafeAreaProvider>
        {/* Provider de contexte global (authentification, données) */}
        <FournisseurContexteApp>
          {/* Navigation racine (authentification ou application principale) */}
          <NavigationRacine />
          <StatusBar style="dark" />
        </FournisseurContexteApp>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  conteneurRacine: {
    flex: 1,
  },
});

export default App;