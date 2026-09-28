'use client';

import { useEffect } from 'react';

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = 'paradox:viewed:' + slug;

    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // Continue without client-side de-duplication if storage is unavailable.
    }

    fetch('/api/view/' + encodeURIComponent(slug), {
      method: 'POST',
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
