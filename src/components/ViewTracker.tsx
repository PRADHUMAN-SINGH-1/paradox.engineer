'use client';

import { useEffect } from 'react';

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch('/api/view/' + encodeURIComponent(slug), {
      method: 'POST',
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
