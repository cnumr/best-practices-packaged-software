import { client } from '../../../../tina/__generated__/databaseClient';
import { getRefConfig } from '../../../../referentiel-config';
import { PersonasPage } from '../../../../components/pages/personas-page';
import { getStaticPathsFromFilesystem } from '../../../../utils/get-static-paths';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  if (!getRefConfig().featuresEnabled.linkToPersonas) {
    return [];
  }
  return getStaticPathsFromFilesystem('personas');
}

export default async function Page({ params }) {
  if (!getRefConfig().featuresEnabled.linkToPersonas) {
    notFound();
  }

  const { lang, slug } = params;

  try {
    const res = await client.queries.personas({
      relativePath: `${lang}/${slug}.mdx`,
    });

    return (
      <PersonasPage
        data={JSON.parse(JSON.stringify(res.data))}
        query={res.query}
        variables={res.variables}
        lang={lang}
      />
    );
  } catch {
    notFound();
  }
}
