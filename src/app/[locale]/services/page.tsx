import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeHref, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { projects } from '@/content';
import { Section, SecHead, Sawtooth, Tag } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button, QuietLink } from '@/components/ui/Button';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    title: dict.services.title,
    description: dict.services.support,
    alternates: {
      canonical: localeHref(locale, 'services'),
      languages: { en: '/en/services', ar: '/ar/services', 'x-default': '/en/services' },
    },
  };
}

/** Each service links to the project that proves it — never a borrowed one. */
const PROOF_SLUGS = [
  'immar',
  'sendy',
  'virtual-banking',
  'al-tafawuq',
  'sendy',
  'nano-ocr',
  'al-tafawuq',
] as const;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const { services } = dict;

  return (
    <>
      <div className="pt-[clamp(120px,15vh,168px)]" />

      <Section tone="alt" grain>
        <SecHead title={dict.nav.services} intro={services.support} />
      </Section>
      <Sawtooth tone="bg" />

      <Section tone="bg">
        <ul role="list" className="flex flex-col gap-5">
          {services.items.map((service, index) => {
            const proof = projects.find((p) => p.slug === PROOF_SLUGS[index]);

            return (
              <Reveal
                key={service.title}
                as="li"
                delay={index * 80}
                className="rounded-card bg-surface p-7 md:p-9"
              >
                <div className="grid gap-6 lg:grid-cols-3">
                  <div>
                    <span className="pixel-title block !text-[22px] !text-start text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 text-[clamp(20px,2vw,25px)] font-semibold leading-tight text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                      <span className="font-semibold text-ink">{services.forWhom}: </span>
                      {service.forWhom}
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div>
                      <h4 className="text-[13px] font-semibold text-ink-3">{services.solves}</h4>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                        {service.solves}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-ink-3">{services.howIWork}</h4>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                        {service.howIWork}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div>
                      <h4 className="text-[13px] font-semibold text-ink-3">
                        {services.deliverables}
                      </h4>
                      <ul role="list" className="mt-2 flex flex-col gap-2">
                        {service.deliverables.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2.5 text-[15px] leading-relaxed text-ink-2"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-pill bg-accent-bright"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {proof ? (
                      <div>
                        <h4 className="text-[13px] font-semibold text-ink-3">{services.proof}</h4>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <Tag brand={proof.accent}>{dict.classification[proof.classification]}</Tag>
                          <QuietLink href={localeHref(locale, `work/${proof.slug}`)}>
                            {proof.titleLocalized[locale]}
                            <span aria-hidden="true" className="rtl:-scale-x-100">
                              →
                            </span>
                          </QuietLink>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Section>
      <Sawtooth tone="alt" />

      <Section tone="alt" grain>
        <SecHead title={services.engagementTitle} intro={services.engagementText} />
        <Reveal className="mt-10 flex justify-center" delay={160}>
          <Button variant="dark" href={localeHref(locale, 'contact')}>
            {services.cta}
          </Button>
        </Reveal>
      </Section>
    </>
  );
}
