/**
 * Fichier: ChampTexte.tsx
 * Description: Composant de saisie de texte avec libellé, gestion d'erreur
 * et icône optionnelle. Supporte différents types de clavier (email, téléphone, etc.).
 */
import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { CouleursNeutres, CouleursPrimaires, CouleursSemantiques, Espacements, Rayons } from '../constantes/couleurs';
import { Typographie } from '../constantes/typographie';

/**
 * Propriétés du composant ChampTexte.
 */
interface PropsChampTexte extends Omit<TextInputProps, 'style' | 'numberOfLines' | 'multiline'> {
  libelle: string;
  erreur?: string;
  obligatoire?: boolean;
  iconeGauche?: React.ReactNode;
  conteneurStyle?: ViewStyle;
  type?: 'texte' | 'email' | 'motdepasse' | 'telephone' | 'numerique' | 'multiligne';
  nombreLignes?: number;
}

/**
 * Mapping du type vers le type de clavier natif.
 */
const TYPES_CLAVIER: Record<string, KeyboardTypeOptions> = {
  email: 'email-address',
  telephone: 'phone-pad',
  numerique: 'numeric',
  texte: 'default',
  motdepasse: 'default',
  multiligne: 'default',
};

/**
 * Composant de saisie de texte complet et accessible.
 */
const ChampTexte: React.FC<PropsChampTexte> = ({
  libelle,
  erreur,
  obligatoire = false,
  iconeGauche,
  conteneurStyle,
  type = 'texte',
  nombreLignes,
  ...autres
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <View style={[styles.conteneur, conteneurStyle]}>
      {/* Libellé du champ */}
      <Text style={styles.libelle}>
        {libelle}
        {obligatoire && <Text style={styles.obligatoire}> *</Text>}
      </Text>

      {/* Zone de saisie */}
      <View
        style={[
          styles.zoneSaisie,
          {
            borderColor: erreur
              ? CouleursSemantiques.erreur
              : focus
              ? CouleursPrimaires.bleuClair
              : CouleursNeutres.gris300,
          },
        ]}
      >
        {iconeGauche && <View style={styles.icone}>{iconeGauche}</View>}
        <TextInput
          style={[
            styles.saisie,
            type === 'multiligne' && { height: 24 * (nombreLignes || 3), textAlignVertical: 'top' },
          ]}
          placeholderTextColor={CouleursNeutres.gris400}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          secureTextEntry={type === 'motdepasse'}
          keyboardType={TYPES_CLAVIER[type]}
          multiline={type === 'multiligne'}
          numberOfLines={type === 'multiligne' ? nombreLignes : undefined}
          {...autres}
        />
      </View>

      {/* Message d'erreur */}
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginBottom: Espacements.lg,
  },
  libelle: {
    ...Typographie.corps,
    color: CouleursNeutres.gris700,
    marginBottom: Espacements.sm,
    fontWeight: '600',
  },
  obligatoire: {
    color: CouleursSemantiques.erreur,
  },
  zoneSaisie: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Rayons.moyen,
    backgroundColor: CouleursNeutres.blancPur,
    paddingHorizontal: Espacements.md,
  },
  icone: {
    marginRight: Espacements.sm,
  },
  saisie: {
    flex: 1,
    paddingVertical: Espacements.md,
    fontSize: 16,
    color: CouleursNeutres.gris900,
  },
  erreur: {
    ...Typographie.corpsPetit,
    color: CouleursSemantiques.erreur,
    marginTop: Espacements.xs,
  },
});

export default ChampTexte;