import { getPostBySlug, getPostTranslation } from '@/lib/wordpress-api';
import { Post } from '@/components/post';
import { Metadata } from 'next';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const locale = params.locale;
  const slug = params.slug;
  
  const post = await getPostBySlug(slug, locale as 'de' | 'en');
  
  if (!post) {
    return {
      title: 'Post not found',
      description: 'The requested post could not be found.'
    };
  }

  const translationId = post.acf?.translation_id || post.meta?.translation_id;
  const alternateLocale = locale === 'de' ? 'en' : 'de';
  const translatedPost = translationId ? await getPostTranslation(translationId, alternateLocale) : null;
  const alternateSlug = translatedPost?.slug;

  return {
    title: post.title.rendered,
    description: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
    alternates: {
      canonical: `/${locale}/post/${slug}`,
      languages: {
        'de': alternateLocale === 'de' && alternateSlug ? `/de/post/${alternateSlug}` : undefined,
        'en': alternateLocale === 'en' && alternateSlug ? `/en/post/${alternateSlug}` : undefined
      }
    }
  };
}

export default async function PostPage({ params }: any) {
  const locale = params.locale;
  const slug = params.slug;
  
  const post = await getPostBySlug(slug, locale as 'de' | 'en');
  
  if (!post) {
    return <div>Post not found</div>;
  }

  const translationId = post.acf?.translation_id || post.meta?.translation_id;
  const translation = translationId ? await getPostTranslation(translationId, locale === 'de' ? 'en' : 'de') : null;

  return (
    <Post post={post} translation={translation} locale={locale as 'de' | 'en'} />
  );
}
