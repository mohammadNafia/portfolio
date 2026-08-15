import type { Project } from '@/content/schema';

/**
 * Fan / gallery card faces.
 *
 * No product screenshots exist yet (docs/content-gaps.md §1), and the image
 * manifest is explicit that a missing file gets a `--surface` block at the right
 * ratio rather than a stretched stand-in. These go one better: an abstract
 * per-project face built from the project's own accent, so seven cards read as
 * seven products instead of seven grey rectangles. Swap for real screenshots as
 * soon as they exist.
 *
 * One component draws all of them — the hero fan, the work gallery, the case
 * carousel, the work index and every case-study composition — so a project looks
 * like itself everywhere it appears.
 */
export function FanCardArt({
  project,
  /**
   * Case studies show several compositions; without this they would all render
   * the project's single face. The showcase id picks the variant, so an order
   * table, a storefront and an inventory view stay visually distinct.
   */
  variant,
}: {
  project: Project;
  variant?: string;
}) {
  const accent = project.accent;
  const face = variant ?? project.slug;

  /*
   * `justify-center` because the same face renders into boxes from 210×280 (a
   * fan card) to 16:10 (a case-study showcase). Rows are auto-height, so
   * top-aligned they filled the narrow cards and left the wide ones two-thirds
   * empty. Faces that want a different distribution append their own
   * `justify-*`, which wins by source order.
   */
  const plate = 'flex h-full w-full flex-col justify-center gap-2 rounded-image bg-surface p-3';
  /*
   * Rows grow to share the plate's height. Fixed-height rows filled a 210×280
   * fan card and left a 16:10 case-study showcase almost entirely empty — the
   * same face has to read at both.
   */
  const row_ = 'flex flex-1 items-center gap-2';

  const bar = (width: string, strong = false) => (
    <span
      className="block h-2 rounded-pill"
      style={{ width, backgroundColor: strong ? accent : 'rgba(17,17,17,.12)' }}
    />
  );

  return (
    /*
     * `h-full w-full` as well as `flex-1`, because this renders into containers
     * with three different display modes: the fan card (flex column), the case
     * card cover (flex row) and two fixed-aspect blocks — the case-study hero
     * and every in-chapter showcase.
     *
     * With `flex-1` alone the block parents ignored it, the art collapsed to its
     * content height, and those surfaces rendered as a thin strip of interface
     * above a tall empty rectangle. In a flex parent `flex-basis: 0%` is
     * definite so the height is ignored on the main axis; in a block parent the
     * height is what fills the box. One rule covers all five.
     */
    <div
      className="relative min-h-0 h-full w-full flex-1 p-3"
      style={{
        background: `linear-gradient(158deg, color-mix(in srgb, ${accent} 30%, #ffffff), color-mix(in srgb, ${accent} 8%, #ffffff))`,
      }}
      aria-hidden="true"
    >
      {renderFace()}
    </div>
  );

  function renderFace() {
    switch (face) {
      /* Sendy — a dense order table. */
      case 'sendy':
      case 'sendy-orders':
      case 'generic-dashboard':
        return (
          <div className={plate}>
            {[0, 1, 2, 3, 4].map((row) => (
              <div key={row} className={row_}>
                <span
                  className="h-2 w-2 shrink-0 rounded-pill"
                  style={{ backgroundColor: row === 0 ? accent : 'rgba(17,17,17,.14)' }}
                />
                {bar(`${42 + row * 11}%`)}
              </div>
            ))}
          </div>
        );

      /*
       * IMMAR's student app — a phone on its own, so it does not read as the
       * same picture as the dashboard beside it.
       */
      case 'immar-mobile':
        return (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-full w-[34%] flex-col gap-2 rounded-image bg-surface p-2">
              <span
                className="block h-[34%] w-full shrink-0 rounded-image"
                style={{ backgroundColor: `color-mix(in srgb, ${accent} 55%, #ffffff)` }}
              />
              {[86, 70, 92, 64].map((w, i) => (
                <span
                  key={i}
                  className="block h-1.5 rounded-pill bg-[rgba(17,17,17,.12)]"
                  style={{ width: `${w}%` }}
                />
              ))}
              <span
                className="mt-auto block h-3 w-1/2 shrink-0 rounded-pill"
                style={{ backgroundColor: accent }}
              />
            </div>
          </div>
        );

      /* IMMAR's roles matrix — a permission grid, ticked down the diagonal. */
      case 'immar-roles':
        return (
          <div className={plate}>
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className={row_}>
                {bar('30%')}
                <div className="flex flex-1 justify-around gap-2">
                  {[0, 1, 2, 3].map((col) => (
                    <span
                      key={col}
                      className="h-3 w-3 rounded-[4px]"
                      style={{
                        backgroundColor:
                          col <= 3 - row ? accent : 'rgba(17,17,17,.10)',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      /* IMMAR — a phone beside a dashboard. */
      case 'immar':
      case 'immar-dashboard':
        return (
          <div className="flex h-full w-full items-end gap-2">
            <div className="h-[74%] w-[36%] rounded-image bg-surface p-2">
              <span
                className="block h-[40%] w-full rounded-image"
                style={{ backgroundColor: `color-mix(in srgb, ${accent} 55%, #ffffff)` }}
              />
              <span className="mt-2 block h-1.5 w-3/4 rounded-pill bg-[rgba(17,17,17,.12)]" />
            </div>
            <div className="h-[88%] flex-1 rounded-image bg-surface p-2">
              <div className="grid h-full grid-cols-3 gap-1.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className="rounded-[4px]"
                    style={{
                      backgroundColor:
                        i % 4 === 0
                          ? `color-mix(in srgb, ${accent} 50%, #ffffff)`
                          : 'rgba(17,17,17,.07)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      /* NANO's output view — a source document beside the fields pulled out of it. */
      case 'nano-output':
        return (
          <div className="flex h-full w-full gap-2">
            <div className="flex flex-1 flex-col gap-1.5 rounded-image bg-white/60 p-3">
              {[88, 72, 94, 66, 80].map((w, i) => (
                <span
                  key={i}
                  className="block h-1.5 rounded-pill bg-[rgba(17,17,17,.10)]"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2 rounded-image bg-surface p-3">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-pill"
                    style={{ backgroundColor: accent }}
                  />
                  {bar(`${52 + row * 14}%`)}
                </div>
              ))}
            </div>
          </div>
        );

      /* NANO — blur resolving into structure. */
      case 'nano-ocr':
      case 'nano-pipeline':
        return (
          <div className="flex h-full w-full flex-col gap-2">
            <div className="flex flex-1 flex-col justify-center gap-1.5 rounded-image bg-white/60 p-3">
              {[82, 64, 90].map((w, i) => (
                <span
                  key={i}
                  className="block h-2 rounded-pill bg-[rgba(17,17,17,.12)] blur-[2px]"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1.5 rounded-image bg-surface p-3">
              {[82, 64, 90].map((w, i) => (
                <span
                  key={i}
                  className="block h-2 rounded-pill"
                  style={{ width: `${w}%`, backgroundColor: 'rgba(17,17,17,.22)' }}
                />
              ))}
            </div>
          </div>
        );

      /* Al-Tafawuq — attendance as a small column chart. */
      case 'al-tafawuq':
      case 'sendy-inventory':
        return (
          <div className={`${plate} justify-end`}>
            <div className="flex h-[64%] items-end gap-2">
              {[38, 66, 48, 82, 58, 72].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t-[4px]"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i === 3 ? accent : 'rgba(17,17,17,.12)',
                  }}
                />
              ))}
            </div>
          </div>
        );

      /* Form Builder — draggable blocks assembling a form. */
      case 'form-builder':
      case 'sendy-storefront':
        return (
          <div className={plate}>
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className={`${row_} rounded-image p-2`}
                style={{
                  outline: row === 1 ? `2px dashed ${accent}` : '2px solid rgba(17,17,17,.08)',
                  outlineOffset: '-2px',
                }}
              >
                <span
                  className="h-4 w-4 shrink-0 rounded-[4px]"
                  style={{ backgroundColor: row === 1 ? accent : 'rgba(17,17,17,.14)' }}
                />
                {bar(`${48 + row * 12}%`)}
              </div>
            ))}
          </div>
        );

      /* Invoice — a receipt with a total rule. */
      case 'invoice-mini-app':
        return (
          <div className={plate}>
            {bar('52%', true)}
            {[80, 66, 88, 58].map((w, i) => (
              <div key={i} className={`${row_} justify-between`}>
                {bar(`${w * 0.62}%`)}
                <span className="block h-2 w-4 rounded-pill bg-[rgba(17,17,17,.08)]" />
              </div>
            ))}
            <span className="mt-auto block h-2 w-1/3 rounded-pill" style={{ backgroundColor: accent }} />
          </div>
        );

      /*
       * Virtual Banking — a wallet on a phone: the card, the three actions
       * under it, and the transaction rows below.
       *
       * Keyed on the slug as well as the showcase id, because the work grid,
       * the hero fan and the archive all draw this project with no `variant`
       * and would otherwise fall through to the request lifecycle below — the
       * face it carried while the case study was described as backend-only.
       */
      case 'virtual-banking':
      case 'generic-wallet':
        return (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-full w-[46%] flex-col gap-2 rounded-image bg-surface p-2">
              {/* The card: the one strong accent block on the face. */}
              <span
                className="block h-[30%] w-full shrink-0 rounded-image"
                style={{ backgroundColor: accent }}
              />
              <div className="flex shrink-0 gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-3 flex-1 rounded-[4px]"
                    style={{
                      backgroundColor:
                        i === 0 ? `color-mix(in srgb, ${accent} 45%, #ffffff)` : 'rgba(17,17,17,.10)',
                    }}
                  />
                ))}
              </div>
              {[0, 1, 2].map((row) => (
                <div key={row} className={row_}>
                  <span className="h-2 w-2 shrink-0 rounded-pill bg-[rgba(17,17,17,.14)]" />
                  {bar(`${58 - row * 9}%`)}
                </div>
              ))}
            </div>
          </div>
        );

      /* Backend projects — a request and its states. */
      default:
        return (
          <div className={plate}>
            {/* Texture, not a brand moment: at 11px the lighter accents
                measured ~3.1:1 on --surface, so this takes ink. */}
            <span className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-wide text-ink-2">
              POST /
            </span>
            {[72, 54, 86].map((w, i) => (
              <span key={i}>{bar(`${w}%`)}</span>
            ))}
            <div className="mt-auto flex gap-1.5">
              {[accent, 'rgba(17,17,17,.12)', 'rgba(17,17,17,.12)'].map((c, i) => (
                <span key={i} className="h-2 w-6 rounded-pill" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        );
    }
  }
}
