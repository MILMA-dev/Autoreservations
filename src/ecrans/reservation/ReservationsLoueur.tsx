/**
 * Fichier: ReservationsLoueur.tsx
 * Description: Écran listant les réservations concernant les véhicules
 * du propriétaire. Permet la validation ou le refus des demandes en attente.
 * C'est le cœur du workflow de validation manuelle côté propriétaire.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { utiliserContexteApp } from '../../magasin/ContexteApp';
import {
  CouleursNeutres,
  CouleursPrimaires,
  CouleursSemantiques,
  Espacements,
} from '../../constantes/couleurs';
import { Typographie } from '../../constantes/typographie';
import CarteReservation from '../../composants/CarteReservation';
import Chargeur from '../../composants/Chargeur';
import EtatVide from '../../composants/EtatVide';
import EnTete from '../../composants/EnTete';
import Bouton from '../../composants/Bouton';
import ModalConfirmation from '../../composants/ModalConfirmation';
import IndicateurStatut from '../../composants/IndicateurStatut';
import { UTILISATEURS_MOCK } from '../../services/donneesMock';
import { VEHICULES_MOCK } from '../../services/donneesMock';
import { Reservation, StatutReservation, Utilisateur, Vehicule } from '../../modeles/types';

type OngletFiltre = 'tous' | 'en_attente' | 'validee' | 'refusee';

/**
 * Écran de gestion des réservations pour le propriétaire.
 */
