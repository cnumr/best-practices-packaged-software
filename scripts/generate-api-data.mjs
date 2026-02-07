/**
 * Script de génération des données API statiques
 *
 * Ce script génère un fichier JSON avec toutes les fiches publiées
 * pour être utilisé par les API Routes Next.js
 *
 * Usage:
 *   node scripts/generate-api-data.mjs
 *
 * Le script:
 * 1. Parcourt tous les fichiers MDX dans src/content/fiches/
 * 2. Parse le frontmatter de chaque fiche
 * 3. Filtre uniquement les fiches publiées (published: true)
 * 4. Génère un JSON avec: id, title, lang, versions, url
 * 5. Écrit le résultat dans public/api-data/fiches-full.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Locales autorisées par référentiel (miroir de referentiel-config.ts)
const LOCALES_BY_REF = {
  RWP: ['fr'],
  REIPRO: ['fr'],
  RIA: ['fr'],
  RWEB: ['fr', 'en', 'es'],
  REF_HOME: ['fr', 'en', 'es'],
};

function getAllowedLocales() {
  const refName = process.env.NEXT_PUBLIC_REF_NAME || 'RWEB';
  const locales = LOCALES_BY_REF[refName];
  if (!locales) {
    console.warn(`⚠️  Référentiel "${refName}" inconnu, utilisation des locales par défaut (fr, en, es)`);
    return ['fr', 'en', 'es'];
  }
  return locales;
}

// Fonction pour extraire le frontmatter d'un fichier MDX
function parseFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      console.warn(`⚠️  Pas de frontmatter trouvé dans: ${filePath}`);
      return null;
    }

    const frontmatter = yaml.load(frontmatterMatch[1]);
    return frontmatter;
  } catch (error) {
    console.error(`❌ Erreur lors du parsing de ${filePath}:`, error.message);
    return null;
  }
}

// Fonction pour générer l'URL d'une fiche
function generateFicheUrl(lang, slug) {
  return `/${lang}/fiches/${slug}`;
}

// Fonction principale
function main() {
  console.log('🚀 Génération des données API...\n');

  const fichesDir = path.join(projectRoot, 'src/content/fiches');
  const outputDir = path.join(projectRoot, 'public/api-data');
  const outputFile = path.join(outputDir, 'fiches-full.json');

  // Créer le dossier de sortie s'il n'existe pas
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const languages = [];
  const fiches = [];

  // Itérer uniquement sur les locales configurées pour le référentiel
  const allowedLocales = getAllowedLocales();
  const refName = process.env.NEXT_PUBLIC_REF_NAME || 'RWEB';
  console.log(`🔧 Référentiel: ${refName} — Locales autorisées: ${allowedLocales.join(', ')}\n`);

  for (const lang of allowedLocales) {
    const langDir = path.join(fichesDir, lang);

    // Vérifier que le dossier existe pour cette locale
    if (!fs.existsSync(langDir) || !fs.statSync(langDir).isDirectory()) {
      console.warn(`⚠️  Dossier inexistant pour la locale "${lang}": ${langDir}`);
      continue;
    }

    languages.push(lang);
    const files = fs.readdirSync(langDir).filter(file => file.endsWith('.mdx'));

    console.log(`📁 Traitement de ${files.length} fiches en langue: ${lang}`);

    for (const file of files) {
      const filePath = path.join(langDir, file);
      const frontmatter = parseFrontmatter(filePath);

      if (!frontmatter) continue;

      // Filtrer uniquement les fiches publiées
      if (frontmatter.published !== true) {
        console.log(`  ⏭️  Ignorée (non publiée): ${file}`);
        continue;
      }

      // Vérifier les champs requis
      if (!frontmatter.refID || !frontmatter.title) {
        console.warn(`  ⚠️  Champs manquants dans: ${file}`);
        continue;
      }

      const slug = file.replace('.mdx', '');
      const url = generateFicheUrl(lang, slug);

      // Construire l'objet fiche
      const fiche = {
        id: frontmatter.refID,
        title: frontmatter.title,
        lang: lang,
        versions: frontmatter.versions || [],
        url: url,
      };

      fiches.push(fiche);
      console.log(`  ✅ ${fiche.id} - ${fiche.title}`);
    }
  }

  // Trier les langues
  languages.sort();

  // Extraire les versions distinctes depuis toutes les fiches
  const versionsSet = new Set();
  for (const fiche of fiches) {
    for (const v of fiche.versions) {
      versionsSet.add(v.version);
    }
  }
  const versions = [...versionsSet].sort();

  // Construire l'objet de sortie
  const output = {
    meta: {
      generated: new Date().toISOString(),
      total: fiches.length,
      languages: languages,
      versions: versions,
    },
    languages: languages,
    versions: versions,
    fiches: fiches,
  };

  // Écrire le fichier JSON
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`\n✨ Génération terminée !`);
  console.log(`📊 Résumé:`);
  console.log(`  - Langues disponibles: ${languages.join(', ')}`);
  console.log(`  - Versions disponibles: ${versions.join(', ') || 'aucune'}`);
  console.log(`  - Total de fiches publiées: ${fiches.length}`);
  console.log(`  - Fichier généré: ${outputFile}`);
  console.log(`  - Taille: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB\n`);
}

// Exécution
main();
