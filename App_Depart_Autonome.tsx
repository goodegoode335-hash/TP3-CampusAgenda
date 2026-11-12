import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

function Placesrestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function Statutevenement(e: Evenement): string {
  const restantes = Placesrestantes(e);
  if (restantes === 0) {
    return 'Complet';
  } else if (restantes <= 3) {
    return 'Presque complet';
  } else {
    return 'Ouvert';
  }
}

const Nombretotalevenements = evenements.length;

const Nombreevenementscomplets = evenements.filter(
  (e) => Statutevenement(e) === 'Complet'
).length;

const Nombreevenementsavecplaces = evenements.filter(
  (e) => Placesrestantes(e) > 0
).length;

const Sommeplacesrestantes = evenements.reduce(
  (somme, e) => somme + Placesrestantes(e),
  0
);

type Badgeetatprops = {
  statut: string;
};

function Badgeetat({ statut }: Badgeetatprops) {
  let backgroundColor = '#d4edda';
  let textColor = '#155724';

  if (statut === 'Complet') {
    backgroundColor = '#f8d7da';
    textColor = '#721c24';
  } else if (statut === 'Presque complet') {
    backgroundColor = '#fff3cd';
    textColor = '#856404';
  }

  return (
    <View style={[styles.badgeContainer, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{statut}</Text>
    </View>
  );
}
type Carteevenementprops = {
  evenement: Evenement;
};

function Carteevenement({ evenement }: Carteevenementprops) {
  const restantes = Placesrestantes(evenement);
  const statut = Statutevenement(evenement);

  return (
    <View style={styles.carteContainer}>
      <Text style={styles.carteTitre}>{evenement.titre}</Text>
      <Text>Catégorie : {evenement.categorie}</Text>
      <Text>Places restantes : {restantes}</Text>
      <Badgeetat statut={statut} />
    </View>
  );
}

type Blocstatistiqueprops = {
  libelle: string;
  valeur: number;
};

function Blocstatistique({ libelle, valeur }: Blocstatistiqueprops) {
  return (
    <View style={styles.blocContainer}>
      <Text style={styles.blocLibelle}>{libelle}</Text>
      <Text style={styles.blocValeur}>{valeur}</Text>
    </View>
  );
}

export default function App() {
  const Mode: 'tous' | 'ateliers' = 'tous';

  const Donneesaffichees = Mode === 'tous' 
    ? evenements 
    : evenements.filter((e) => e.categorie === 'Atelier' && Placesrestantes(e) > 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>CampusAgenda</Text>
        <Text style={styles.headerSubtitle}>Événements du campus</Text>
      </View>

      <View style={styles.statsRow}>
        <Blocstatistique libelle="Événements" valeur={Nombretotalevenements} />
        <Blocstatistique libelle="Places libres" valeur={Sommeplacesrestantes} />
        <Blocstatistique libelle="Complets" valeur={Nombreevenementscomplets} />
        <Blocstatistique libelle="Avec places" valeur={Nombreevenementsavecplaces} />
      </View>

      <Text style={styles.sectionTitle}>
        {Mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles'}
      </Text>

      <FlatList
        data={Donneesaffichees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Carteevenement evenement={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucun événement à afficher pour le moment.
          </Text>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  headerContainer: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  blocContainer: {
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    margin: 4,
    flex: 1,
    minWidth: '45%',
  },
  blocLibelle: {
    fontSize: 14,
    color: '#666',
  },
  blocValeur: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  carteContainer: {
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  carteTitre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  badgeContainer: {
    padding: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: {
    fontWeight: 'bold',
  },
});
