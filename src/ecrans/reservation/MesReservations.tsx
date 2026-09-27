/**
 * Fichier: MesReservations.tsx
 * Description: Écran listant les réservations effectuées par le client
 * connecté. Affiche le statut de chaque demande, permet l'annulation
 * et la notation (1-5 étoiles) après une location terminée.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { utiliserContexteApp } from '../../magasin/ContexteApp';
import {
  CouleursNeutres,
  CouleursPrimaires,
  CouleursSemantiques,
  Espacements,
  Rayons,
} from '../../constantes/couleurs';
import { Typographie } from '../../constantes/typographie';
import CarteReservation from '../../composants/CarteReservation';
import Chargeur from '../../composants/Chargeur';
import EtatVide from '../../composants/EtatVide';
import EnTete from '../../composants/EnTete';
import Bouton from '../../composants/Bouton';
import ModalConfirmation from '../../composants/ModalConfirmation';
import SelecteurEtoiles from '../../composants/SelecteurEtoiles';
import ChampTexte from '../../composants/ChampTexte';
import { Reservation, Vehicule } from '../../modeles/types';
import { VEHICULES_MOCK } from '../../services/donneesMock';

const MesReservations: React.FC = () => {
  const {
    mesReservations,
    chargerReservations,
    annulerReservation,
    noterReservation,
  } = utiliserContexteApp();
  const [rafraichissement, setRafraichissement] = useState(false);
  const [reservationAAnnuler, setReservationAAnnuler] = useState<string | null>(null);
  const [reservationANoter, setReservationANoter] = useState<Reservation | null>(null);
  const [noteSelectionnee, setNoteSelectionnee] = useState(0);
  const [commentaireNote, setCommentaireNote] = useState('');
  const [notationEnCours, setNotationEnCours] = useState(false);

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
   * Récupère le véhicule associé à une réservation.
   */
  const obtenirVehiculeDeLaReservation = (vehiculeId: string): Vehicule | undefined =>
    VEHICULES_MOCK.find((v) => v.identifiant === vehiculeId);

  /**
   * Confirme puis annule une réservation.
   */
  const confirmerAnnulation = async () => {
    if (!reservationAAnnuler) return;
    try {
      await annulerReservation(reservationAAnnuler);
      setReservationAAnnuler(null);
      Alert.alert('Réservation annulée', 'Votre demande a été annulée.');
    } catch (erreur: any) {
      Alert.alert('Erreur', erreur.message || 'Annulation impossible.');
    }
  };

  /**
   * Ouvre la modal de notation pour une location terminée.
   */
  const ouvrirNotation = (reservation: Reservation) => {
    setReservationANoter(reservation);
    setNoteSelectionnee(reservation.noteClient || 0);
    setCommentaireNote(reservation.commentaireNote || '');
  };

  /**
   * Soumet la notation du client.
   */
  const soumettreNotation = async () => {
    if (!reservationANoter) return;
    if (noteSelectionnee === 0) {
      Alert.alert('Note requise', 'Veuillez sélectionner au moins une étoile.');
      return;
    }
    setNotationEnCours(true);
    try {
      await noterReservation(
        reservationANoter.identifiant,
        noteSelectionnee,
        commentaireNote.trim() || undefined
      );
      setReservationANoter(null);
      setNoteSelectionnee(0);
      setCommentaireNote('');
      Alert.alert(
        'Merci pour votre avis !',
        'Votre note a été enregistrée et contribuera à améliorer la qualité du service.'
      );
    } catch (erreur: any) {
      Alert.alert('Erreur', erreur.message || 'Notation impossible.');
    } finally {
      setNotationEnCours(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={mesReservations}
        keyExtractor={(item) => item.identifiant}
        renderItem={({ item }) => {
          const vehicule = obtenirVehiculeDeLaReservation(item.vehiculeId);
          const peutAnnuler = item.statut === 'en_attente' || item.statut === 'validee';
          const peutNoter = item.statut === 'terminee' && !item.noteClient;

          return (
            <View>
              <CarteReservation
                reservation={item}
                vehicule={vehicule}
                afficherActions
                messageActions={
                  <View>
                    {/* Affichage de la note si déjà donnée */}
                    {item.noteClient && (
                      <View style={styles.carteNoteExistante}>
                        <Text style={styles.libelleNoteExistante}>Votre note</Text>
                        <SelecteurEtoiles
                          valeur={item.noteClient}
                          surChangement={() => {}}
                          editable={false}
                          taille={22}
                        />
                        {item.commentaireNote && (
                          <Text style={styles.commentaireNoteExistante}>
                            « {item.commentaireNote} »
                          </Text>
                        )}
                      </View>
                    )}
                    {/* Bouton pour noter */}
                    {peutNoter && (
                      <Bouton
                        titre="Noter ce véhicule"
                        onPress={() => ouvrirNotation(item)}
                        variante="primaire"
                        pleineLargeur
                      />
                    )}
                    {/* Bouton d'annulation */}
                    {peutAnnuler && (
                      <Bouton
                        titre="Annuler la réservation"
                        onPress={() => setReservationAAnnuler(item.identifiant)}
                        variante="danger"
                        pleineLargeur
                        style={styles.boutonAnnuler}
                      />
                    )}
                  </View>
                }
              />
            </View>
          );
        }}
        ListHeaderComponent={
          <EnTete
            titre="Mes locations"
            sousTitre={`${mesReservations.length} réservation${mesReservations.length > 1 ? 's' : ''}`}
          />
        }
        ListEmptyComponent={
          <EtatVide
            icone="calendar-outline"
            titre="Aucune réservation"
            description="Vous n'avez pas encore effectué de réservation. Parcourez le catalogue pour trouver votre prochain véhicule."
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

      {/* Modal d'annulation */}
      <ModalConfirmation
        visible={reservationAAnnuler !== null}
        titre="Annuler cette réservation ?"
        message="Cette action est irréversible. Le propriétaire sera informé de votre annulation."
        type="refuser"
        texteConfirmer="Annuler la réservation"
        texteAnnuler="Conserver"
        surConfirmer={confirmerAnnulation}
        surAnnuler={() => setReservationAAnnuler(null)}
      />

      {/* Modal de notation */}
      <ModalConfirmation
        visible={reservationANoter !== null}
        titre="Notez votre expérience"
        message={
          reservationANoter
            ? `Comment s'est passée votre location${obtenirVehiculeDeLaReservation(reservationANoter.vehiculeId) ? ` du ${obtenirVehiculeDeLaReservation(reservationANoter.vehiculeId)?.marque} ${obtenirVehiculeDeLaReservation(reservationANoter.vehiculeId)?.modele}` : ''} ?`
            : ''
        }
        type="valider"
        texteConfirmer="Envoyer la note"
        texteAnnuler="Plus tard"
        avecChampMessage
        libelleChampMessage="Commentaire (optionnel)"
        placeholderChampMessage="Partagez votre expérience…"
        surConfirmer={() => {
          // Le champ de message du ModalConfirmation ne gère pas la note,
          // on délègue à notre propre handler via une astuce : la modal
          // appelle surConfirmer avec un argument message. On sauvegarde
          // puis appelle notre handler.
          soumettreNotation();
        }}
        surAnnuler={() => {
          setReservationANoter(null);
          setNoteSelectionnee(0);
          setCommentaireNote('');
        }}
      >
        {/* Surcharge : on ajoute le sélecteur d'étoiles dans une modale custom */}
      </ModalConfirmation>

      {/* Vue de notation dédiée (affichée par-dessus) */}
      {reservationANoter !== null && (
        <View style={styles.superposition}>
          <View style={styles.boiteNotation}>
            <Text style={styles.titreNotation}>Notez votre expérience</Text>
            <Text style={styles.descriptionNotation}>
              Votre avis nous aide à améliorer la qualité du service.
            </Text>

            <SelecteurEtoiles
              valeur={noteSelectionnee}
              surChangement={setNoteSelectionnee}
              libelle="Votre note"
            />

            <ChampTexte
              libelle="Commentaire (optionnel)"
              value={commentaireNote}
              onChangeText={setCommentaireNote}
              placeholder="Partagez votre expérience…"
              type="multiligne"
              nombreLignes={3}
              conteneurStyle={styles.champCommentaire}
            />

            <View style={styles.boutonsNotation}>
              <Bouton
                titre="Plus tard"
                onPress={() => {
                  setReservationANoter(null);
                  setNoteSelectionnee(0);
                  setCommentaireNote('');
                }}
                variante="secondaire"
                style={styles.boutonNotation}
              />
              <Bouton
                titre="Envoyer"
                onPress={soumettreNotation}
                variante="primaire"
                chargeur={notationEnCours}
                style={styles.boutonNotation}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

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
  carteNoteExistante: {
    backgroundColor: CouleursSemantiques.avertissementDoux,
    padding: Espacements.md,
    borderRadius: Rayons.moyen,
    marginBottom: Espacements.sm,
    alignItems: 'center',
  },
  libelleNoteExistante: {
    ...Typographie.legende,
    color: CouleursNeutres.gris700,
    marginBottom: Espacements.sm,
  },
  commentaireNoteExistante: {
    ...Typographie.corpsPetit,
    color: CouleursNeutres.gris700,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Espacements.sm,
  },
  boutonAnnuler: {
    marginTop: Espacements.sm,
  },
  superposition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Espacements.lg,
  },
  boiteNotation: {
    backgroundColor: CouleursNeutres.blancPur,
    borderRadius: Rayons.grand,
    padding: Espacements.xxl,
    width: '100%',
    maxWidth: 420,
  },
  titreNotation: {
    ...Typographie.titreCarte,
    color: CouleursNeutres.gris900,
    textAlign: 'center',
    marginBottom: Espacements.sm,
  },
  descriptionNotation: {
    ...Typographie.corps,
    color: CouleursNeutres.gris500,
    textAlign: 'center',
    marginBottom: Espacements.xl,
  },
  champCommentaire: {
    marginTop: Espacements.lg,
  },
  boutonsNotation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Espacements.lg,
  },
  boutonNotation: {
    flex: 1,
    marginHorizontal: Espacements.xs,
  },
});

export default MesReservations;