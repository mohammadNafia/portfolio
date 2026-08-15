'use client';

import { useEffect, useState } from 'react';
import { site } from '@/lib/site';
import type { Locale } from '@/i18n/config';

/**
 * Baghdad local time. Renders nothing on the server and on the first client
 * paint, then fills in — this avoids a hydration mismatch rather than papering
 * over one with suppressHydrationWarning.
 */
export function LocalTime({ locale, label }: { locale: Locale; label: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      setTime(
        new Intl.DateTimeFormat(locale === 'ar' ? 'ar-IQ' : 'en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: site.timeZone,
          hour12: false,
        }).format(new Date()),
      );
    }
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, [locale]);

  return (
    <span className="type-meta inline-flex items-center gap-2">
      <span>{label}</span>
      <span
        className="ltr-island tabular-nums text-secondary"
        aria-live="off"
        suppressHydrationWarning
      >
        {time ?? '—'}
      </span>
    </span>
  );
}
