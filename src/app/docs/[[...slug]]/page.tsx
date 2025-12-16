import { getDocBySlug } from '@/lib/docs';
import { renderMarkdoc } from '@/lib/markdoc';

export const runtime = 'nodejs';

export default function DocPage({ params }: any) {
  const { content, data } = getDocBySlug(params.slug);

  return (
    <article className="prose prose-slate max-w-none">
      {renderMarkdoc(content)}
    </article>
  );
}
