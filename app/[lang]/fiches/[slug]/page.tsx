import { FichesConnectionQuery } from '../../../../tina/__generated__/types';
import { FichesPage } from '../../../../components/pages/fiches-page';
import { InternalNavigation } from '../../../../components/pages/fiche/InternalNav';
import { client } from '../../../../tina/__generated__/databaseClient';
import fichesData from '../fiches.preval';
import { getRefConfig } from '../../../../referentiel-config';
export async function generateStaticParams() {
  const { data }: { data: FichesConnectionQuery } = fichesData;
  return data.fichesConnection.edges?.map((e) => ({
    lang: e?.node?.language,
    slug: e?.node?._sys.filename,
  }));
}
export default async function Page({ params }) {
  const { lang, slug } = params;

  const res = await client.queries.fiches({
    relativePath: `${lang}/${slug}.mdx`,
  });

  // Charger toutes les entrées du lexique pour cette langue
  let lexiqueRes:
    | Awaited<ReturnType<typeof client.queries.lexiqueConnection>>
    | undefined = undefined;
  if (getRefConfig().featuresEnabled.lexique_tooltips) {
    lexiqueRes = await client.queries.lexiqueConnection({
      filter: {
        language: {
          eq: lang,
        },
      },
      first: 1000,
    });
  }

  // Créer un dictionnaire des entrées du lexique par clé (filename sans extension)
  const lexiqueData: Record<string, any> = {};
  if (lexiqueRes && lexiqueRes.data.lexiqueConnection.edges) {
    for (const edge of lexiqueRes.data.lexiqueConnection.edges) {
      if (edge?.node) {
        // Normaliser la clé en enlevant l'extension .mdx si présente
        const key = edge.node._sys.filename.replace(/\.mdx$/, '');
        // Sérialiser les données pour les rendre compatibles avec les composants clients
        lexiqueData[key] = JSON.parse(JSON.stringify(edge.node));
      }
    }
  }

  const cursor = btoa(res.data.fiches.id.replaceAll('\\', '/'));
  const { data: dataAfter } = await client.queries.fichesConnection({
    filter: {
      language: {
        eq: lang,
      },
    },
    first: 1,
    after: cursor,
  });
  const { data: dataBefore } = await client.queries.fichesConnection({
    filter: {
      language: {
        eq: lang,
      },
    },
    first: 1,
    before: cursor,
  });
  const nextPage =
    dataAfter.fichesConnection.edges && dataAfter.fichesConnection.edges[0];
  const previousPage =
    dataBefore.fichesConnection.edges && dataBefore.fichesConnection.edges[0];

  return (
    <>
      <FichesPage
        data={JSON.parse(JSON.stringify(res.data))}
        query={res.query}
        variables={res.variables}
        params={params}
        lexiqueData={lexiqueData}
      />
      <InternalNavigation
        lang={lang}
        previousPage={previousPage}
        nextPage={nextPage}
        className=""
      />
    </>
  );
}
