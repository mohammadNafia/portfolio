import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import type { Project } from '@/content/schema';
import { HeroCutout } from './HeroCutout';
import { HeroFan } from './HeroFan';
import { HeroInner } from './HeroInner';

/**
 * Hero — `--bg-alt` ground with paper grain, a two-tier lockup, one subtitle,
 * and the fan. Line 1 is the UI face, bold and widely tracked; line 2 is the
 * pixel display face at roughly twice the size.
 *
 * The load choreography (headline 0.00s → subtitle 0.10s → fan from 0.20s →
 * settled ≈2.4s) is CSS-driven, so the text paints with the document rather
 * than waiting on hydration.
 *
 * On the way out the hero does not scroll away — it lags at ~0.2× inside
 * `HeroInner` while the section below climbs over it and the sawtooth cuts
 * through it. The divider belongs to that section, not to this one.
 */
export function Hero({
  locale,
  dict,
  projects,
}: {
  locale: Locale;
  dict: Dictionary;
  projects: Project[];
}) {
  const { hero } = dict.home;

  return (
    <section className="hero grain" aria-labelledby="hero-title">
      <HeroInner>
        <div className="shell relative text-center">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line1">{hero.titleTop}</span>
            <span className="hero__line2 pixel-title">{hero.titleMain}</span>
          </h1>

          <p className="hero__sub">{hero.headline}</p>

          <HeroFan projects={projects} locale={locale} dict={dict} />
        </div>

        {/*
          Inside `HeroInner`, not beside it — the photo has to travel on the
          same 0.2× lag as everything above it, or the teeth stop lining up.
        */}
        <HeroCutout dict={dict} />
      </HeroInner>
    </section>
  );
}
