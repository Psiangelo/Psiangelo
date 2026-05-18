/**
 * linkResolver — resolve um `link` rico em uma URL navegável + metadados.
 *
 * Usado por Trilhas, Glossário e /estudos para evitar duplicar a lógica
 * de "como abrir um post do blog vs um material vs um vídeo".
 *
 * Forma do link:
 *   { kind: 'material' | 'blog' | 'course' | 'youtube' | 'drive' | 'embed' | 'url' | 'none',
 *     value: string,   // id, slug ou URL conforme o kind
 *     label?: string,  // override opcional do título mostrado }
 *
 * Retorno: { href, label, kindLabel, isExternal, embed?: { provider, src } }
 *   - href: 'string|null'   — para usar em <Link> ou <a>. null quando kind=none ou faltam dados.
 *   - label: string         — título que cai bem em UI
 *   - kindLabel: string     — rótulo do tipo (ex.: "Post do blog", "Vídeo YouTube")
 *   - isExternal: boolean   — abre em nova aba quando true
 *   - embed: { provider, src } | undefined — quando o player pode ser embutido
 */

const KIND_LABEL = {
  material: 'Material',
  blog: 'Blog',
  course: 'Curso',
  youtube: 'Vídeo · YouTube',
  drive: 'Vídeo · Drive',
  embed: 'Embed',
  url: 'Link',
  none: 'Sem link',
};

function ytEmbedSrc(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      if (u.pathname === '/watch') {
        const id = u.searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (u.pathname.startsWith('/embed/')) return url;
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.replace('/shorts/', '').split('/')[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }
  } catch {
    /* not a URL */
  }
  return null;
}

function driveEmbedSrc(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes('drive.google.com')) return null;
    // /file/d/<id>/view → /file/d/<id>/preview
    const m = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    return url;
  } catch {
    return null;
  }
}

export function resolveLink(link, { materials = [], posts = [], courses = [], glossario = [] } = {}) {
  if (!link || !link.kind || link.kind === 'none' || !link.value) {
    return { href: null, label: link?.label || '', kindLabel: KIND_LABEL.none, isExternal: false };
  }
  const { kind, value, label } = link;

  if (kind === 'material') {
    const m = materials.find((x) => x.id === value);
    return {
      href: `/materiais#${value}`,
      label: label || m?.title || value,
      kindLabel: KIND_LABEL.material,
      isExternal: false,
    };
  }

  if (kind === 'blog') {
    const p = posts.find((x) => (x.slug || x.id) === value);
    return {
      href: `/blog/${value}`,
      label: label || p?.title || value,
      kindLabel: KIND_LABEL.blog,
      isExternal: false,
    };
  }

  if (kind === 'course') {
    const c = courses.find((x) => (x.slug || x.id) === value);
    return {
      href: `/cursos?id=${encodeURIComponent(value)}`,
      label: label || c?.title || value,
      kindLabel: KIND_LABEL.course,
      isExternal: false,
    };
  }

  if (kind === 'glossario') {
    const g = glossario.find((x) => x.slug === value);
    return {
      href: `/glossario/${value}`,
      label: label || g?.term || value,
      kindLabel: 'Verbete',
      isExternal: false,
    };
  }

  if (kind === 'youtube') {
    const src = ytEmbedSrc(value);
    return {
      href: value,
      label: label || 'Vídeo no YouTube',
      kindLabel: KIND_LABEL.youtube,
      isExternal: true,
      embed: src ? { provider: 'youtube', src } : undefined,
    };
  }

  if (kind === 'drive') {
    const src = driveEmbedSrc(value);
    return {
      href: value,
      label: label || 'Vídeo no Drive',
      kindLabel: KIND_LABEL.drive,
      isExternal: true,
      embed: src ? { provider: 'drive', src } : undefined,
    };
  }

  if (kind === 'embed') {
    // value é HTML cru (iframe, etc.) — quem renderizar deve passar via dangerouslySetInnerHTML
    return {
      href: null,
      label: label || 'Conteúdo embutido',
      kindLabel: KIND_LABEL.embed,
      isExternal: false,
      embed: { provider: 'raw', html: value },
    };
  }

  if (kind === 'url') {
    const isExternal = typeof value === 'string' && /^https?:\/\//i.test(value);
    return {
      href: value,
      label: label || value,
      kindLabel: KIND_LABEL.url,
      isExternal,
    };
  }

  // Fallback: kind desconhecido vira link externo se for URL
  return { href: value, label: label || value, kindLabel: kind, isExternal: /^https?:\/\//i.test(value) };
}

export const LINK_KINDS = [
  { value: 'none',     label: 'Sem link (texto livre)' },
  { value: 'material', label: 'Material do catálogo' },
  { value: 'blog',     label: 'Post do blog' },
  { value: 'course',   label: 'Curso' },
  { value: 'glossario',label: 'Verbete do glossário' },
  { value: 'youtube',  label: 'Vídeo do YouTube' },
  { value: 'drive',    label: 'Vídeo/arquivo do Google Drive' },
  { value: 'embed',    label: 'HTML embutido (iframe)' },
  { value: 'url',      label: 'URL livre' },
];

/** Migra stage antigo ({ material, href }) para shape novo ({ link: {kind, value} }) */
export function migrateStageLink(stage) {
  if (stage?.link && stage.link.kind) return stage;
  if (stage?.material) {
    return { ...stage, link: { kind: 'material', value: stage.material } };
  }
  if (stage?.href) {
    return { ...stage, link: { kind: 'url', value: stage.href } };
  }
  return { ...stage, link: { kind: 'none', value: '' } };
}
