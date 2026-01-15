import { getDocBySlug, getAllDocs } from '@/lib/docs';
import { renderMarkdoc } from '@/lib/markdoc';

export async function generateStaticParams() {
  const docs = getAllDocs();
  
  return docs.map((doc) => ({
    slug: doc.slug.filter(s => s !== 'index'),
  }));
}

export default function DocPage({ params }: { params: { slug?: string[] } }) {
  const { content, data } = getDocBySlug(params.slug);
  const renderedContent = renderMarkdoc(content);

  return (
    <article className="prose prose-slate max-w-none">
      <h1>{data.title}</h1>
      {renderedContent}
    </article>
  );
}