const ReservationsLoueur: React.FC = () => {
  const {
    mesReservations,
    reservationsAValider,
    chargerReservations,
    validerReservation,
    refuserReservation,
  } = utiliserContexteApp();
  const [rafraichissement, setRafraichissement] = useState(false);
  const [ongletActif, setOngletActif] = useState<OngletFiltre>('en_attente');

  // État pour la modal d'action
  const [actionEnCours, setActionEnCours] = useState<{
    type: 'valider' | 'refuser';
    reservation: Reservation;
  } | null>(null);
  const [traitementEnCours, setTraitementEnCours] = useState(false);

  useEffect(() => {
    chargerReservations();
  }, []);

  /**
   * Gère le pull-to-refresh.
   */
  const gererRafraichissement = useCallback(async () => {
    setRafraichissement(true);
    await chargerReservations();
    setRafraichissement(false);
  }, [chargerReservations]);

  /**
   * Récupère le véhicule et le client d'une réservation.
   */
  const obtenirDetailsReservation = (reservation: Reservation) => {
    const vehicule = VEHICULES_MOCK.find((v) => v.identifiant === reservation.vehiculeId);
    const client = UTILISATEURS_MOCK.find((u) => u.identifiant === reservation.clientId);
    return { vehicule, client };
  };

  /**
   * Filtre les réservations selon l'onglet actif.
   */
  const reservationsFiltrees = React.useMemo(() => {
    let liste = [...mesReservations];
    if (ongletActif !== 'tous') {
      liste = liste.filter((r) => r.statut === ongletActif);
    }
    // Les loueurs voient les réservations où ils sont le propriétaire
    return liste;
  }, [mesReservations, ongletActif]);

  /**
   * Exécute la validation ou le refus après confirmation.
   */
  const executerAction = async (message?: string) => {
    if (!actionEnCours) return;
    setTraitementEnCours(true);
    try {
      if (actionEnCours.type === 'valider') {
        await validerReservation(actionEnCours.reservation.identifiant, message);
        Alert.alert(
          'Réservation validée',
          'Le client a été informé de votre validation.'
        );
      } else {
        if (!message || message.trim() === '') {
          Alert.alert('Raison requise', 'Veuillez indiquer une raison de refus.');
          setTraitementEnCours(false);
          return;
        }
        await refuserReservation(actionEnCours.reservation.identifiant, message);
        Alert.alert('Réservation refusée', 'Le client a été informé de votre décision.');
      }
      setActionEnCours(null);
    } catch (erreur: any) {
      Alert.alert('Erreur', erreur.message || 'Action impossible.');
    } finally {
      setTraitementEnCours(false);
    }
  };

  // Compteurs par statut
  const compteurs = {
    enAttente: mesReservations.filter((r) => r.statut === 'en_attente').length,
    validees: mesReservations.filter((r) => r.statut === 'validee').length,
    refusees: mesReservations.filter((r) => r.statut === 'refusee').length,
    total: mesReservations.length,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={reservationsFiltrees}
        keyExtractor={(item) => item.identifiant}
        renderItem={({ item }) => {
          const { vehicule, client } = obtenirDetailsReservation(item);
          const peutAgir = item.statut === 'en_attente';
          return (
            <View>
              <CarteReservation
                reservation={item}
                vehicule={vehicule}
                nomInterlocuteur={client ? `${client.prenom} ${client.nom}` : undefined}
              />
              {/* Message du client si présent */}
              {item.messageClient && (
                <View style={styles.carteMessage}>
                  <Text style={styles.libelleMessage}>Message du client</Text>
                  <Text style={styles.texteMessage}>« {item.messageClient} »</Text>
                </View>
              )}
              {/* Réponse du loueur si présente */}
              {item.messageLoueur && (
                <View
                  style={[
                    styles.carteMessage,
                    {
                      backgroundColor:
                        item.statut === 'validee'
                          ? CouleursSemantiques.succesDoux
                          : CouleursSemantiques.erreurDouce,
                    },
                  ]}
                >
                  <Text style={styles.libelleMessage}>Votre réponse</Text>
                  <Text style={styles.texteMessage}>« {item.messageLoueur} »</Text>
                </View>
              )}
              {/* Actions de validation */}
              {peutAgir && (
                <View style={styles.actions}>
                  <Bouton
                    titre="Refuser"
                    onPress={() =>
                      setActionEnCours({ type: 'refuser', reservation: item })
                    }
                    variante="danger"
                    style={styles.boutonAction}
                    iconeGauche={
                      <Ionicons name="close-circle-outline" size={16} color={CouleursNeutres.blancPur} />
                    }
                  />
                  <Bouton
                    titre="Valider"
                    onPress={() =>
                      setActionEnCours({ type: 'valider', reservation: item })
                    }
                    variante="succes"
                    style={styles.boutonAction}
                    iconeGauche={
                      <Ionicons name="checkmark-circle-outline" size={16} color={CouleursNeutres.blancPur} />
                    }
                  />
                </View>
              )}
            </View>
          );
        }}
        ListHeaderComponent={
          <View>
            <EnTete
              titre="Réservations"
              sousTitre="Gérez les demandes de location sur vos véhicules"
            />

            {/* Onglets de filtrage */}
            <View style={styles.onglets}>
              <Onglet
                titre="En attente"
                compteur={compteurs.enAttente}
                actif={ongletActif === 'en_attente'}
                onPress={() => setOngletActif('en_attente')}
              />
              <Onglet
                titre="Validées"
                compteur={compteurs.validees}
                actif={ongletActif === 'validee'}
                onPress={() => setOngletActif('validee')}
              />
              <Onglet
                titre="Refusées"
                compteur={compteurs.refusees}
                actif={ongletActif === 'refusee'}
                onPress={() => setOngletActif('refusee')}
              />
              <Onglet
                titre="Toutes"
                compteur={compteurs.total}
                actif={ongletActif === 'tous'}
                onPress={() => setOngletActif('tous')}
              />
            </View>

            {/* Alerte s'il y a des demandes en attente */}
            {reservationsAValider.length > 0 && ongletActif === 'en_attente' && (
              <View style={styles.alerte}>
                <Ionicons
                  name="notifications-circle"
                  size={24}
                  color={CouleursSemantiques.avertissement}
                />
                <View style={styles.texteAlerte}>
                  <Text style={styles.titreAlerte}>
                    {reservationsAValider.length} demande
                    {reservationsAValider.length > 1 ? 's' : ''} en attente
                  </Text>
                  <Text style={styles.descriptionAlerte}>
                    N'oubliez pas de répondre rapidement pour améliorer votre note.
                  </Text>
                </View>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <EtatVide
            icone="calendar-outline"
            titre={
              ongletActif === 'en_attente'
                ? 'Aucune demande en attente'
                : 'Aucune réservation'
            }
            description={
              ongletActif === 'en_attente'
                ? 'Vous êtes à jour ! Les nouvelles demandes apparaîtront ici.'
                : 'Aucune réservation ne correspond à ce filtre.'
            }
          />
        }
        contentContainerStyle={styles.liste}
        refreshControl={
          <RefreshControl
            refreshing={rafraichissement}
            onRefresh={gererRafraichissement}
            tintColor={CouleursPrimaires.bleuProfond}
          />
        }
      />

      {/* Modal de validation / refus */}
      <ModalConfirmation
        visible={actionEnCours !== null}
        titre={
          actionEnCours?.type === 'valider'
            ? 'Valider cette réservation ?'
            : 'Refuser cette réservation ?'
        }
        message={
          actionEnCours?.type === 'valider'
            ? 'Le client sera immédiatement notifié et pourra organiser la location.'
            : 'Le client sera informé de votre refus. Veuillez expliquer la raison.'
        }
        type={actionEnCours?.type === 'valider' ? 'valider' : 'refuser'}
        texteConfirmer={
          actionEnCours?.type === 'valider' ? 'Valider' : 'Refuser'
        }
        texteAnnuler="Annuler"
        avecChampMessage
        libelleChampMessage={
          actionEnCours?.type === 'valider'
            ? 'Message au client (optionnel)'
            : 'Raison du refus'
        }
        placeholderChampMessage={
          actionEnCours?.type === 'valider'
            ? 'Ajoutez un message pour le client…'
            : 'Pourquoi refusez-vous cette demande ?'
        }
        surConfirmer={executerAction}
        surAnnuler={() => setActionEnCours(null)}
      />
    </SafeAreaView>
  );
};

/**
 * Onglet de filtrage avec compteur.
 */
const Onglet: React.FC<{
  titre: string;
  compteur: number;
  actif: boolean;
  onPress: () => void;
}> = ({ titre, compteur, actif, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.onglet,
      {
        backgroundColor: actif ? CouleursPrimaires.bleuProfond : CouleursNeutres.blancPur,
        borderColor: actif ? CouleursPrimaires.bleuProfond : CouleursNeutres.gris200,
      },
    ]}
  >
    <Text
      style={[
        styles.texteOnglet,
        { color: actif ? CouleursNeutres.blancPur : CouleursNeutres.gris600 },
      ]}
    >
      {titre}
    </Text>
    <View
      style={[
        styles.badgeCompteur,
        {
          backgroundColor: actif ? 'rgba(255,255,255,0.25)' : CouleursPrimaires.bleuProfond + '15',
        },
      ]}
    >
      <Text
        style={[
          styles.texteCompteur,
          { color: actif ? CouleursNeutres.blancPur : CouleursPrimaires.bleuProfond },
        ]}
      >
        {compteur}
      </Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CouleursNeutres.gris50,
  },
  liste: {
    paddingHorizontal: Espacements.xl,
    paddingBottom: Espacements.xxxl,
    flexGrow: 1,
  },
  onglets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Espacements.lg,
  },
  onglet: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Espacements.sm,
    borderRadius: Espacements.md,
    borderWidth: 1,
    marginHorizontal: 2,
  },
  texteOnglet: {
    ...Typographie.corpsPetit,
    fontWeight: '600',
  },
  badgeCompteur: {
    marginLeft: Espacements.xs,
    paddingHorizontal: Espacements.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  texteCompteur: {
    ...Typographie.legende,
    fontWeight: '700',
    fontSize: 11,
  },
  alerte: {
    flexDirection: 'row',
    backgroundColor: CouleursSemantiques.avertissementDoux,
    padding: Espacements.md,
    borderRadius: Espacements.md,
    marginBottom: Espacements.lg,
    alignItems: 'center',
  },
  texteAlerte: {
    flex: 1,
    marginLeft: Espacements.md,
  },
  titreAlerte: {
    ...Typographie.corps,
    fontWeight: '700',
    color: CouleursNeutres.gris900,
  },
  descriptionAlerte: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris700,
    marginTop: 2,
  },
  carteMessage: {
    backgroundColor: CouleursNeutres.gris50,
    padding: Espacements.md,
    borderRadius: Espacements.md,
    marginTop: -Espacements.md,
    marginBottom: Espacements.sm,
    borderLeftWidth: 3,
    borderLeftColor: CouleursPrimaires.bleuClair,
  },
  libelleMessage: {
    ...Typographie.legende,
    color: CouleursNeutres.gris500,
    marginBottom: Espacements.xxs,
  },
  texteMessage: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris800,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Espacements.sm,
    marginBottom: Espacements.lg,
  },
  boutonAction: {
    flex: 1,
    marginHorizontal: Espacements.xxs,
  },
});

export default ReservationsLoueur;