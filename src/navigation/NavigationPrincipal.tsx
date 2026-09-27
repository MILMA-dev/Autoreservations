/**
 * Fichier: NavigationPrincipal.tsx
 * Description: Barre de navigation inférieure avec les onglets principaux.
 * Les onglets affichés varient selon le rôle de l'utilisateur connecté :
 * - Client (locataire) : Accueil, Rechercher, Mes réservations, Profil
 * - Loueur (propriétaire) : Accueil, Mes véhicules, Ajouter, Réservations, Profil
 *
 * L'onglet "Rechercher" est lui-même une pile interne (liste → détails)
 * pour permettre une navigation fluide entre la liste et le détail d'un véhicule.
 */
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CouleursNeutres, CouleursPrimaires, Espacements } from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';
import { utiliserContexteApp } from '../magasin/ContexteApp';
import Accueil from '../ecrans/accueil/Accueil';
import NavigationRecherche from './NavigationRecherche';
import MesVehicules from '../ecrans/vehicule/MesVehicules';
import AjouterVehicule from '../ecrans/vehicule/AjouterVehicule';
import MesReservations from '../ecrans/reservation/MesReservations';
import ReservationsLoueur from '../ecrans/reservation/ReservationsLoueur';
import Profil from '../ecrans/profil/Profil';

/**
 * Définit les paramètres de la barre d'onglets.
 */
export type ParametresOnglets = {
  Accueil: undefined;
  Recherche: undefined;
  MesVehicules: undefined;
  AjouterVehicule: undefined;
  MesReservations: undefined;
  ReservationsLoueur: undefined;
  Profil: undefined;
};

const Onglet = createBottomTabNavigator<ParametresOnglets>();

/**
 * Composant d'icône d'onglet personnalisé avec badge pour les notifications.
 */
const IconeOnglet: React.FC<{
  nom: keyof typeof Ionicons.glyphMap;
  couleur: string;
  focus: boolean;
}> = ({ nom, couleur, focus }) => (
  <View style={styles.conteneurIcone}>
    <Ionicons name={nom} size={focus ? 26 : 24} color={couleur} />
  </View>
);

/**
 * Composant d'étiquette d'onglet.
 */
const EtiquetteOnglet: React.FC<{ titre: string; focus: boolean }> = ({ titre, focus }) => (
  <Text
    style={[
      styles.texteOnglet,
      {
        color: focus ? CouleursPrimaires.bleuProfond : CouleursNeutres.gris500,
        fontWeight: focus ? '700' : '500',
      },
    ]}
    numberOfLines={1}
  >
    {titre}
  </Text>
);

/**
 * Navigation principale à onglets de l'application.
 */
const NavigationPrincipal: React.FC = () => {
  const { role, reservationsAValider } = utiliserContexteApp();
  const estLoueur = role === 'loueur';

  // Nombre de réservations en attente à afficher en badge
  const nombreEnAttente = reservationsAValider.length;

  return (
    <Onglet.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: CouleursPrimaires.bleuProfond,
        tabBarInactiveTintColor: CouleursNeutres.gris500,
        tabBarStyle: styles.barreOnglets,
        tabBarLabel: ({ focused }) => null,
        tabBarHideOnKeyboard: true,
        // Animation fluide au switch entre onglets (crossfade rapide)
        animation: 'shift',
        // Désactive le lazy loading pour une navigation instantanée
        lazy: false,
      }}
    >
      {/* Onglet Accueil - Toujours présent */}
      <Onglet.Screen
        name="Accueil"
        component={Accueil}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconeOnglet nom={focused ? 'home' : 'home-outline'} couleur={color} focus={focused} />
          ),
          tabBarLabel: ({ focused }) => <EtiquetteOnglet titre="Accueil" focus={focused} />,
        }}
      />

      {/* Onglet Recherche - Pour le client uniquement, utilise une pile interne */}
      {!estLoueur && (
        <Onglet.Screen
          name="Recherche"
          component={NavigationRecherche}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <IconeOnglet nom={focused ? 'search' : 'search-outline'} couleur={color} focus={focused} />
            ),
            tabBarLabel: ({ focused }) => <EtiquetteOnglet titre="Rechercher" focus={focused} />,
          }}
        />
      )}

      {/* Onglets Loueur : Mes véhicules + Ajouter */}
      {estLoueur && (
        <>
          <Onglet.Screen
            name="MesVehicules"
            component={MesVehicules}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <IconeOnglet
                  nom={focused ? 'car-sport' : 'car-sport-outline'}
                  couleur={color}
                  focus={focused}
                />
              ),
              tabBarLabel: ({ focused }) => <EtiquetteOnglet titre="Mes véhicules" focus={focused} />,
            }}
          />
          <Onglet.Screen
            name="AjouterVehicule"
            component={AjouterVehicule}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <IconeOnglet nom="add-circle" couleur={color} focus={focused} />
              ),
              tabBarLabel: ({ focused }) => <EtiquetteOnglet titre="Ajouter" focus={focused} />,
            }}
          />
        </>
      )}

      {/* Onglets Réservations - Adaptés au rôle */}
      {estLoueur ? (
        <Onglet.Screen
          name="ReservationsLoueur"
          component={ReservationsLoueur}
          options={{
            tabBarBadge: nombreEnAttente > 0 ? nombreEnAttente : undefined,
            tabBarBadgeStyle: styles.badge,
            tabBarIcon: ({ color, focused }) => (
              <IconeOnglet
                nom={focused ? 'calendar' : 'calendar-outline'}
                couleur={color}
                focus={focused}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <EtiquetteOnglet titre="Réservations" focus={focused} />
            ),
          }}
        />
      ) : (
        <Onglet.Screen
          name="MesReservations"
          component={MesReservations}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <IconeOnglet
                nom={focused ? 'calendar' : 'calendar-outline'}
                couleur={color}
                focus={focused}
              />
            ),
            tabBarLabel: ({ focused }) => <EtiquetteOnglet titre="Mes locations" focus={focused} />,
          }}
        />
      )}

      {/* Onglet Profil - Toujours présent */}
      <Onglet.Screen
        name="Profil"
        component={Profil}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconeOnglet
              nom={focused ? 'person' : 'person-outline'}
              couleur={color}
              focus={focused}
            />
          ),
          tabBarLabel: ({ focused }) => <EtiquetteOnglet titre="Profil" focus={focused} />,
        }}
      />
    </Onglet.Navigator>
  );
};

const styles = StyleSheet.create({
  barreOnglets: {
    backgroundColor: CouleursNeutres.blancPur,
    borderTopWidth: 1,
    borderTopColor: CouleursNeutres.gris100,
    height: Platform.OS === 'ios' ? 85 : 70,
    paddingTop: Espacements.sm,
    paddingBottom: Platform.OS === 'ios' ? Espacements.xxl : Espacements.sm,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  conteneurIcone: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  texteOnglet: {
    ...Typographie.legende,
    marginTop: Espacements.xxs,
  },
  badge: {
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default NavigationPrincipal;