/**
 * Tier-2 projects. Each is presented at the depth its evidence supports —
 * a strong honest technical presentation rather than invented UI galleries.
 *
 * Sources: `cv/cv_data.py` (TAFAWUQ_FS, VIRTUAL_BANKING, INVOICE_APP,
 * ACHIEVEMENTS), `school-system/project-docs/PROJECT-OVERVIEW.md`,
 * `MedicHub/MedicHub/README.md`.
 */

export const altafawuq = {
  slug: 'al-tafawuq',
  title: 'Al-Tafawuq School System',
  titleLocalized: { en: 'Al-Tafawuq School System', ar: 'نظام مدرسة التفوّق' },
  category: 'dashboard' as const,
  categoryLabel: {
    en: 'School operations platform',
    ar: 'منصة تشغيل مدرسية',
  },
  classification: 'client-product' as const,
  role: { en: 'Full-stack engineer', ar: 'مهندس برمجيات متكامل' },
  year: '2025',
  status: { en: 'Delivered · Deployed', ar: 'مُسلَّم · منشور' },
  headline: {
    en: 'One school, four repositories, and a parent who only ever sees a WhatsApp link.',
    ar: 'مدرسة واحدة، وأربعة مستودعات، وولي أمر لا يرى سوى رابط واتساب.',
  },
  summary: {
    en: 'A centralised, Arabic-first school management platform covering students, classes, attendance, academic records, reports and notifications, built for administrators, teachers and authorised staff across a .NET backend, a Next.js dashboard and a static bilingual landing site.',
    ar: 'منصة إدارة مدرسية مركزية تبدأ بالعربية، تغطّي الطلاب والصفوف والحضور والسجلات الأكاديمية والتقارير والإشعارات، مبنية للإداريين والمعلّمين والطاقم المخوّل عبر خادم .NET ولوحة Next.js وموقع تعريفي ثنائي اللغة.',
  },
  problem: {
    en: 'School operations run on paper registers, personal phones and memory. The information a parent wants — attendance, marks, fees — exists, but it is scattered across staff who each hold one piece of it.',
    ar: 'تُدار عمليات المدرسة بسجلات ورقية وهواتف شخصية وذاكرة. المعلومة التي يريدها ولي الأمر — الحضور والدرجات والأقساط — موجودة، لكنها مبعثرة بين موظفين يحمل كل منهم جزءاً منها.',
  },
  outcome: {
    en: 'A deployed platform where all business rules live in one API, verified end to end with seed data and prepared sample accounts before handover.',
    ar: 'منصة منشورة تعيش فيها كل قواعد العمل في واجهة واحدة، مُتحقَّق منها من الطرف إلى الطرف ببيانات أولية وحسابات نموذجية قبل التسليم.',
  },
  responsibilities: [
    {
      en: 'Built a centralised school-management platform covering students, classes, attendance, academic records, reports, notifications and daily operations.',
      ar: 'بنيتُ منصة إدارة مدرسية مركزية تغطّي الطلاب والصفوف والحضور والسجلات الأكاديمية والتقارير والإشعارات والعمليات اليومية.',
    },
    {
      en: 'Implemented authentication, role-based access control, permission management, database modelling, validation and protected workflows.',
      ar: 'نفّذتُ المصادقة وصلاحيات الأدوار وإدارة الأذونات ونمذجة قاعدة البيانات والتحقق والمسارات المحمية.',
    },
    {
      en: 'Developed the backend and data layer with ASP.NET Core, EF Core, PostgreSQL and REST APIs following Clean Architecture.',
      ar: 'طوّرتُ طبقة الخادم والبيانات بـASP.NET Core وEF Core وPostgreSQL وواجهات REST وفق المعمارية النظيفة.',
    },
    {
      en: 'Configured environments and deployed on Railway, verifying authentication, permissions and major workflows with seed data.',
      ar: 'هيّأتُ البيئات ونشرتُ على Railway، وتحقّقتُ من المصادقة والصلاحيات والمسارات الرئيسية ببيانات أولية.',
    },
  ],
  stack: [
    '.NET 8',
    'ASP.NET Core',
    'EF Core',
    'PostgreSQL 16',
    'Redis',
    'Next.js 15',
    'TypeScript',
    'Tailwind CSS',
    'Railway',
  ],
  services: [
    { en: 'Backend architecture', ar: 'معمارية الخادم' },
    { en: 'Operational dashboards', ar: 'لوحات التشغيل' },
    { en: 'Deployment support', ar: 'دعم النشر' },
  ],
  accent: '#3f8f52',
  accentName: 'Tafawuq green',
  featured: false,
  tier: 2 as const,
  cover: 'generic-dashboard' as const,
  heroImage: {
    src: '/img/hero-al-tafawuq.webp',
    width: 1254,
    height: 1254,
    alt: {
      en: 'The Al-Tafawuq administrator dashboard: attendance over thirty days, tuition totals, pending tasks and the latest payments.',
      ar: 'لوحة تحكّم إدارة مدرسة التفوّق: الحضور خلال ثلاثين يوماً، ومجاميع الأقساط، والمهام المعلّقة، وآخر الدفعات.',
    },
  },
  links: [],
  seo: {
    title: {
      en: 'Al-Tafawuq School Management System — school operations platform',
      ar: 'نظام إدارة مدرسة التفوّق — منصة تشغيل مدرسية',
    },
    description: {
      en: 'An Arabic-first school management platform built across a .NET 8 API, a Next.js operational dashboard and a static bilingual landing site.',
      ar: 'منصة إدارة مدرسية تبدأ بالعربية، مبنية عبر واجهة .NET 8 ولوحة تشغيل Next.js وموقع تعريفي ثنائي اللغة.',
    },
  },
  chapters: [
    {
      id: 'context',
      title: { en: 'One product, four repositories', ar: 'منتج واحد، أربعة مستودعات' },
      blocks: [
        {
          type: 'lead' as const,
          text: {
            en: 'The platform is split into four independent repositories that behave as one product — and the split only works because of a single rule about where business logic is allowed to live.',
            ar: 'تنقسم المنصة إلى أربعة مستودعات مستقلة تتصرّف كمنتج واحد — ولا ينجح هذا الفصل إلا بفضل قاعدة واحدة عن المكان المسموح لمنطق العمل أن يعيش فيه.',
          },
        },
        {
          type: 'callout' as const,
          title: { en: 'The rule', ar: 'القاعدة' },
          text: {
            en: 'All business rules live in the backend. The dashboard renders and validates for the user’s benefit; it never becomes a second, quietly diverging source of truth.',
            ar: 'كل قواعد العمل تعيش في الخادم. اللوحة تعرض وتتحقّق لمصلحة المستخدم؛ ولا تصبح أبداً مصدر حقيقة ثانياً ينحرف بصمت.',
          },
        },
        {
          type: 'layers' as const,
          caption: {
            en: 'Four repositories, one contract between them.',
            ar: 'أربعة مستودعات، وعقد واحد بينها.',
          },
          layers: [
            {
              name: { en: 'Landing', ar: 'الموقع التعريفي' },
              note: { en: 'Public, static, bilingual', ar: 'عام، ثابت، ثنائي اللغة' },
              items: ['Next.js static export'],
            },
            {
              name: { en: 'Dashboard', ar: 'اللوحة' },
              note: {
                en: 'Admin, teacher, accountant, parent, student views',
                ar: 'واجهات الإدارة والمعلّم والمحاسب وولي الأمر والطالب',
              },
              items: ['Next.js 15', 'TypeScript', 'Tailwind CSS'],
            },
            {
              name: { en: 'Backend', ar: 'الخادم' },
              note: { en: 'All business rules live here', ar: 'كل قواعد العمل هنا' },
              items: ['.NET 8', 'EF Core', 'PostgreSQL 16', 'Redis'],
            },
            {
              name: { en: 'Docs', ar: 'التوثيق' },
              note: {
                en: 'Traceability, RBAC matrix, run and release guides',
                ar: 'التتبّع ومصفوفة الصلاحيات وأدلة التشغيل والإصدار',
              },
              items: ['Specs', 'QA reports', 'Deployment guides'],
            },
          ],
        },
      ],
    },
    {
      id: 'roles',
      title: { en: 'Roles and daily operations', ar: 'الأدوار والعمليات اليومية' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'A school is a permission problem wearing a timetable. A teacher records attendance for their own classes; an accountant sees fees but not academic records; an administrator sees everything; a parent sees exactly one child. The modules are ordinary — the access model is where the work is.',
            ar: 'المدرسة مسألة صلاحيات ترتدي جدولاً دراسياً. المعلّم يسجّل حضور صفوفه؛ والمحاسب يرى الأقساط لا السجلات الأكاديمية؛ والإداري يرى كل شيء؛ وولي الأمر يرى طفلاً واحداً بالضبط. الوحدات عادية — والعمل الحقيقي في نموذج الوصول.',
          },
        },
        {
          type: 'bullets' as const,
          items: [
            {
              en: 'Students, classes, attendance and academic records form the operational core.',
              ar: 'الطلاب والصفوف والحضور والسجلات الأكاديمية تشكّل النواة التشغيلية.',
            },
            {
              en: 'Reports and notifications read from that core rather than maintaining their own copies.',
              ar: 'التقارير والإشعارات تقرأ من هذه النواة بدل الاحتفاظ بنسخ خاصة.',
            },
            {
              en: 'An RBAC permission matrix is maintained as documentation, so access can be reviewed without reading source code.',
              ar: 'تُصان مصفوفة صلاحيات موثّقة، فيمكن مراجعة الوصول دون قراءة الشيفرة.',
            },
          ],
        },
      ],
    },
    {
      id: 'delivery',
      title: { en: 'Delivery and verification', ar: 'التسليم والتحقّق' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'Handover is where school software usually fails: it works on the developer’s machine and nowhere else. The platform ships with a single run script, seed data, prepared sample accounts, an environment-variable matrix and a QA report, so someone who has never seen the project can bring it up and sign in.',
            ar: 'التسليم هو ما تفشل فيه برمجيات المدارس عادةً: تعمل على جهاز المطوّر فقط. تُسلَّم المنصة بسكربت تشغيل واحد وبيانات أولية وحسابات نموذجية ومصفوفة متغيّرات بيئة وتقرير جودة، ليتمكّن من لم يرَ المشروع من قبل من تشغيله وتسجيل الدخول.',
          },
        },
        {
          type: 'facts' as const,
          items: [
            {
              label: { en: 'Deployment', ar: 'النشر' },
              value: { en: 'Railway, configured environments', ar: 'Railway ببيئات مهيّأة' },
            },
            {
              label: { en: 'Verification', ar: 'التحقّق' },
              value: {
                en: 'Auth, permissions and major workflows with seed data',
                ar: 'المصادقة والصلاحيات والمسارات الرئيسية ببيانات أولية',
              },
            },
            {
              label: { en: 'Default language', ar: 'اللغة الافتراضية' },
              value: { en: 'Arabic', ar: 'العربية' },
            },
          ],
        },
      ],
    },
  ],
};

