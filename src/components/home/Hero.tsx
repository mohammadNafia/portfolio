import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import type { Project } from '@/content/schema';
import { HeroCutout } from './HeroCutout';
import { HeroFan } from './HeroFan';
import { HeroInner } from './HeroInner';

/**
 * Hero — `--bg-alt` ground with paper grain, a two-tier lockup, one subtitle,
 * and the fan. The name leads on the pixel display face; the role follows on
 * the UI face, bold and widely tracked, at roughly half the size.
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
   * The lockup is the name over the role, in that order, in both locales — the
   * copy names the person first and the discipline second, and there is no
   * grammatical reason for the two languages to disagree about it here. The
   * name takes the display face; the role takes the tracked UI line. `locale`
   * still matters to the fan below, not to the tier order.
   */
  return (
    <section className="hero grain" aria-labelledby="hero-title">
      <HeroInner>
        <div className="shell relative text-center">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line2 pixel-title">{hero.name}</span>
            <span className="hero__line1">{hero.role}</span>
          </h1>

          <p className="hero__sub">{hero.intro}</p>

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
