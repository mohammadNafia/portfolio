import type { Locale } from '@/i18n/config';
import type { Block } from '@/content/schema';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { Reveal } from '../ui/Reveal';
import { FanCardArt } from '../home/FanCardArt';
import type { Project } from '@/content/schema';

/**
 * Case-study content blocks.
 *
 * Everything is built from patterns the home page already has: surface fills,
 * pill tags, feature-card columns. No borders, no new component types — the
 * sub-page rule is that it introduces nothing the home page lacks except the
 * chapter rail and the prev/next pair.
 *
 * Reveals attach per block rather than per paragraph, or a long read flickers.
 */
export function BlockRenderer({
  block,
  locale,
  dict,
  project,
}: {
  block: Block;
  locale: Locale;
  dict: Dictionary;
  project: Project;
}) {
  switch (block.type) {
    case 'lead':
      return (
        <Reveal as="p" className="text-[clamp(19px,2vw,23px)] leading-[1.55] text-ink">
          {block.text[locale]}
        </Reveal>
      );

    case 'prose':
      return (
        <Reveal as="p" className="text-[17px] leading-[1.8] text-ink-2">
          {block.text[locale]}
        </Reveal>
      );

    case 'bullets':
      return (
        <Reveal as="ul" className="flex flex-col gap-3">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-3 text-[17px] leading-[1.8] text-ink-2">
              <span
                aria-hidden="true"
                className="mt-[13px] h-2 w-2 shrink-0 rounded-pill"
                style={{ backgroundColor: project.accent }}
              />
              <span>{item[locale]}</span>
            </li>
          ))}
        </Reveal>
      );

    case 'list':
      return (
        <Reveal as="ul" className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item, index) => (
            <li key={index} className="rounded-card bg-surface p-6">
              <h3 className="text-[17px] font-bold leading-snug text-ink">
                {item.title[locale]}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{item.text[locale]}</p>
            </li>
          ))}
        </Reveal>
      );

    case 'callout':
      return (
        <Reveal>
          <aside className="rounded-card bg-surface p-7">
            <h3 className="pixel-title !text-[22px] !text-start">{block.title[locale]}</h3>
            <p className="mt-3 text-[17px] leading-[1.75] text-ink">{block.text[locale]}</p>
          </aside>
        </Reveal>
      );

    case 'facts':
      return (
        <Reveal as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item, index) => (
            <li key={index} className="rounded-card bg-surface p-5">
              <span className="text-[13px] font-semibold text-ink-3">{item.label[locale]}</span>
              <p className="mt-2 text-[15px] leading-snug text-ink">{item.value[locale]}</p>
            </li>
          ))}
        </Reveal>
      );

    case 'showcase':
      return (
        <Reveal as="figure" className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-image bg-surface">
            <div className="aspect-[16/10]">
              <FanCardArt project={project} variant={block.id} />
            </div>
          </div>
          <figcaption className="text-[13px] leading-relaxed text-ink-3">
            {block.caption[locale]}
          </figcaption>
        </Reveal>
      );

    case 'flow':
      return (
        <Reveal as="figure" className="flex flex-col gap-4">
          <ol className="grid gap-3 lg:grid-cols-5">
            {block.steps.map((step, index) => (
              <li key={index} className="rounded-card bg-surface p-5">
                <span
                  className="pixel-title !text-[20px] !text-start"
                  style={{ color: project.accent }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-[15px] font-bold text-ink">{step.label[locale]}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">
                  {step.text[locale]}
                </p>
              </li>
            ))}
          </ol>
          <figcaption className="text-[13px] leading-relaxed text-ink-3">
            {block.caption[locale]}
          </figcaption>
        </Reveal>
      );

    case 'layers':
      return (
        <Reveal as="figure" className="flex flex-col gap-4">
          <ul className="flex flex-col gap-3">
            {block.layers.map((layer, index) => (
              <li
                key={index}
                className="grid gap-3 rounded-card bg-surface p-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-pill"
                      style={{
                        backgroundColor: project.accent,
                        opacity: 1 - index * 0.16,
                      }}
                    />
                    <h3 className="text-[15px] font-bold text-ink">{layer.name[locale]}</h3>
                  </div>
                  <p className="mt-1.5 text-[14px] text-ink-3">{layer.note[locale]}</p>
                </div>
                <ul role="list" className="ltr-island flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-pill bg-bg px-3 py-1.5 text-[13px] font-medium text-ink-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <figcaption className="text-[13px] leading-relaxed text-ink-3">
            {block.caption[locale]}
          </figcaption>
        </Reveal>
      );

    case 'matrix':
      return <MatrixBlock block={block} locale={locale} dict={dict} project={project} />;

    case 'decisions':
      return (
        <Reveal as="ul" className="flex flex-col gap-4">
          {block.items.map((item, index) => (
            <li key={index} className="grid gap-5 rounded-card bg-surface p-6 md:grid-cols-3">
              <div>
                <span className="text-[13px] font-semibold text-ink-3">
                  {locale === 'ar' ? 'التحدّي' : 'Challenge'}
                </span>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                  {item.challenge[locale]}
                </p>
              </div>
              <div>
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: project.accent }}
                >
                  {locale === 'ar' ? 'القرار' : 'Decision'}
                </span>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">
                  {item.decision[locale]}
                </p>
              </div>
              <div>
                <span className="text-[13px] font-semibold text-ink-3">
                  {locale === 'ar' ? 'المقايضة' : 'Trade-off'}
                </span>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                  {item.tradeoff[locale]}
                </p>
              </div>
            </li>
          ))}
        </Reveal>
      );
  }
}

function MatrixBlock({
  block,
  locale,
  dict,
  project,
}: {
  block: Extract<Block, { type: 'matrix' }>;
  locale: Locale;
  dict: Dictionary;
  project: Project;
}) {
  const valueLabel = {
    yes: locale === 'ar' ? 'نعم' : 'Yes',
    no: locale === 'ar' ? 'لا' : 'No',
    partial: locale === 'ar' ? 'جزئي' : 'Partial',
  } as const;

  return (
    <Reveal as="figure" className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-card bg-surface p-2">
        <table className="w-full min-w-[560px] border-collapse">
          <caption className="sr-only">{block.caption[locale]}</caption>
          <thead>
            <tr>
              <th scope="col" className="p-4 text-start text-[13px] font-semibold text-ink-3">
                {dict.common.category}
              </th>
              {block.columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="p-4 text-center text-[13px] font-semibold text-ink-3"
                >
                  {column[locale]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th
                  scope="row"
                  className="p-4 text-start text-[14px] font-normal text-ink-2"
                >
                  {row.label[locale]}
                </th>
                {row.values.map((value, cellIndex) => (
                  <td key={cellIndex} className="p-4 text-center">
                    <span className="sr-only">{valueLabel[value]}</span>
                    <span
                      aria-hidden="true"
                      className="inline-block h-4 w-4 rounded-[5px]"
                      style={{
                        backgroundColor:
                          value === 'yes'
                            ? project.accent
                            : value === 'partial'
                              ? `color-mix(in srgb, ${project.accent} 35%, #ffffff)`
                              : 'rgba(17,17,17,.08)',
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="text-[13px] leading-relaxed text-ink-3">
        {block.caption[locale]}
      </figcaption>
    </Reveal>
  );
}
