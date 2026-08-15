import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import type { Project } from '@/content/schema';
import { HeroCutout } from './HeroCutout';
import { HeroFan } from './HeroFan';
import { HeroInner } from './HeroInner';

/**
 * Hero — `--bg-alt` ground with paper grain, a two-tier lockup, one subtitle,
 * and the fan. One tier is the UI face, bold and widely tracked; the other is
 * the pixel display face at roughly twice the size. Which one leads depends on
 * the language — see the note over `tiers` below.
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

  /*
   * Which tier leads is a property of the language, not of the layout. English
   * builds up to the head noun — SOFTWARE & AI, then ENGINEER — so the display
   * line lands second. Arabic cannot do that: the إضافة puts the مضاف first, so
   * `مهندس` leads and `برمجيات وذكاء اصطناعي` follows. The two locales end up
   * mirror images, and forcing English's silhouette onto the Arabic would mean
   * inverting the reading to win a visual match that nobody asked for.
   */
  const tracked = (
    <span key="tracked" className="hero__line1">
      {hero.titleTop}
    </span>
  );
  const display = (
    <span key="display" className="hero__line2 pixel-title">
      {hero.titleMain}
    </span>
  );
  const tiers = locale === 'ar' ? [display, tracked] : [tracked, display];

  return (
    <section className="hero grain" aria-labelledby="hero-title">
      <HeroInner>
        <div className="shell relative text-center">
          <h1 id="hero-title" className="hero__title">
            {tiers}
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
