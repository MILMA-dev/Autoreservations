/**
 * Fichier: NavigationAuthentification.tsx
 * Description: Pile de navigation affichée lorsque l'utilisateur n'est
 * pas connecté. Contient l'écran de connexion et celui d'inscription.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Connexion from '../ecrans/authentification/Connexion';
import Inscription from '../ecrans/authentification/Inscription';

/**
 * Paramètres de la pile d'authentification.
 */
export type ParametresPileAuthentification = {
  Connexion: undefined;
  Inscription: undefined;
};

const Pile = createNativeStackNavigator<ParametresPileAuthentification>();

/**
 * Navigateur d'authentification.
 */
const NavigationAuthentification: React.FC = () => {
  return (
    <Pile.Navigator
      initialRouteName="Connexion"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Pile.Screen name="Connexion" component={Connexion} />
      <Pile.Screen name="Inscription" component={Inscription} />
    </Pile.Navigator>
  );
};

export default NavigationAuthentification;