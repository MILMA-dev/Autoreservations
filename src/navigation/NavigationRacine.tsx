/**
 * Fichier: NavigationRacine.tsx
 * Description: Navigateur racine de l'application.
 *
 * Structure :
 * - Pile racine :
 *   - Authentification : affichée si non connecté
 *   - Principale : contient la navigation à onglets + un écran modal
 *     "Détails véhicule" accessible depuis n'importe quel onglet
 *
 * Animations fluides configurées pour une expérience native :
 * - Transitions de pile : slide horizontal rapide
 * - Modales : slide vertical avec fondu
 * - Animations réduites sur les écrans de chargement
 */
import React from 'react';
import { NavigationContainer, Theme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Easing } from 'react-native';
import { utiliserContexteApp } from '../magasin/ContexteApp';
import Chargeur from '../composants/Chargeur';
import NavigationAuthentification from './NavigationAuthentification';
import NavigationPrincipal from './NavigationPrincipal';
import DetailsVehicule from '../ecrans/vehicule/DetailsVehicule';
import { CouleursPrimaires } from '../constantes/couleurs';

/**
 * Paramètres de la pile racine de l'application.
 */
export type ParametresPileRacine = {
  Authentification: undefined;
  Principale: undefined;
  DetailsVehicule: { identifiant: string };
};

const Pile = createNativeStackNavigator<ParametresPileRacine>();

/**
 * Configuration des transitions de pile pour des animations fluides.
 * Utilise des courbes d'accélération natives (iOS/Android).
 */
const config_animation_pile = {
  animation: 'slide_from_right' as const,
  animationDuration: 220,
  // Utilise une courbe d'animation douce pour fluidité
  // (Easing.bezier approximé par cubic standard)
};

/**
 * Configuration spécifique pour les écrans modaux.
 * Slide depuis le bas avec un fondu.
 */
const config_animation_modale = {
  animation: 'slide_from_bottom' as const,
  animationDuration: 280,
  presentation: 'modal' as const,
  gestureEnabled: true,
};

/**
 * Thème de navigation personnalisé (couleurs de la charte graphique).
 */
const themeNavigation: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: CouleursPrimaires.bleuProfond,
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#111827',
    border: '#E5E7EB',
    notification: '#EF4444',
  },
};

/**
 * Composant racine de la navigation.
 */
const NavigationRacine: React.FC = () => {
  const { estAuthentifie, chargementInitial } = utiliserContexteApp();

  // Écran de chargement pendant la restauration de session
  if (chargementInitial) {
    return <Chargeur message="Chargement de votre session…" pleinEcran />;
  }

  return (
    <NavigationContainer
      theme={themeNavigation}
      documentTitle={{
        formatter: () => 'AutoPartage',
      }}
    >
      <Pile.Navigator
        screenOptions={{
          headerShown: false,
          ...config_animation_pile,
        }}
      >
        {estAuthentifie ? (
          <>
            {/* Écran principal : onglets + détails accessibles globalement */}
            <Pile.Screen
              name="Principale"
              component={NavigationPrincipal}
              options={{
                animation: 'fade',
                animationDuration: 180,
              }}
            />
            <Pile.Screen
              name="DetailsVehicule"
              component={DetailsVehicule}
              options={config_animation_modale}
            />
          </>
        ) : (
          <Pile.Screen
            name="Authentification"
            component={NavigationAuthentification}
            options={{
              animation: 'fade',
              animationDuration: 250,
            }}
          />
        )}
      </Pile.Navigator>
    </NavigationContainer>
  );
};

export default NavigationRacine;
// Réexport pour usage externe si nécessaire
export { Easing };