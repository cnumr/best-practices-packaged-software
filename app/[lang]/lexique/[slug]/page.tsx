import { client } from '../../../../tina/__generated__/databaseClient';
import { LexiquePage } from '../../../../components/pages/lexique-page';
import { getStaticPathsFromFilesystem } from '../../../../utils/get-static-paths';

export function generateStaticParams() {
  return getStaticPathsFromFilesystem('lexique');
}
export default async function Page({ params }) {
  const { lang, slug } = params;
  const res = await client.queries.lexique({
    relativePath: `${lang}/${slug}.mdx`,
  });

  return (
    <LexiquePage
      data={JSON.parse(JSON.stringify(res.data))}
      query={res.query}
      variables={res.variables}
      lang={lang}
    />
  );
}
