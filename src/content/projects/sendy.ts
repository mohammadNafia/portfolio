/**
 * SENDY — flagship case study.
 *
 * Every claim below traces to verified sources in Mohammed's own material:
 *  - `cv/sendy.md` (role notes, responsibilities, deployment targets)
 *  - `cv/cv_data.py` (SENDY_FS / SENDY_PM entries)
 *  - `sendy-dashboard/README.md` + `CLAUDE.md` (stack, roles, RTL-first design)
 *
 * No merchant counts, revenue, uptime or growth figures appear here, because no
 * such figure is documented anywhere in the source material.
 */
export const sendy = {
  slug: 'sendy',
  title: 'Sendy',
  titleLocalized: { en: 'Sendy', ar: 'ساندي' },
  category: 'saas' as const,
  categoryLabel: {
    en: 'Multi-tenant commerce & logistics SaaS',
    ar: 'منصة تجارة ولوجستيات متعددة المستأجرين',
  },
  classification: 'founder-product' as const,
  role: {
    en: 'Founder · Full-stack engineer',
    ar: 'مؤسس · مهندس برمجيات متكامل',
  },
  year: '2026',
  status: { en: 'In production · Pilot merchants', ar: 'في الإنتاج · تجّار تجريبيون' },
  headline: {
    en: 'Iraqi merchants were running a whole business across a notebook, a chat app and three delivery companies. Sendy puts the entire operation in one system.',
    ar: 'كان التاجر العراقي يدير عمله كاملاً بين دفتر ورقي وتطبيق محادثة وثلاث شركات توصيل. ساندي يجمع العملية بالكامل في نظام واحد.',
  },
  summary: {
    en: 'Sendy is a multi-tenant SaaS platform where a merchant runs orders, customers, products, inventory, warehouses, storefronts, delivery, drivers, payments, expenses, subscriptions and analytics from one dashboard. I founded it, shaped the product, and build the frontend platform alongside the backend team.',
    ar: 'ساندي منصة SaaS متعددة المستأجرين يدير فيها التاجر الطلبات والعملاء والمنتجات والمخزون والمخازن والمتاجر الإلكترونية والتوصيل والسائقين والمدفوعات والمصاريف والاشتراكات والتحليلات من لوحة واحدة. أسّستُ المشروع، وصمّمتُ المنتج، وأبني منصة الواجهة الأمامية بالتعاون مع فريق الخادم.',
  },
  problem: {
    en: 'A merchant in Baghdad typically tracks orders in a notebook or a spreadsheet, takes them over Instagram or WhatsApp, hands delivery to two or three separate companies, and only discovers what an order actually cost after it is finished. Nothing reconciles. Inventory drifts. Nobody can answer "did this month make money?" without a manual audit.',
    ar: 'التاجر في بغداد يسجّل الطلبات في دفتر أو جدول بيانات، ويستقبلها عبر إنستغرام أو واتساب، ويسلّم التوصيل إلى شركتين أو ثلاث، ولا يعرف التكلفة الحقيقية للطلب إلا بعد انتهائه. لا شيء يتطابق، والمخزون ينحرف، ولا أحد يستطيع الإجابة عن سؤال «هل ربح هذا الشهر؟» بدون جرد يدوي.',
  },
  outcome: {
    en: 'One tenant-isolated system that carries an order from storefront to delivered and reconciles inventory, payment and cost along the way — in Arabic first, English second, tested with real pilot merchants.',
    ar: 'نظام واحد معزول لكل مستأجر ينقل الطلب من المتجر إلى التسليم، ويطابق المخزون والدفع والتكلفة في الطريق — بالعربية أولاً والإنجليزية ثانياً، ومُختبر مع تجّار تجريبيين حقيقيين.',
  },
  responsibilities: [
    {
      en: 'Founded the project and turned the initial business concept into a functioning SaaS product tested with real merchants.',
      ar: 'أسّستُ المشروع وحوّلتُ الفكرة التجارية الأولية إلى منتج SaaS عامل مُختبر مع تجّار حقيقيين.',
    },
    {
      en: 'Built the merchant dashboard, driver application and online storefronts in React, TypeScript, Tailwind CSS, shadcn/ui and Vite.',
      ar: 'بنيتُ لوحة التاجر وتطبيق السائق والمتاجر الإلكترونية باستخدام React وTypeScript وTailwind CSS وshadcn/ui وVite.',
    },
    {
      en: 'Integrated REST APIs across every module with authentication, RBAC, permission checks, validation, pagination, filtering, and full loading, empty and error states.',
      ar: 'ربطتُ واجهات REST عبر كل وحدة مع المصادقة وصلاحيات الأدوار والتحقق والترقيم والتصفية وحالات التحميل والفراغ والخطأ الكاملة.',
    },
    {
      en: 'Designed Arabic-first bilingual interfaces with complete RTL/LTR parity across the whole platform.',
      ar: 'صمّمتُ واجهات ثنائية اللغة تبدأ بالعربية مع تكافؤ كامل بين RTL وLTR في المنصة بأكملها.',
    },
    {
      en: 'Audited 70+ dashboard tables and data-driven interfaces to standardise a reusable component architecture.',
      ar: 'دقّقتُ أكثر من ٧٠ جدولاً وواجهة معتمدة على البيانات لتوحيد بنية مكوّنات قابلة لإعادة الاستخدام.',
    },
    {
      en: 'Collaborated with backend developers on API contracts, data models and technical documentation.',
      ar: 'تعاونتُ مع مطوّري الخادم على عقود الواجهات ونماذج البيانات والتوثيق التقني.',
    },
    {
      en: 'Deployed releases on DigitalOcean App Platform and Railway — environments, domains, subdomains, DNS and environment configuration.',
      ar: 'نشرتُ الإصدارات على DigitalOcean App Platform وRailway — البيئات والنطاقات والنطاقات الفرعية وDNS وإعدادات البيئة.',
    },
    {
      en: 'Converted pilot-merchant feedback into a prioritised product backlog.',
      ar: 'حوّلتُ ملاحظات التجّار التجريبيين إلى قائمة أولويات منتج.',
    },
  ],
  stack: [
    'React 19',
    'TypeScript',
    'Tailwind CSS',
    'shadcn/ui',
    'Vite',
    'TanStack Query',
    'Zustand',
    'React Hook Form',
    'Zod',
    'i18next',
    'SignalR',
    'ASP.NET Core',
    'PostgreSQL',
    'DigitalOcean',
    'Railway',
  ],
  services: [
    { en: 'Product strategy', ar: 'استراتيجية المنتج' },
    { en: 'Full-stack delivery', ar: 'تنفيذ متكامل' },
    { en: 'Dashboard & operations UI', ar: 'واجهات التشغيل واللوحات' },
    { en: 'Bilingual implementation', ar: 'تنفيذ ثنائي اللغة' },
    { en: 'Deployment & hardening', ar: 'النشر والتقوية' },
  ],
  accent: '#f5a302',
  accentName: 'Sendy amber',
  featured: true,
  tier: 1 as const,
  cover: 'sendy-orders' as const,
  proof: {
    en: 'Founded and engineered · Tested with pilot merchants',
    ar: 'تأسيس وهندسة · مُختبر مع تجّار تجريبيين',
  },
  links: [],
  seo: {
    title: {
      en: 'Sendy — Multi-tenant commerce & logistics SaaS for Iraqi merchants',
      ar: 'ساندي — منصة تجارة ولوجستيات متعددة المستأجرين للتجّار العراقيين',
    },
    description: {
      en: 'How I founded and engineered Sendy: a multi-tenant commerce and logistics platform bringing orders, inventory, storefronts, delivery, payments and analytics into one Arabic-first system.',
      ar: 'كيف أسّستُ وهندستُ ساندي: منصة تجارة ولوجستيات متعددة المستأجرين تجمع الطلبات والمخزون والمتاجر والتوصيل والمدفوعات والتحليلات في نظام واحد يبدأ بالعربية.',
    },
  },
  chapters: [
    {
      id: 'context',
      title: { en: 'The operation before the software', ar: 'العملية قبل البرمجيات' },
      blocks: [
        {
          type: 'lead' as const,
          text: {
            en: 'Sendy did not start from a technology idea. It started from watching how much of an Iraqi merchant’s day is spent moving the same information between systems that do not talk to each other.',
            ar: 'لم يبدأ ساندي من فكرة تقنية، بل من ملاحظة كم من يوم التاجر العراقي يُستهلك في نقل المعلومة نفسها بين أنظمة لا تتحدّث مع بعضها.',
          },
        },
        {
          type: 'prose' as const,
          text: {
            en: 'Orders arrive through Instagram and WhatsApp. They are copied into a notebook or a spreadsheet. Stock is adjusted from memory. Delivery is handed to whichever of two or three companies is answering that day, each with its own sheet and its own status vocabulary. Payment is settled days later, in cash, against a list that has already drifted from reality.',
            ar: 'تصل الطلبات عبر إنستغرام وواتساب، ثم تُنسخ إلى دفتر أو جدول بيانات. يُعدَّل المخزون من الذاكرة. ويُسلَّم التوصيل إلى أي من شركتين أو ثلاث تستجيب في ذلك اليوم، ولكل منها جدولها ومصطلحاتها الخاصة بالحالات. تُسوّى المدفوعات بعد أيام، نقداً، مقابل قائمة انحرفت أصلاً عن الواقع.',
          },
        },
        {
          type: 'prose' as const,
          text: {
            en: 'The cost of that is not inefficiency in the abstract. It is a merchant who genuinely cannot tell you which products make money, how much a delivery zone actually costs to serve, or whether last month was profitable — without sitting down for an evening with a calculator.',
            ar: 'وثمن ذلك ليس «قلة كفاءة» مجرّدة، بل تاجر لا يستطيع فعلياً أن يخبرك أي منتجاته يربح، وكم تكلّف خدمة منطقة توصيل معيّنة، وهل كان الشهر الماضي رابحاً — دون أن يجلس مساءً كاملاً مع آلة حاسبة.',
          },
        },
        {
          type: 'callout' as const,
          title: { en: 'The product thesis', ar: 'فرضية المنتج' },
          text: {
            en: 'A merchant should never have to reconcile two systems by hand. If the order, the stock movement, the delivery status and the money are not the same record, the software has failed.',
            ar: 'يجب ألا يضطر التاجر إلى مطابقة نظامين يدوياً. إذا لم يكن الطلب وحركة المخزون وحالة التوصيل والمال سجلاً واحداً، فقد فشلت البرمجية.',
          },
        },
      ],
    },
    {
      id: 'users',
      title: { en: 'Who actually uses it', ar: 'من يستخدمه فعلياً' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'Sendy is not a single-persona product. Seven distinct roles touch the same order record from different angles, and each needs a different amount of the system exposed to them.',
            ar: 'ساندي ليس منتجاً لشخصية واحدة. سبعة أدوار مختلفة تتعامل مع سجل الطلب نفسه من زوايا مختلفة، ويحتاج كل دور إلى قدر مختلف من النظام.',
          },
        },
        {
          type: 'list' as const,
          items: [
            {
              title: { en: 'Merchant / store owner', ar: 'التاجر / صاحب المتجر' },
              text: {
                en: 'Runs the whole business. Needs the full picture — products, stock, orders, money — without needing to understand the system’s internals.',
                ar: 'يدير العمل بالكامل. يحتاج الصورة الكاملة — المنتجات والمخزون والطلبات والمال — دون أن يفهم التفاصيل الداخلية للنظام.',
              },
            },
            {
              title: { en: 'Call centre & cashier', ar: 'مركز الاتصال والصندوق' },
              text: {
                en: 'High-volume, repetitive entry. Optimised for speed and keyboard flow, not for exploration.',
                ar: 'إدخال متكرر بحجم عالٍ. مُحسَّن للسرعة والعمل بلوحة المفاتيح، لا للاستكشاف.',
              },
            },
            {
              title: { en: 'Delivery company & fleet', ar: 'شركة التوصيل والأسطول' },
              text: {
                en: 'Sees assignments and status transitions across many merchants — but only the fields their contract entitles them to.',
                ar: 'ترى المهام وتحوّلات الحالة عبر تجّار كثر — لكن فقط الحقول التي يخوّلها عقدها.',
              },
            },
            {
              title: { en: 'Driver', ar: 'السائق' },
              text: {
                en: 'A separate, deliberately small application. One screen, one job, usable on a mid-range phone with poor signal.',
                ar: 'تطبيق منفصل صغير عن قصد. شاشة واحدة ومهمة واحدة، قابل للاستخدام على هاتف متوسط بإشارة ضعيفة.',
              },
            },
            {
              title: { en: 'End customer', ar: 'العميل النهائي' },
              text: {
                en: 'Never sees the dashboard. Meets the merchant through a public storefront that must load fast on mobile data.',
                ar: 'لا يرى اللوحة أبداً. يلتقي بالتاجر عبر متجر عام يجب أن يُحمَّل بسرعة على بيانات الهاتف.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'strategy',
      title: { en: 'Scope discipline', ar: 'انضباط النطاق' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'The risk in a platform this wide is obvious: build eleven mediocre modules instead of one system. The rule I set was that a module only ships when it changes the state of an order, a product, or money — and when its state change is visible to every other module that depends on it.',
            ar: 'الخطر في منصة بهذا الاتساع واضح: بناء إحدى عشرة وحدة متوسطة بدل نظام واحد. القاعدة التي وضعتُها أن الوحدة لا تُطلق إلا إذا غيّرت حالة طلب أو منتج أو مال — وأن يكون تغيّر الحالة مرئياً لكل وحدة أخرى تعتمد عليه.',
          },
        },
        {
          type: 'showcase' as const,
          id: 'sendy-orders' as const,
          caption: {
            en: 'Interface concept — the order workspace. Composed from Sendy’s real module structure; not a captured screenshot of the production platform.',
            ar: 'تصوّر للواجهة — مساحة عمل الطلبات. مبني على البنية الفعلية لوحدات ساندي، وليس لقطة شاشة من المنصة في الإنتاج.',
          },
        },
        {
          type: 'bullets' as const,
          items: [
            {
              en: 'Orders, customers, products, inventory and warehouses form the operational core — nothing else ships before these reconcile.',
              ar: 'الطلبات والعملاء والمنتجات والمخزون والمخازن تشكّل النواة التشغيلية — لا شيء آخر يُطلق قبل أن تتطابق هذه.',
            },
            {
              en: 'Storefronts, delivery and drivers extend the order lifecycle outward to the customer and the road.',
              ar: 'المتاجر والتوصيل والسائقون يمدّون دورة حياة الطلب نحو العميل والطريق.',
            },
            {
              en: 'Payments, expenses, discounts and subscriptions attach money to records that already exist rather than creating a parallel ledger.',
              ar: 'المدفوعات والمصاريف والخصومات والاشتراكات تربط المال بسجلات موجودة بدل إنشاء دفتر موازٍ.',
            },
            {
              en: 'Analytics and CRM read from that single source — they never hold their own numbers.',
              ar: 'التحليلات وإدارة العملاء تقرأ من المصدر الواحد — ولا تحتفظ بأرقامها الخاصة أبداً.',
            },
          ],
        },
      ],
    },
    {
      id: 'ux',
      title: { en: 'Interface decisions that mattered', ar: 'قرارات الواجهة المؤثّرة' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'Sendy is Arabic-first. That is a structural decision, not a translation task. The default direction is RTL, the default language is Arabic, and the English interface is the mirrored variant — which is the opposite of how most platforms in the region are built, and it changes how every layout is authored.',
            ar: 'ساندي عربي أولاً. هذا قرار بنيوي لا مهمة ترجمة. الاتجاه الافتراضي RTL واللغة الافتراضية العربية، والواجهة الإنجليزية هي النسخة المعكوسة — وهو عكس ما تُبنى عليه معظم منصات المنطقة، ويغيّر طريقة كتابة كل تخطيط.',
          },
        },
        {
          type: 'decisions' as const,
          items: [
            {
              challenge: {
                en: '70+ data tables were each solving pagination, filtering, empty and error states slightly differently.',
                ar: 'أكثر من ٧٠ جدول بيانات كان كل منها يحل الترقيم والتصفية وحالات الفراغ والخطأ بطريقة مختلفة قليلاً.',
              },
              decision: {
                en: 'I audited every table and data-driven surface, then collapsed them onto one composable table architecture with shared state contracts.',
                ar: 'دقّقتُ كل جدول وكل واجهة معتمدة على البيانات، ثم جمعتُها في بنية جداول واحدة قابلة للتركيب بعقود حالة مشتركة.',
              },
              tradeoff: {
                en: 'A large, unglamorous refactor that produced no new features — paid back on every screen built afterwards.',
                ar: 'إعادة هيكلة كبيرة وغير براقة لم تنتج ميزات جديدة — لكنها سدّدت نفسها في كل شاشة بُنيت بعدها.',
              },
            },
            {
              challenge: {
                en: 'Mirroring the interface for English kept breaking numeric, currency and technical fields.',
                ar: 'عكس الواجهة للإنجليزية كان يكسر باستمرار الحقول الرقمية والنقدية والتقنية.',
              },
              decision: {
                en: 'Directional layout is mirrored; identifiers, currency, phone numbers, URLs and technical tokens are isolated as LTR islands regardless of locale.',
                ar: 'التخطيط الاتجاهي يُعكس؛ أما المعرّفات والعملة وأرقام الهواتف والروابط والرموز التقنية فتُعزل كجزر LTR بغضّ النظر عن اللغة.',
              },
              tradeoff: {
                en: 'Every new field has to declare its directional behaviour — more discipline up front, no bidirectional bugs later.',
                ar: 'كل حقل جديد يجب أن يعلن سلوكه الاتجاهي — انضباط أكبر في البداية، وصفر أخطاء ثنائية الاتجاه لاحقاً.',
              },
            },
            {
              challenge: {
                en: 'Delivery partners and merchants needed the same order screen with materially different visibility.',
                ar: 'شركاء التوصيل والتجّار احتاجوا شاشة الطلب نفسها بمستويات ظهور مختلفة جوهرياً.',
              },
              decision: {
                en: 'Permission checks run at the field level, not just the route level, so one screen renders honestly for seven roles.',
                ar: 'تحقّق الصلاحيات يعمل على مستوى الحقل لا المسار فقط، فتُعرض الشاشة الواحدة بصدق لسبعة أدوار.',
              },
              tradeoff: {
                en: 'More complex render logic, but no duplicated screens drifting apart over time.',
                ar: 'منطق عرض أعقد، لكن دون شاشات مكرّرة تتباعد مع الوقت.',
              },
            },
          ],
        },
        {
          type: 'showcase' as const,
          id: 'sendy-storefront' as const,
          caption: {
            en: 'Interface concept — merchant storefront. The customer-facing surface is a separate design problem from the operational dashboard.',
            ar: 'تصوّر للواجهة — متجر التاجر. الواجهة الموجّهة للعميل مسألة تصميمية منفصلة عن لوحة التشغيل.',
          },
        },
      ],
    },
    {
      id: 'architecture',
      title: { en: 'System architecture', ar: 'معمارية النظام' },
      blocks: [
        {
          type: 'layers' as const,
          caption: {
            en: 'Platform layers. The dashboard, driver app and storefronts are separate clients over one tenant-scoped API.',
            ar: 'طبقات المنصة. اللوحة وتطبيق السائق والمتاجر عملاء منفصلون فوق واجهة واحدة محدّدة بالمستأجر.',
          },
          layers: [
            {
              name: { en: 'Clients', ar: 'العملاء' },
              note: {
                en: 'Three surfaces, one component language',
                ar: 'ثلاث واجهات بلغة مكوّنات واحدة',
              },
              items: ['Merchant dashboard', 'Driver app', 'Public storefronts'],
            },
            {
              name: { en: 'Client state', ar: 'حالة العميل' },
              note: {
                en: 'Server state and real-time state kept deliberately separate',
                ar: 'فصل مقصود بين حالة الخادم والحالة الفورية',
              },
              items: ['TanStack Query', 'Zustand', 'React Hook Form + Zod', 'i18next'],
            },
            {
              name: { en: 'Transport', ar: 'النقل' },
              note: {
                en: 'REST for records, sockets for live tracking',
                ar: 'REST للسجلات، وSockets للتتبّع الحي',
              },
              items: ['REST API', 'SignalR / socket.io', 'JWT + RBAC'],
            },
            {
              name: { en: 'Services', ar: 'الخدمات' },
              note: { en: 'Tenant-scoped business rules', ar: 'قواعد عمل محدّدة بالمستأجر' },
              items: ['ASP.NET Core', 'PostgreSQL', 'Payment gateways', 'Delivery providers'],
            },
            {
              name: { en: 'Platform', ar: 'المنصة' },
              note: {
                en: 'Separate development and production environments',
                ar: 'بيئتا تطوير وإنتاج منفصلتان',
              },
              items: ['DigitalOcean App Platform', 'Railway', 'Custom domains + DNS'],
            },
          ],
        },
        {
          type: 'flow' as const,
          caption: {
            en: 'Order lifecycle — the spine of the platform. Every module attaches to a stage of this sequence.',
            ar: 'دورة حياة الطلب — العمود الفقري للمنصة. كل وحدة ترتبط بمرحلة من هذا التسلسل.',
          },
          steps: [
            {
              label: { en: 'Placed', ar: 'مُنشأ' },
              text: {
                en: 'Created from the storefront, the call centre, or the merchant directly. Same record either way.',
                ar: 'يُنشأ من المتجر أو مركز الاتصال أو التاجر مباشرة. السجل نفسه في كل الحالات.',
              },
            },
            {
              label: { en: 'Reserved', ar: 'محجوز' },
              text: {
                en: 'Stock is committed against the warehouse so two orders cannot claim the same unit.',
                ar: 'يُحجز المخزون مقابل المخزن حتى لا يطالب طلبان بالوحدة نفسها.',
              },
            },
            {
              label: { en: 'Assigned', ar: 'مُسند' },
              text: {
                en: 'Routed to a delivery company or an in-house driver, with the assignment visible to both sides.',
                ar: 'يُوجَّه إلى شركة توصيل أو سائق داخلي، مع ظهور الإسناد للطرفين.',
              },
            },
            {
              label: { en: 'In transit', ar: 'قيد التوصيل' },
              text: {
                en: 'Driver status updates flow back live; the merchant sees the same state the driver reports.',
                ar: 'تتدفّق تحديثات السائق مباشرة؛ ويرى التاجر الحالة نفسها التي يبلّغ عنها السائق.',
              },
            },
            {
              label: { en: 'Settled', ar: 'مُسوّى' },
              text: {
                en: 'Delivery outcome, payment and cost land on the order — so analytics never needs a manual reconciliation.',
                ar: 'تُسجَّل نتيجة التوصيل والدفع والتكلفة على الطلب — فلا تحتاج التحليلات إلى مطابقة يدوية.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'engineering',
      title: { en: 'Engineering challenges', ar: 'التحديات الهندسية' },
      blocks: [
        {
          type: 'list' as const,
          items: [
            {
              title: { en: 'Multi-tenancy without leaks', ar: 'تعدّد المستأجرين دون تسريب' },
              text: {
                en: 'Every query, every socket subscription and every uploaded asset is scoped to a tenant. The failure mode here is not a bug, it is one merchant seeing another merchant’s customers — so tenant scope is enforced at the data layer rather than trusted from the client.',
                ar: 'كل استعلام وكل اشتراك Socket وكل ملف مرفوع محدّد بالمستأجر. الفشل هنا ليس خللاً عادياً بل رؤية تاجر لعملاء تاجر آخر — لذلك يُفرض نطاق المستأجر في طبقة البيانات لا بالثقة بالعميل.',
              },
            },
            {
              title: { en: 'Real-time without chaos', ar: 'التتبّع الحي دون فوضى' },
              text: {
                en: 'Live delivery tracking and server-cached records are two different kinds of state. Mixing them produces interfaces that flicker and lie. Server state stays in the query cache; live positions and status pushes live in a separate real-time store.',
                ar: 'التتبّع الحي والسجلات المخزّنة نوعان مختلفان من الحالة. خلطهما ينتج واجهات ترتجف وتكذب. حالة الخادم تبقى في ذاكرة الاستعلام، بينما المواقع الحية وتحديثات الحالة في مخزن فوري منفصل.',
              },
            },
            {
              title: { en: 'Bidirectional layout at scale', ar: 'التخطيط ثنائي الاتجاه على نطاق واسع' },
              text: {
                en: 'RTL is straightforward on a marketing page and genuinely hard across dense operational tables, charts, date pickers and drawer navigation. Building logical-property layouts from the start was cheaper than mirroring a finished LTR product.',
                ar: 'دعم RTL سهل في صفحة تعريفية وصعب فعلاً عبر جداول تشغيلية كثيفة ومخططات ومنتقيات تواريخ وقوائم جانبية. بناء التخطيط بخصائص منطقية من البداية كان أرخص من عكس منتج LTR مكتمل.',
              },
            },
            {
              title: { en: 'Integrations that fail politely', ar: 'تكاملات تفشل بلباقة' },
              text: {
                en: 'Payment gateways and delivery providers are external and occasionally unavailable. Payment sessions, webhook handling and transaction status surfaces are built so a provider outage degrades one module instead of stopping the merchant from working.',
                ar: 'بوابات الدفع ومزوّدو التوصيل خارجيون وقد ينقطعون. جلسات الدفع ومعالجة Webhooks وواجهات حالة المعاملات مبنية بحيث يُضعف انقطاع المزوّد وحدة واحدة بدل إيقاف عمل التاجر.',
              },
            },
          ],
        },
        {
          type: 'showcase' as const,
          id: 'sendy-inventory' as const,
          caption: {
            en: 'Interface concept — inventory and warehouse reconciliation, where stock commitments meet the order lifecycle.',
            ar: 'تصوّر للواجهة — مطابقة المخزون والمخازن، حيث تلتقي حجوزات المخزون بدورة حياة الطلب.',
          },
        },
      ],
    },
    {
      id: 'outcome',
      title: { en: 'Where it stands', ar: 'أين وصل' },
      blocks: [
        {
          type: 'facts' as const,
          items: [
            {
              label: { en: 'Status', ar: 'الحالة' },
              value: {
                en: 'In production, tested with pilot merchants',
                ar: 'في الإنتاج، مُختبر مع تجّار تجريبيين',
              },
            },
            {
              label: { en: 'My role', ar: 'دوري' },
              value: {
                en: 'Founder and full-stack engineer',
                ar: 'مؤسس ومهندس برمجيات متكامل',
              },
            },
            {
              label: { en: 'Surfaces shipped', ar: 'الواجهات المُنجزة' },
              value: {
                en: 'Merchant dashboard, driver app, storefronts',
                ar: 'لوحة التاجر، تطبيق السائق، المتاجر',
              },
            },
            {
              label: { en: 'Languages', ar: 'اللغات' },
              value: { en: 'Arabic (default) and English', ar: 'العربية (افتراضية) والإنجليزية' },
            },
          ],
        },
        {
          type: 'prose' as const,
          text: {
            en: 'The most useful thing Sendy taught me is that operational software is judged on the day something goes wrong, not the day it is demoed. A merchant does not care that the dashboard is elegant if a delivery provider times out and the order is stuck in a state nobody can explain. Most of the engineering effort that matters went into the unglamorous half — permission checks, error states, reconciliation, and making failure legible.',
            ar: 'أهم ما علّمني إياه ساندي أن البرمجيات التشغيلية تُقيَّم يوم يحدث خطأ، لا يوم العرض. لا يهم التاجر أن تكون اللوحة أنيقة إذا انقطع مزوّد التوصيل وعلق الطلب في حالة لا يفسّرها أحد. معظم الجهد الهندسي المهم ذهب إلى النصف غير البرّاق — فحوص الصلاحيات، وحالات الخطأ، والمطابقة، وجعل الفشل مقروءاً.',
          },
        },
        {
          type: 'callout' as const,
          title: { en: 'What I would do differently', ar: 'ما كنتُ سأفعله بشكل مختلف' },
          text: {
            en: 'I would standardise the table and data-state architecture before building seventy screens on top of it, not after. The audit worked, but it was a refactor I had already paid for once.',
            ar: 'كنتُ سأوحّد بنية الجداول وحالات البيانات قبل بناء سبعين شاشة فوقها، لا بعدها. نجح التدقيق، لكنه كان إعادة هيكلة دفعتُ ثمنها مرة سابقاً.',
          },
        },
      ],
    },
  ],
};
