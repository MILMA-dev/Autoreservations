/**
 * Fichier: ModalConfirmation.tsx
 * Description: Composant modal de confirmation avec un titre, un message
 * et deux boutons d'action (confirmer / annuler). Utilisé pour valider
 * ou refuser une réservation.
 */
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CouleursNeutres, CouleursPrimaires, CouleursSemantiques, Espacements, Ombres, Rayons } from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';
import Bouton from './Bouton';
import ChampTexte from './ChampTexte';

/**
 * Variantes de la modal.
 */
export type TypeModal = 'valider' | 'refuser' | 'generique';

/**
 * Propriétés du composant ModalConfirmation.
 */
interface PropsModalConfirmation {
  visible: boolean;
  titre: string;
  message?: string;
  type?: TypeModal;
  texteConfirmer?: string;
  texteAnnuler?: string;
  avecChampMessage?: boolean;
  libelleChampMessage?: string;
  placeholderChampMessage?: string;
  surConfirmer: (message?: string) => void;
  surAnnuler: () => void;
}

const ModalConfirmation: React.FC<PropsModalConfirmation> = ({
  visible,
  titre,
  message,
  type = 'generique',
  texteConfirmer = 'Confirmer',
  texteAnnuler = 'Annuler',
  avecChampMessage = false,
  libelleChampMessage = 'Message',
  placeholderChampMessage = 'Votre message…',
  surConfirmer,
  surAnnuler,
}) => {
  const [messageTexte, setMessageTexte] = React.useState('');

  // Couleurs du bouton principal selon le type
  const varianteBouton =
    type === 'valider' ? 'succes' : type === 'refuser' ? 'danger' : 'primaire';

  const fermer = () => {
    setMessageTexte('');
    surAnnuler();
  };

  const confirmer = () => {
    surConfirmer(avecChampMessage ? messageTexte : undefined);
    setMessageTexte('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={fermer}
    >
      <Pressable style={styles.fond} onPress={fermer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.conteneurClavier}
        >
          <Pressable style={styles.boite} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.titre}>{titre}</Text>
            {message && <Text style={styles.message}>{message}</Text>}

            {avecChampMessage && (
              <ChampTexte
                libelle={libelleChampMessage}
                value={messageTexte}
                onChangeText={setMessageTexte}
                placeholder={placeholderChampMessage}
                type="multiligne"
                conteneurStyle={styles.champ}
              />
            )}

            <View style={styles.boutons}>
              <Bouton
                titre={texteAnnuler}
                onPress={fermer}
                variante="secondaire"
                style={styles.boutonAction}
              />
              <Bouton
                titre={texteConfirmer}
                onPress={confirmer}
                variante={varianteBouton}
                style={styles.boutonAction}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fond: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Espacements.lg,
  },
  conteneurClavier: {
    width: '100%',
    maxWidth: 420,
  },
  boite: {
    backgroundColor: CouleursNeutres.blancPur,
    borderRadius: Rayons.grand,
    padding: Espacements.xxl,
    ...Ombres.grande,
  },
  titre: {
    ...Typographie.titreCarte,
    color: CouleursNeutres.gris900,
    marginBottom: Espacements.sm,
  },
  message: {
    ...Typographie.corps,
    color: CouleursNeutres.gris600,
    marginBottom: Espacements.lg,
    lineHeight: 22,
  },
  champ: {
    marginBottom: Espacements.lg,
  },
  boutons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Espacements.md,
  },
  boutonAction: {
    flex: 1,
    marginHorizontal: Espacements.xs,
  },
});

export default ModalConfirmation;