export const securebank = {
  slug: 'virtual-banking',
  title: 'Virtual Banking API',
  titleLocalized: { en: 'Virtual Banking API', ar: 'واجهة المصرف الافتراضي' },
  category: 'backend' as const,
  categoryLabel: {
    en: 'Digital wallet · Fintech platform',
    ar: 'محفظة رقمية · منصة تقنية مالية',
  },
  classification: 'independent' as const,
  role: { en: 'Full-stack engineer', ar: 'مهندس برمجيات متكامل' },
  year: '2025',
  status: { en: 'Independent build', ar: 'مشروع مستقل' },
  headline: {
    en: 'A money transfer that fails halfway is worse than one that never starts. This project is about the halfway case.',
    ar: 'التحويل المالي الذي يفشل في منتصفه أسوأ من الذي لا يبدأ أصلاً. هذا المشروع عن حالة المنتصف.',
  },
  summary: {
    en: 'A fintech-style digital wallet — a client interface for accounts, cards and transfers, over an ASP.NET Core system with OTP authentication, multi-step KYC verification, a full transaction lifecycle with fund reservation and idempotency, fraud triggers, batch payroll and audit logging — built on a Clean Architecture codebase.',
    ar: 'محفظة رقمية بأسلوب التقنية المالية — واجهة عميل للحسابات والبطاقات والتحويلات، فوق نظام على ASP.NET Core مع مصادقة OTP وتحقّق هوية متعدّد الخطوات ودورة حياة معاملة كاملة تشمل حجز الأموال ومفاتيح عدم التكرار ومحفّزات الاحتيال ورواتب دفعية وسجل تدقيق — على قاعدة معمارية نظيفة.',
  },
  problem: {
    en: 'Financial software is judged entirely on its failure paths. A retry that charges twice, a transfer that debits without crediting, a fraud rule that only runs on the happy path — each is a correctness bug that costs real money.',
    ar: 'تُقيَّم البرمجيات المالية بمسارات فشلها بالكامل. إعادة محاولة تخصم مرتين، أو تحويل يخصم دون أن يودع، أو قاعدة احتيال تعمل في المسار السعيد فقط — كل منها خلل صحّة يكلّف مالاً حقيقياً.',
  },
  outcome: {
    en: 'A transaction lifecycle that is explicit about every state it can be in, with idempotency keys and fund reservation making retries safe by construction.',
    ar: 'دورة حياة معاملة صريحة في كل حالة يمكن أن تكون فيها، مع مفاتيح عدم تكرار وحجز أموال تجعل إعادة المحاولة آمنة بالتصميم.',
  },
  responsibilities: [
    {
      en: 'Designed a digital wallet on ASP.NET Core with OTP authentication, multi-step KYC verification and admin approval workflows.',
      ar: 'صمّمتُ محفظة رقمية على ASP.NET Core بمصادقة OTP وتحقّق هوية متعدّد الخطوات ومسارات موافقة إدارية.',
    },
    {
      en: 'Built the wallet client on top of it: the account view, card balance, transfer and receive flows, and the transaction history.',
      ar: 'بنيتُ واجهة المحفظة فوقه: عرض الحساب، ورصيد البطاقة، ومسارات الإرسال والاستلام، وسجلّ المعاملات.',
    },
    {
      en: 'Modelled one account linked to multiple card types with rule-based spending constraints.',
      ar: 'نمذجتُ حساباً واحداً مرتبطاً بأنواع بطاقات متعدّدة مع قيود إنفاق قائمة على القواعد.',
    },
    {
      en: 'Implemented a transaction lifecycle from Pending through Processing to Completed or Failed, with fund reservation, idempotency keys, retry logic and failure recovery.',
      ar: 'نفّذتُ دورة حياة معاملة من «معلّقة» إلى «قيد المعالجة» إلى «مكتملة» أو «فاشلة»، مع حجز الأموال ومفاتيح عدم التكرار ومنطق إعادة المحاولة والتعافي من الفشل.',
    },
    {
      en: 'Built fraud-detection triggers, account freeze, batch payroll processing, scheduled transfers, CSV exports and audit logging.',
      ar: 'بنيتُ محفّزات كشف الاحتيال وتجميد الحسابات ومعالجة الرواتب الدفعية والتحويلات المجدولة وتصدير CSV وسجل التدقيق.',
    },
  ],
  stack: ['ASP.NET Core', 'C#', 'Clean Architecture', 'EF Core', 'SQL', 'JWT', 'REST API'],
  services: [
    { en: 'Backend architecture', ar: 'معمارية الخادم' },
    { en: 'API design', ar: 'تصميم الواجهات' },
    { en: 'Reliability engineering', ar: 'هندسة الموثوقية' },
  ],
  /*
   * The image's own blue, not a colour picked next to it.
   *
   * The hero export is dominated by a solid #2462e9 field, and the accent used
   * to be a teal — so the page opened with a teal classification pill sitting
   * on a blue slab, which is two accents on one screen and against this
   * project's own rule. Matching the accent to the wallet UI resolves it in the
   * direction that keeps the picture honest: the product really is that blue.
   * It reads better as text, too — the teal measured about 3.3:1 on --surface
   * where the outcome heading uses it, and this measures 5.35:1.
   */
  accent: '#2462e9',
  accentName: 'Wallet blue',
  featured: false,
  tier: 2 as const,
  /*
   * Not `generic-api` any more. This project ships a client as well as the API
   * behind it, so the face that represents it everywhere — the work grid, the
   * hero fan, the archive — is the wallet, not a bare request lifecycle.
   */
  cover: 'generic-wallet' as const,
  heroImage: {
    src: '/img/hero-virtual-banking.webp',
    width: 1920,
    height: 1440,
    alt: {
      en: 'A wallet account screen on a phone: card balance, add, send and receive actions, and a list of recent transactions.',
      ar: 'شاشة حساب محفظة على هاتف: رصيد البطاقة، وأزرار الإضافة والإرسال والاستلام، وقائمة بآخر المعاملات.',
    },
  },
  links: [],
  seo: {
    title: {
      en: 'Virtual Banking API — digital wallet, KYC and transaction lifecycle',
      ar: 'واجهة المصرف الافتراضي — محفظة رقمية وتحقّق هوية ودورة حياة معاملة',
    },
    description: {
      en: 'A fintech-style backend on ASP.NET Core: OTP authentication, multi-step KYC, fund reservation, idempotency keys, fraud triggers and audit logging.',
      ar: 'خادم بأسلوب التقنية المالية على ASP.NET Core: مصادقة OTP وتحقّق هوية متعدّد الخطوات وحجز أموال ومفاتيح عدم تكرار ومحفّزات احتيال وسجل تدقيق.',
    },
  },
  chapters: [
    {
      id: 'lifecycle',
      title: { en: 'The transaction lifecycle', ar: 'دورة حياة المعاملة' },
      blocks: [
        {
          type: 'lead' as const,
          text: {
            en: 'The wallet screens are the easy half. What decides whether this works is the state machine underneath them — so that is what the case study spends its time on.',
            ar: 'شاشات المحفظة هي النصف السهل. ما يقرّر نجاح هذا فعلاً هو آلة الحالات تحتها — وهذا ما تُمضي الدراسة وقتها فيه.',
          },
        },
        {
          type: 'flow' as const,
          caption: {
            en: 'Every transaction occupies exactly one of these states, and every transition is recorded.',
            ar: 'كل معاملة تشغل واحدة من هذه الحالات بالضبط، وكل انتقال مُسجَّل.',
          },
          steps: [
            {
              label: { en: 'Pending', ar: 'معلّقة' },
              text: {
                en: 'Created and validated. Funds are reserved against the source account so the same balance cannot be spent twice.',
                ar: 'أُنشئت وتُحقّق منها. تُحجز الأموال من الحساب المصدر فلا يُنفق الرصيد نفسه مرتين.',
              },
            },
            {
              label: { en: 'Processing', ar: 'قيد المعالجة' },
              text: {
                en: 'Executed under an idempotency key, so a retried request resolves to the same transaction rather than a second one.',
                ar: 'تُنفَّذ تحت مفتاح عدم تكرار، فتُرجع إعادة الطلب المعاملة نفسها لا معاملة ثانية.',
              },
            },
            {
              label: { en: 'Completed', ar: 'مكتملة' },
              text: {
                en: 'Reservation is settled, balances are final, and the audit log records who and what.',
                ar: 'تُسوّى الحجوزات وتُنهى الأرصدة، ويسجّل سجل التدقيق مَن وماذا.',
              },
            },
            {
              label: { en: 'Failed', ar: 'فاشلة' },
              text: {
                en: 'Reservation is released and the account returns to a known state. Failure is a designed outcome, not an exception nobody handled.',
                ar: 'يُفكّ الحجز ويعود الحساب إلى حالة معروفة. الفشل نتيجة مصمّمة لا استثناء لم يعالجه أحد.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'controls',
      title: { en: 'Identity and controls', ar: 'الهوية والضوابط' },
      blocks: [
        {
          type: 'list' as const,
          items: [
            {
              title: { en: 'OTP and multi-step KYC', ar: 'OTP وتحقّق هوية متعدّد الخطوات' },
              text: {
                en: 'Onboarding is staged, with admin approval gating the transition from a registered identity to an operational account.',
                ar: 'التسجيل مرحلي، مع موافقة إدارية تحكم الانتقال من هوية مسجّلة إلى حساب تشغيلي.',
              },
            },
            {
              title: { en: 'One account, many cards', ar: 'حساب واحد، بطاقات متعدّدة' },
              text: {
                en: 'Savings and regular card types carry different rule-based spending constraints against the same underlying balance.',
                ar: 'بطاقات التوفير والاعتيادية تحمل قيود إنفاق مختلفة مقابل الرصيد الأساسي نفسه.',
              },
            },
            {
              title: { en: 'Fraud triggers and freeze', ar: 'محفّزات الاحتيال والتجميد' },
              text: {
                en: 'Suspicious patterns can freeze an account, which stops activity without destroying the record needed to investigate it.',
                ar: 'يمكن للأنماط المشبوهة تجميد الحساب، فيتوقف النشاط دون إتلاف السجل اللازم للتحقيق.',
              },
            },
            {
              title: { en: 'Batch and scheduled operations', ar: 'العمليات الدفعية والمجدولة' },
              text: {
                en: 'Payroll batches and scheduled transfers reuse the same lifecycle, so a bulk run has the same correctness guarantees as a single transfer.',
                ar: 'تعيد دفعات الرواتب والتحويلات المجدولة استخدام دورة الحياة نفسها، فتحصل العملية الجماعية على ضمانات الصحّة نفسها كالتحويل المفرد.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'architecture',
      title: { en: 'Architecture', ar: 'المعمارية' },
      blocks: [
        {
          type: 'layers' as const,
          caption: {
            en: 'Clean Architecture — financial rules stay in the domain, isolated from transport and persistence.',
            ar: 'معمارية نظيفة — القواعد المالية تبقى في المجال، معزولة عن النقل والتخزين.',
          },
          layers: [
            {
              name: { en: 'Domain', ar: 'المجال' },
              note: { en: 'Accounts, cards, transactions', ar: 'الحسابات والبطاقات والمعاملات' },
              items: ['Entities', 'State machine', 'Spending rules'],
            },
            {
              name: { en: 'Application', ar: 'التطبيق' },
              note: { en: 'Use cases and validation', ar: 'حالات الاستخدام والتحقق' },
              items: ['Transfer', 'KYC', 'Payroll batch', 'Fraud evaluation'],
            },
            {
              name: { en: 'Infrastructure', ar: 'البنية التحتية' },
              note: { en: 'Persistence, audit, exports', ar: 'التخزين والتدقيق والتصدير' },
              items: ['EF Core', 'Audit log', 'CSV export'],
            },
          ],
        },
        {
          type: 'callout' as const,
          title: { en: 'The client on top of it', ar: 'الواجهة فوقه' },
          text: {
            en: 'The wallet interface is part of this project, not a separate one. It is the surface the lifecycle above is designed for: an account view, a card balance, send and receive, and a transaction history that has to stay truthful while a transfer is still resolving. A transfer that is Processing has to look like something a person can read — which is a client concern the state machine was shaped around, not an afterthought bolted to a finished API.',
            ar: 'واجهة المحفظة جزء من هذا المشروع لا مشروعاً منفصلاً. هي السطح الذي صُمّمت له دورة الحياة أعلاه: عرض الحساب، ورصيد البطاقة، والإرسال والاستلام، وسجلّ معاملات عليه أن يبقى صادقاً بينما التحويل ما زال قيد الحسم. فالتحويل «قيد المعالجة» عليه أن يبدو شيئاً يقرأه إنسان — وهذا شأن واجهة تشكّلت حوله آلة الحالات، لا إضافة لاحقة رُكّبت على واجهة برمجية مكتملة.',
          },
        },
      ],
    },
  ],
};

export const formBuilder = {
  slug: 'form-builder',
  title: 'Dynamic Form Builder',
  titleLocalized: { en: 'Dynamic Form Builder', ar: 'منشئ النماذج الديناميكي' },
  category: 'product' as const,
  categoryLabel: { en: 'No-code form tool', ar: 'أداة نماذج بدون برمجة' },
  classification: 'hackathon' as const,
  role: { en: 'Team member · Engineer', ar: 'عضو فريق · مهندس' },
  year: '2025',
  status: {
    en: '2nd place · HUB200 Hackathon 2025',
    ar: 'المركز الثاني · هاكاثون HUB200 2025',
  },
  headline: {
    en: 'A drag-and-drop tool for building and configuring custom web forms without writing code.',
    ar: 'أداة سحب وإفلات لبناء نماذج ويب مخصّصة وتهيئتها دون كتابة شيفرة.',
  },
  summary: {
    en: 'A no-code form builder letting a non-technical user assemble, configure and validate custom web forms through direct manipulation. Awarded second place at the HUB200 Hackathon during Global Entrepreneurship Week 2025.',
    ar: 'منشئ نماذج بدون برمجة يتيح لمستخدم غير تقني تجميع نماذج ويب مخصّصة وتهيئتها والتحقّق منها بالتعامل المباشر. حاز المركز الثاني في هاكاثون HUB200 ضمن أسبوع ريادة الأعمال العالمي 2025.',
  },
  problem: {
    en: 'Every organisation needs custom forms constantly, and every custom form is a small development request. The queue is the problem, not the difficulty.',
    ar: 'كل مؤسسة تحتاج نماذج مخصّصة باستمرار، وكل نموذج مخصّص طلب تطوير صغير. المشكلة في طابور الانتظار لا في الصعوبة.',
  },
  outcome: {
    en: 'A working drag-and-drop builder that removes the developer from the loop for ordinary forms. Second place at HUB200 2025.',
    ar: 'منشئ سحب وإفلات عامل يُخرج المطوّر من الدورة في النماذج الاعتيادية. المركز الثاني في HUB200 2025.',
  },
  responsibilities: [
    {
      en: 'Built a drag-and-drop tool for creating and configuring custom web forms without coding.',
      ar: 'بنيتُ أداة سحب وإفلات لإنشاء نماذج ويب مخصّصة وتهيئتها دون برمجة.',
    },
    {
      en: 'Delivered the project as part of a team under hackathon time constraints.',
      ar: 'نفّذتُ المشروع ضمن فريق تحت قيود وقت الهاكاثون.',
    },
  ],
  stack: ['React', 'TypeScript', 'Drag and drop', 'Dynamic validation'],
  services: [
    { en: 'Rapid product delivery', ar: 'تسليم منتج سريع' },
    { en: 'Frontend engineering', ar: 'هندسة الواجهات' },
  ],
  accent: '#8b5cf6',
  accentName: 'Builder violet',
  featured: false,
  tier: 2 as const,
  cover: 'generic-dashboard' as const,
  links: [],
  seo: {
    title: {
      en: 'Dynamic Form Builder — no-code form tool, 2nd place HUB200 2025',
      ar: 'منشئ النماذج الديناميكي — أداة بدون برمجة، المركز الثاني HUB200 2025',
    },
    description: {
      en: 'A drag-and-drop builder for creating and configuring custom web forms without code, awarded second place at the HUB200 Hackathon 2025.',
      ar: 'منشئ سحب وإفلات لإنشاء نماذج ويب مخصّصة دون شيفرة، حاز المركز الثاني في هاكاثون HUB200 2025.',
    },
  },
  chapters: [
    {
      id: 'problem',
      title: { en: 'The request queue', ar: 'طابور الطلبات' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'Nobody needs a developer to design a registration form. They need one only because the form has to become code. Removing that translation step is the entire product.',
            ar: 'لا أحد يحتاج مطوّراً لتصميم استمارة تسجيل. يحتاجه فقط لأن الاستمارة يجب أن تتحوّل إلى شيفرة. وإلغاء خطوة الترجمة هذه هو المنتج بأكمله.',
          },
        },
        {
          type: 'bullets' as const,
          items: [
            {
              en: 'Fields are assembled by direct manipulation rather than configured in a schema file.',
              ar: 'تُجمَّع الحقول بالتعامل المباشر بدل تهيئتها في ملف مخطّط.',
            },
            {
              en: 'Validation rules are set by the person who understands the data, not by the person who understands the framework.',
              ar: 'تُضبط قواعد التحقّق بيد من يفهم البيانات لا بيد من يفهم إطار العمل.',
            },
            {
              en: 'The result is a usable form, not an export that still needs integrating.',
              ar: 'النتيجة نموذج قابل للاستخدام لا ملف تصدير يحتاج دمجاً بعد.',
            },
          ],
        },
      ],
    },
    {
      id: 'approach',
      title: { en: 'Building it in a weekend', ar: 'بناؤه في عطلة نهاية أسبوع' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'The hackathon constraint forces one question: what is the smallest version of this that a judge can actually use? For a builder, the answer is that dragging has to feel correct immediately. A form tool whose drag interaction is imprecise reads as broken regardless of what it can do.',
            ar: 'قيد الهاكاثون يفرض سؤالاً واحداً: ما أصغر نسخة يستطيع المحكّم استخدامها فعلاً؟ وللمنشئ، الجواب أن السحب يجب أن يبدو صحيحاً فوراً. أداة نماذج سحبها غير دقيق تُقرأ كمعطوبة مهما كانت قدراتها.',
          },
        },
        {
          type: 'decisions' as const,
          items: [
            {
              challenge: {
                en: 'Breadth of field types versus quality of the building interaction.',
                ar: 'اتساع أنواع الحقول مقابل جودة تفاعل البناء.',
              },
              decision: {
                en: 'Fewer field types, each with a precise and predictable drag, configure and validate flow.',
                ar: 'أنواع حقول أقل، لكل منها مسار سحب وتهيئة وتحقّق دقيق ومتوقّع.',
              },
              tradeoff: {
                en: 'Less impressive on a feature list, far more convincing in a live demo.',
                ar: 'أقل إبهاراً في قائمة ميزات، وأكثر إقناعاً بكثير في عرض حيّ.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'result',
      title: { en: 'Recognition', ar: 'التقدير' },
      blocks: [
        {
          type: 'facts' as const,
          items: [
            {
              label: { en: 'Award', ar: 'الجائزة' },
              value: {
                en: '2nd place — HUB200 Hackathon 2025',
                ar: 'المركز الثاني — هاكاثون HUB200 2025',
              },
            },
            {
              label: { en: 'Context', ar: 'السياق' },
              value: {
                en: 'Global Entrepreneurship Week',
                ar: 'أسبوع ريادة الأعمال العالمي',
              },
            },
            {
              label: { en: 'Award type', ar: 'نوع الجائزة' },
              value: { en: 'Team award', ar: 'جائزة فريق' },
            },
          ],
        },
      ],
    },
  ],
};

export const invoiceApp = {
  slug: 'invoice-mini-app',
  title: 'Invoice Mini App',
  titleLocalized: { en: 'Invoice Mini App', ar: 'تطبيق الفواتير المصغّر' },
  category: 'product' as const,
  categoryLabel: {
    en: 'Fintech mini app · SuperQi ecosystem',
    ar: 'تطبيق مصغّر · منظومة SuperQi',
  },
  classification: 'training-program' as const,
  role: { en: 'Frontend engineer', ar: 'مهندس واجهات' },
  year: '2025',
  status: { en: 'Delivered · ITS programme', ar: 'مُسلَّم · برنامج ITS' },
  headline: {
    en: 'Building inside somebody else’s ecosystem means their APIs define your product’s edges.',
    ar: 'البناء داخل منظومة شخص آخر يعني أن واجهاته هي من يحدّد حدود منتجك.',
  },
  summary: {
    en: 'An invoice generation and payment mini app built in React inside the SuperQi fintech ecosystem, integrating platform APIs for authentication, document scanning, payment processing, PDF viewing and file downloads across a full invoice workflow.',
    ar: 'تطبيق مصغّر لإنشاء الفواتير ودفعها مبني بـReact داخل منظومة SuperQi المالية، يدمج واجهات المنصة للمصادقة ومسح المستندات ومعالجة الدفع وعرض PDF وتنزيل الملفات عبر مسار فاتورة كامل.',
  },
  problem: {
    en: 'A mini app cannot own its own authentication, payment rail or document handling — it must borrow all of them from the host platform, and behave correctly when the host says no.',
    ar: 'التطبيق المصغّر لا يملك مصادقته ولا قناة دفعه ولا معالجة مستنداته — بل يستعيرها كلها من المنصة المضيفة، وعليه أن يتصرّف بشكل صحيح حين ترفض المنصة.',
  },
  outcome: {
    en: 'An end-to-end invoice workflow — creation, sending, payment, transaction history — running entirely on host-platform capabilities.',
    ar: 'مسار فاتورة كامل — إنشاء وإرسال ودفع وسجل معاملات — يعمل بالكامل على قدرات المنصة المضيفة.',
  },
  responsibilities: [
    {
      en: 'Built an invoice generation and payment mini app inside the SuperQi fintech ecosystem using React.',
      ar: 'بنيتُ تطبيقاً مصغّراً لإنشاء الفواتير ودفعها داخل منظومة SuperQi باستخدام React.',
    },
    {
      en: 'Integrated platform APIs for authentication, document scanning, payment processing, PDF viewing and file downloads.',
      ar: 'دمجتُ واجهات المنصة للمصادقة ومسح المستندات ومعالجة الدفع وعرض PDF وتنزيل الملفات.',
    },
    {
      en: 'Delivered the full workflow across creation, sending, payment and transaction history with Axios-based API communication and structured state management.',
      ar: 'نفّذتُ المسار الكامل عبر الإنشاء والإرسال والدفع وسجل المعاملات باتصال Axios وإدارة حالة منظّمة.',
    },
  ],
  stack: ['React', 'JavaScript', 'Axios', 'REST API', 'PDF rendering'],
  services: [
    { en: 'Frontend engineering', ar: 'هندسة الواجهات' },
    { en: 'Third-party integration', ar: 'التكامل مع أطراف ثالثة' },
  ],
  accent: '#c2409a',
  accentName: 'Invoice rose',
  featured: false,
  tier: 2 as const,
  cover: 'generic-dashboard' as const,
  links: [],
  seo: {
    title: {
      en: 'Invoice Mini App — fintech workflow inside the SuperQi ecosystem',
      ar: 'تطبيق الفواتير المصغّر — مسار مالي داخل منظومة SuperQi',
    },
    description: {
      en: 'An invoice generation and payment mini app in React, integrating host-platform APIs for authentication, scanning, payment, PDF viewing and downloads.',
      ar: 'تطبيق مصغّر لإنشاء الفواتير ودفعها بـReact، يدمج واجهات المنصة المضيفة للمصادقة والمسح والدفع وعرض PDF والتنزيل.',
    },
  },
  chapters: [
    {
      id: 'context',
      title: { en: 'Building on borrowed foundations', ar: 'البناء على أساسات مُستعارة' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'A mini app is an unusual engineering position. You do not control identity, you do not control the payment rail, and you cannot fall back to your own implementation when something is unavailable. What you control is how honestly your interface reports the host’s state.',
            ar: 'التطبيق المصغّر موقع هندسي غير معتاد. لا تتحكّم بالهوية ولا بقناة الدفع، ولا يمكنك العودة إلى تنفيذك الخاص حين يتعطّل شيء. ما تتحكّم به هو مدى صدق واجهتك في نقل حالة المضيف.',
          },
        },
        {
          type: 'flow' as const,
          caption: {
            en: 'The invoice workflow, end to end.',
            ar: 'مسار الفاتورة من الطرف إلى الطرف.',
          },
          steps: [
            {
              label: { en: 'Create', ar: 'إنشاء' },
              text: {
                en: 'An invoice is composed, optionally from a scanned document via the platform’s scanning API.',
                ar: 'تُنشأ الفاتورة، اختيارياً من مستند ممسوح عبر واجهة المسح في المنصة.',
              },
            },
            {
              label: { en: 'Send', ar: 'إرسال' },
              text: {
                en: 'The invoice is issued to the recipient and becomes a payable record.',
                ar: 'تُصدر الفاتورة للمستلم وتصبح سجلاً قابلاً للدفع.',
              },
            },
            {
              label: { en: 'Pay', ar: 'دفع' },
              text: {
                en: 'Payment runs through the host platform’s processing rather than a payment integration of our own.',
                ar: 'يمرّ الدفع عبر معالجة المنصة المضيفة لا عبر تكامل دفع خاص بنا.',
              },
            },
            {
              label: { en: 'Archive', ar: 'أرشفة' },
              text: {
                en: 'The invoice lands in transaction history, viewable as a PDF and downloadable.',
                ar: 'تُحفظ الفاتورة في سجل المعاملات، قابلة للعرض كـPDF وللتنزيل.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'engineering',
      title: { en: 'Integration discipline', ar: 'انضباط التكامل' },
      blocks: [
        {
          type: 'bullets' as const,
          items: [
            {
              en: 'Authentication, scanning, payment, PDF viewing and downloads are all host capabilities — the app treats each as something that can be unavailable.',
              ar: 'المصادقة والمسح والدفع وعرض PDF والتنزيل كلها قدرات مضيفة — ويعامل التطبيق كلاً منها كشيء قد يتعطّل.',
            },
            {
              en: 'Axios-based communication with structured state management keeps request lifecycle and UI state separate.',
              ar: 'اتصال قائم على Axios مع إدارة حالة منظّمة يفصل دورة حياة الطلب عن حالة الواجهة.',
            },
            {
              en: 'The workflow is complete rather than partial — a half-built invoice flow is not usable at all.',
              ar: 'المسار كامل لا جزئي — فمسار فاتورة نصف مبني غير قابل للاستخدام إطلاقاً.',
            },
          ],
        },
      ],
    },
    {
      id: 'context-program',
      title: { en: 'Where it came from', ar: 'من أين جاء' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'I built this during my work and training at Qi Card, inside the Iraq TechSchool programme delivered in collaboration with Qi Card, Digital Zone, Computiq and HUB200 — which is why the fintech and digital-payment workflow concepts in it come from the industry partners rather than from a textbook.',
            ar: 'بنيتُ هذا خلال عملي وتدريبي في Qi Card، ضمن برنامج Iraq TechSchool المُقدَّم بالتعاون مع Qi Card وDigital Zone وComputiq وHUB200 — ولهذا جاءت مفاهيم مسارات الدفع الرقمي فيه من شركاء القطاع لا من كتاب دراسي.',
          },
        },
        {
          type: 'prose' as const,
          text: {
            en: 'It is a training project and I read it as one. The build itself is small. What I took from it is narrower than the feature list, and more useful than it.',
            ar: 'هو مشروع تدريبي، وأنا أقرأه على هذا الأساس. البناء نفسه صغير. وما خرجتُ به منه أضيق من قائمة الميزات، وأنفع منها.',
          },
        },
        {
          type: 'bullets' as const,
          items: [
            {
              en: 'Working inside a closed environment — SuperQi’s — where I did not control the platform, the APIs, or the constraints. The edges were set before I arrived, and the work was building something correct inside them rather than arguing with them.',
              ar: 'العمل داخل بيئة مغلقة — بيئة SuperQi — لا أتحكّم فيها بالمنصة ولا بالواجهات ولا بالقيود. الحدود كانت مرسومة قبل وصولي، والشغل أن أبني شيئاً صحيحاً داخلها لا أن أجادلها.',
            },
            {
              en: 'Working from documentation: reading it closely, and verifying behaviour against it rather than assuming what a call would do.',
              ar: 'العمل انطلاقاً من التوثيق: أقرأه بدقّة، وأتحقّق من السلوك الفعلي مقابله بدل أن أفترض ما سيفعله الاستدعاء.',
            },
          ],
        },
        {
          type: 'facts' as const,
          items: [
            {
              label: { en: 'Programme', ar: 'البرنامج' },
              value: {
                en: 'Iraq TechSchool — 6-month software engineering programme',
                ar: 'Iraq TechSchool — برنامج هندسة برمجيات لستة أشهر',
              },
            },
            {
              label: { en: 'Ecosystem', ar: 'المنظومة' },
              value: { en: 'SuperQi', ar: 'SuperQi' },
            },
          ],
        },
      ],
    },
  ],
};

export const medichub = {
  slug: 'medichub',
  title: 'MedicHub AI',
  titleLocalized: { en: 'MedicHub AI', ar: 'ميديك هَب' },
  category: 'ai' as const,
  categoryLabel: {
    en: 'Medical imaging analysis backend',
    ar: 'خادم تحليل صور طبية',
  },
  classification: 'independent' as const,
  role: { en: 'Backend engineer', ar: 'مهندس خادم' },
  year: '2025',
  status: { en: 'Experimental · Not a medical device', ar: 'تجريبي · ليس جهازاً طبياً' },
  headline: {
    en: 'Several separate imaging models behind one FastAPI service — an integration problem more than a modelling one.',
    ar: 'عدّة نماذج تصوير منفصلة خلف خدمة FastAPI واحدة — مسألة تكامل أكثر منها مسألة نمذجة.',
  },
  summary: {
    en: 'A FastAPI backend that unifies several deep-learning pipelines for medical image analysis behind one service interface, with local model weights and a consistent request contract across imaging types.',
    ar: 'خادم FastAPI يوحّد عدّة مسارات تعلّم عميق لتحليل الصور الطبية خلف واجهة خدمة واحدة، مع أوزان نماذج محلية وعقد طلب موحّد عبر أنواع التصوير.',
  },
  problem: {
    en: 'Each imaging model arrives with its own input assumptions, preprocessing and output shape. Consuming four of them from one application means writing four integrations, unless something normalises them first.',
    ar: 'كل نموذج تصوير يأتي بافتراضات مدخلاته ومعالجته المسبقة وشكل مخرجه. واستهلاك أربعة منها من تطبيق واحد يعني كتابة أربعة تكاملات، ما لم يوحّدها شيء أولاً.',
  },
  outcome: {
    en: 'One service contract over multiple model pipelines, so a client integrates once rather than per model.',
    ar: 'عقد خدمة واحد فوق مسارات نماذج متعدّدة، فيتكامل العميل مرة واحدة بدل مرة لكل نموذج.',
  },
  responsibilities: [
    {
      en: 'Built a FastAPI backend unifying multiple deep-learning pipelines behind one service interface.',
      ar: 'بنيتُ خادم FastAPI يوحّد مسارات تعلّم عميق متعدّدة خلف واجهة خدمة واحدة.',
    },
    {
      en: 'Handled local model weight loading and a consistent request/response contract across imaging types.',
      ar: 'عالجتُ تحميل أوزان النماذج محلياً وعقد طلب واستجابة موحّد عبر أنواع التصوير.',
    },
  ],
  stack: ['Python', 'FastAPI', 'PyTorch', 'Uvicorn', 'REST API'],
  services: [
    { en: 'AI integration', ar: 'دمج الذكاء الاصطناعي' },
    { en: 'Backend architecture', ar: 'معمارية الخادم' },
  ],
  accent: '#0f9d6b',
  accentName: 'Medic mint',
  featured: false,
  tier: 2 as const,
  cover: 'generic-api' as const,
  links: [],
  seo: {
    title: {
      en: 'MedicHub AI — unified FastAPI backend for medical image analysis pipelines',
      ar: 'ميديك هَب — خادم FastAPI موحّد لمسارات تحليل الصور الطبية',
    },
    description: {
      en: 'An experimental FastAPI backend unifying several deep-learning medical imaging pipelines behind a single service contract.',
      ar: 'خادم FastAPI تجريبي يوحّد عدّة مسارات تعلّم عميق للتصوير الطبي خلف عقد خدمة واحد.',
    },
  },
  chapters: [
    {
      id: 'scope',
      title: { en: 'Honest scope first', ar: 'النطاق الصريح أولاً' },
      blocks: [
        {
          type: 'callout' as const,
          title: { en: 'What this is not', ar: 'ما ليس هذا' },
          text: {
            en: 'This is an experimental engineering project. It is not a medical device, it has not been clinically validated, and no diagnostic accuracy is claimed for it anywhere on this site.',
            ar: 'هذا مشروع هندسي تجريبي. ليس جهازاً طبياً، ولم يخضع لتحقّق سريري، ولا يُدّعى له أي دقة تشخيصية في أي مكان على هذا الموقع.',
          },
        },
        {
          type: 'prose' as const,
          text: {
            en: 'The interesting engineering here has nothing to do with medicine. It is the question of how you put several independently-built inference pipelines behind one interface without the differences between them leaking to every client.',
            ar: 'الجانب الهندسي المثير هنا لا علاقة له بالطب. إنه سؤال كيف تضع عدّة مسارات استدلال بُنيت باستقلال خلف واجهة واحدة دون أن تتسرّب الفروق بينها إلى كل عميل.',
          },
        },
      ],
    },
    {
      id: 'architecture',
      title: { en: 'One contract, several pipelines', ar: 'عقد واحد، مسارات عدّة' },
      blocks: [
        {
          type: 'layers' as const,
          caption: {
            en: 'Model differences are absorbed by the service layer rather than exposed to callers.',
            ar: 'تمتصّ طبقة الخدمة فروق النماذج بدل كشفها للمستدعين.',
          },
          layers: [
            {
              name: { en: 'Service', ar: 'الخدمة' },
              note: { en: 'One request contract', ar: 'عقد طلب واحد' },
              items: ['FastAPI', 'Uvicorn'],
            },
            {
              name: { en: 'Adapters', ar: 'المحوّلات' },
              note: {
                en: 'Per-pipeline preprocessing and output normalisation',
                ar: 'معالجة مسبقة وتوحيد مخرجات لكل مسار',
              },
              items: ['Input normalisation', 'Output shaping'],
            },
            {
              name: { en: 'Inference', ar: 'الاستدلال' },
              note: { en: 'Independently trained pipelines', ar: 'مسارات مدرَّبة باستقلال' },
              items: ['PyTorch', 'Local weights', 'Segmentation + classification'],
            },
          ],
        },
      ],
    },
    {
      id: 'lessons',
      title: { en: 'What it taught', ar: 'ما علّمه' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'Model weights are the operational problem nobody warns you about. Some load from local files, some download on first use, and the service has to start predictably regardless — including when a weight file is simply missing.',
            ar: 'أوزان النماذج هي المشكلة التشغيلية التي لا يحذّرك منها أحد. بعضها يُحمَّل من ملفات محلية وبعضها يُنزَّل عند أول استخدام، وعلى الخدمة أن تبدأ بشكل متوقّع في كل الأحوال — بما في ذلك حين يكون ملف الأوزان مفقوداً ببساطة.',
          },
        },
      ],
    },
  ],
};
