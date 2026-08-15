# Identity system

The brief: an Iraqi engineer's portfolio that reads as premium and credible to someone who
knows nothing about Iraq, and as genuine to someone who does. Origin as character, not costume.

## The idea

**Pixel craft on a light ground.** The identity is carried by a single decision — a pixel
display face used at large sizes on a warm off-white ground, with everything else kept
deliberately plain. There is no ornament competing with it: no borders, no gradients, no
texture beyond a faint grain. The recognisability budget is spent entirely on the type and on
the sawtooth seam.

This replaced an earlier "engineering drawing" direction (hairline grids, monospaced
annotation, a wedge mark). That system was coherent but generic — it looked like a hundred
other engineer portfolios. The pixel face does not.

## Elements

### The pixel face

**Handjet**, `font-variation-settings: 'ELGR' 1, 'ELSH' 0` — square elements rather than round
dots. It appears in exactly three places: the hero's second line, every section title, and
pixel numerals. Never below 26px, where the elements stop resolving and it reads as damage
rather than as a choice.

**Handjet ships Arabic as well as Latin.** That is the whole reason it was chosen over
Silkscreen, and it is the single most consequential decision in the identity. A pixel face with
no Arabic would have forced the Arabic site into a different display voice — two visual systems
under one name, with the Arabic one visibly the afterthought. Instead `مهندس برمجيات` renders in
the same pixel face as `SOFTWARE ENGINEER`, with correct joining, and the identity is the same
identity in both locales.

Verified visually at hero scale in Chromium, Firefox and WebKit.

### The sawtooth seam

A 50×36px triangle mask at every background change. Not a line, not a curve, not a fade — the
same notch, at every join, on every route. It is the site's second recognisable mark and it is
purely structural: it only ever exists where two grounds meet.

It is the pixel logic applied to layout. The type is quantised into square elements; the seam
quantises the edge between sections the same way.

### The squiggle

A short hand-drawn stroke under every section title, centred. It is the one soft, non-quantised
mark in the system, and it exists to keep the pixel face from reading as cold.

### Colour

Warm off-white ground, white raised surfaces, and **one** blue. The blue is split by function,
not by taste:

- `--accent` `#0A6DC4` — anything carrying text: buttons, links, the nav CTA. Also every focus
  ring, which is the one graphic the bright blue cannot serve.
- `--accent-bright` `#0B8DF8` — text-free graphics: the carousel chevron, glows, bullet marks.

The bright blue is the recognisable one and it measures 3.4:1 — which clears the 3:1 non-text
threshold and fails the 4.5:1 text threshold. Splitting the token keeps the colour where it is
legal and swaps it where it is not, rather than losing it everywhere. See `design-system.md`.

Per-project accents appear only on brand tags, one per card.

### No borders

Separation comes from surface fills and four soft shadows. Nothing on the site has a 1px rule.
This is the rule most likely to be broken by accident when adding a section, and the easiest to
spot when it has been.

### Place as metadata

Baghdad appears three ways, each once per page at most:

- Local time in the footer and on Contact — live, `Asia/Baghdad`.
- Coordinates `33.3152° N, 44.3661° E`, set in the pixel face.
- The origin line `Engineered in Baghdad · Built for the world` /
  `هُندِس في بغداد · وصُمّم للعالم`.

## Where the Iraqi character actually lives

Not in ornament — in the work:

- **Sendy** exists because Iraqi merchants run businesses across a notebook, a chat app and
  three delivery companies. That problem is specific to this market.
- **Arabic-first engineering.** Sendy defaults to Arabic and RTL, with English as the mirrored
  variant. That is the opposite of how most regional platforms are built, and the case study
  says why it matters.
- **IMMAR** solves a multi-teacher education problem shaped by how private tutoring works here.
- **Regional payment and delivery realities** — cash settlement, multiple delivery providers,
  reconciliation after the fact — appear as engineering constraints, not colour.

A reader who knows nothing about Iraq sees a serious engineer solving concrete operational
problems. A reader who knows the market recognises every one of them.

## Deliberately excluded

Flags, maps, monuments, lions, domes, palm trees, ancient artefacts as decoration, fake
cuneiform, gold/sand "heritage" palettes, generic Middle Eastern pattern fills, nationalism
that competes with the work, and any claim to be Iraq's best or first.

Also excluded, from the general "AI-site" vocabulary: gradient blobs, starfields, floating
language logos, fake terminal windows, bento résumés, glassmorphism, neon glow, stock developer
illustrations, meaningless 3D, repeated laptop mockups, tech-badge walls, and intro loaders.

Two things were cut specifically during the restyle: the **custom cursor** and **invented client
logos**. The cursor because the system has no such component; the logos because there are no
real ones, and a marquee of tools I actually use says the same thing truthfully.

## Recognition

The site's signature is the **hero fan**: seven real product cards in a shallow arc that arrive
stacked and spread outward in pairs, then float. It is recognisable in a three-second silent
clip, and it communicates the thing that matters most in the first screen — that these are real
products, not a list of skills.

Under reduced motion the fan is static, complete and linked. The recognisability does not
depend on the movement.
