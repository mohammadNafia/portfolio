import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';
import { site, socialLinks } from '@/lib/site';
import { Section, SecHead, Sawtooth } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { WavyLink } from '@/components/ui/Button';
import { ContactForm } from '@/components/contact/ContactForm';
import { LocalTime } from '@/components/layout/LocalTime';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';

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

  return pageMetadata({
    locale,
    path: 'contact',
    title: dict.contact.title,
    description: dict.contact.support,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const services = dict.services.items.map((item) => item.title);

  return (
    <>
      <BreadcrumbSchema locale={locale} trail={[{ name: dict.nav.contact, path: 'contact' }]} />

      <div className="pt-[clamp(120px,15vh,168px)]" />

      <Section tone="alt" grain>
        <SecHead as="h1" title={dict.home.contact.title} intro={dict.contact.support} />

        <Reveal className="mx-auto mt-8 max-w-[700px] text-center" delay={160}>
          <p className="text-[17px] leading-[1.8] text-ink-2">
            {socialLinks.map((link, index) => (
              <span key={link.key}>
                {index > 0 ? ' · ' : ''}
                <WavyLink href={link.href} external={link.key !== 'email'}>
                  {link.handle}
                </WavyLink>
              </span>
            ))}
          </p>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] text-ink-3">
            <LocalTime locale={locale} label={dict.common.localTime} />
            <span>{locale === 'ar' ? site.locationAr : site.location}</span>
          </p>
          <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
            {dict.contact.availabilityText}
          </p>
        </Reveal>
      </Section>
      <Sawtooth tone="bg" />

      <Section tone="bg">
        <Reveal className="mx-auto max-w-[700px]">
          <ContactForm locale={locale} dict={dict} services={services} />
        </Reveal>
      </Section>
    </>
  );
}
