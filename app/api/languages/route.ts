import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getRefConfig } from '../../../referentiel-config';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Types
interface ApiData {
  meta: {
    generated: string;
    total: number;
    languages: string[];
  };
  languages: string[];
  fiches: unknown[];
}

// Charger les données depuis le fichier JSON
function loadApiData(): ApiData {
  const filePath = path.join(process.cwd(), 'public/api-data/fiches-full.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

/**
 * @swagger
 * /api/languages:
 *   get:
 *     summary: Liste des langues disponibles
 *     description: Retourne la liste de toutes les langues disponibles dans le référentiel ainsi que la langue par défaut
 *     tags:
 *       - Languages
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["fr", "en", "es"]
 *                 default:
 *                   type: string
 *                   example: "fr"
 *       404:
 *         description: Fichier de données non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function GET(request: NextRequest) {
  try {
    // Charger les données
    const apiData = loadApiData();

    // Récupérer la langue par défaut depuis la config
    const defaultLang = getRefConfig().i18n.defaultLang;

    // Construire la réponse
    const response = {
      data: apiData.languages,
      default: defaultLang,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error in /api/languages:', error);

    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return NextResponse.json(
        {
          error: 'API data not found',
          message:
            'Please run "node scripts/generate-api-data.mjs" to generate the API data',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
