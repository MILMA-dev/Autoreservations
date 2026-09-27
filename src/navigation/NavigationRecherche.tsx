/**
 * Fichier: NavigationRecherche.tsx
 * Description: Pile de navigation interne à l'onglet "Rechercher" qui
 * permet de naviguer de la liste vers les détails d'un véhicule.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Rechercher, { ParametresPileRecherche } from '../ecrans/accueil/Rechercher';
import DetailsVehicule from '../ecrans/vehicule/DetailsVehicule';

const Pile = createNativeStackNavigator<ParametresPileRecherche>();

/**
 * Navigateur de l'onglet de recherche.
 */
const NavigationRecherche: React.FC = () => {
  return (
    <Pile.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Pile.Screen name="RechercheListe" component={Rechercher} />
      <Pile.Screen name="DetailsVehicule" component={DetailsVehicule} />
    </Pile.Navigator>
  );
};

export default NavigationRecherche;
export type { ParametresPileRecherche };