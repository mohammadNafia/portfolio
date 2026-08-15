/**
 * IMMAR — bilingual education ecosystem case study.
 *
 * Sources: `cv/cv_data.py` (IMMAR_FS / IMMAR_PM), `IMMAR-backend/README.md`
 * (ASP.NET Core 8 modular monolith, PostgreSQL, layered dependency flow,
 * permissions/roles seeding), `immar/mobile` (Flutter student application).
 *
 * The product boundary is non-negotiable and stated explicitly: students use the
 * mobile application; the web dashboard is for administrators, teachers and
 * authorised teacher staff only.
 */
export const immar = {
  slug: 'immar',
  title: 'IMMAR',
  titleLocalized: { en: 'IMMAR', ar: 'إعمار' },
  category: 'product' as const,
  categoryLabel: {
    en: 'Bilingual education ecosystem',
    ar: 'منظومة تعليمية ثنائية اللغة',
  },
  classification: 'client-product' as const,
  role: {
    en: 'Product planning · Full-stack engineer',
    ar: 'تخطيط المنتج · مهندس برمجيات متكامل',
  },
  year: '2025—2026',
  status: { en: 'Delivered · Private platform', ar: 'مُسلَّم · منصة خاصة' },
  headline: {
    en: 'A student mobile app and an operational web dashboard that must never be the same product — and one permission model holding the line between them.',
    ar: 'تطبيق طالب على الهاتف ولوحة تشغيل على الويب يجب ألا يكونا المنتج نفسه — ونموذج صلاحيات واحد يحرس الحدّ بينهما.',
  },
  summary: {
    en: 'IMMAR is a bilingual Arabic/English e-learning ecosystem: a Flutter application for students, and a separate web dashboard for administrators, teachers and authorised teacher staff. I planned the product, defined roles, permissions and session rules, and built the dashboard against a .NET modular-monolith API.',
    ar: 'إعمار منظومة تعليم إلكتروني ثنائية اللغة: تطبيق Flutter للطلاب، ولوحة ويب منفصلة للإداريين والمعلّمين وطاقم المعلّمين المخوّل. خطّطتُ المنتج، وحدّدتُ الأدوار والصلاحيات وقواعد الجلسات، وبنيتُ اللوحة فوق واجهة .NET أحادية معيارية.',
  },
  problem: {
    en: 'A multi-teacher education platform has two incompatible pressures. Students need a fast, focused, mobile learning surface. Teachers and administrators need dense operational tooling — attendance, assessments, finance, activation codes, reporting. Building one interface for both produces a product that serves neither.',
    ar: 'منصة تعليمية متعدّدة المعلّمين تواجه ضغطين متعارضين. الطالب يحتاج واجهة تعلّم سريعة ومركّزة على الهاتف. والمعلّم والإداري يحتاجان أدوات تشغيل كثيفة — حضور وتقييمات ومالية وأكواد تفعيل وتقارير. بناء واجهة واحدة للطرفين ينتج منتجاً لا يخدم أياً منهما.',
  },
  outcome: {
    en: 'Two deliberately separate clients over one permission model — with the rule that a student account can never authenticate into the web dashboard enforced in the system, not in documentation.',
    ar: 'عميلان منفصلان عن قصد فوق نموذج صلاحيات واحد — مع فرض قاعدة أن حساب الطالب لا يمكنه الدخول إلى لوحة الويب داخل النظام نفسه، لا في التوثيق.',
  },
  responsibilities: [
    {
      en: 'Planned a bilingual education ecosystem pairing a student mobile application with a web dashboard for administrators, teachers and authorised teacher staff.',
      ar: 'خطّطتُ منظومة تعليمية ثنائية اللغة تجمع تطبيق طالب على الهاتف مع لوحة ويب للإداريين والمعلّمين وطاقم المعلّمين المخوّل.',
    },
    {
      en: 'Defined user roles, permissions, authentication rules, and device and session management — including the rule that student accounts must not access the web dashboard.',
      ar: 'حدّدتُ الأدوار والصلاحيات وقواعد المصادقة وإدارة الأجهزة والجلسات — بما في ذلك قاعدة منع حسابات الطلاب من الوصول إلى لوحة الويب.',
    },
    {
      en: 'Delivered modules for courses, educational content, quizzes, assignments, attendance, activation codes, notifications, reports, financial operations, content protection and video-based learning.',
      ar: 'نفّذتُ وحدات المقرّرات والمحتوى التعليمي والاختبارات والواجبات والحضور وأكواد التفعيل والإشعارات والتقارير والعمليات المالية وحماية المحتوى والتعلّم بالفيديو.',
    },
    {
      en: 'Integrated the dashboard with REST APIs under secure authentication, role-based route protection and full RTL/LTR parity.',
      ar: 'ربطتُ اللوحة بواجهات REST تحت مصادقة آمنة وحماية مسارات قائمة على الأدوار وتكافؤ كامل بين RTL وLTR.',
    },
    {
      en: 'Converted client needs into functional requirements, user flows, API contracts, implementation priorities and delivery milestones.',
      ar: 'حوّلتُ احتياجات العميل إلى متطلبات وظيفية ومسارات مستخدم وعقود واجهات وأولويات تنفيذ ومراحل تسليم.',
    },
  ],
  stack: [
    'ASP.NET Core 8',
    'C#',
    'Entity Framework Core',
    'PostgreSQL',
    'Clean Architecture',
    'JWT',
    'RBAC',
    'Flutter',
    'React',
    'TypeScript',
    'REST API',
    'Docker',
  ],
  services: [
    { en: 'Product discovery', ar: 'اكتشاف المنتج' },
    { en: 'Backend architecture', ar: 'معمارية الخادم' },
    { en: 'Dashboards & operations', ar: 'اللوحات والتشغيل' },
    { en: 'Bilingual implementation', ar: 'تنفيذ ثنائي اللغة' },
  ],
  accent: '#6d4aff',
  accentName: 'IMMAR cobalt',
  featured: true,
  tier: 1 as const,
  cover: 'immar-dashboard' as const,
  proof: {
    en: 'Delivered ecosystem · Mobile + web',
    ar: 'منظومة مُسلَّمة · هاتف + ويب',
  },
  links: [],
  seo: {
    title: {
      en: 'IMMAR — Bilingual education ecosystem: student mobile app and operational dashboard',
      ar: 'إعمار — منظومة تعليمية ثنائية اللغة: تطبيق طالب ولوحة تشغيل',
    },
    description: {
      en: 'Planning and engineering IMMAR: a bilingual Arabic/English e-learning ecosystem separating a student mobile application from an operational web dashboard through one permission model.',
      ar: 'تخطيط وهندسة إعمار: منظومة تعليم إلكتروني ثنائية اللغة تفصل تطبيق الطالب عن لوحة التشغيل عبر نموذج صلاحيات واحد.',
    },
  },
  chapters: [
    {
      id: 'context',
      title: { en: 'Two products, one system', ar: 'منتجان، نظام واحد' },
      blocks: [
        {
          type: 'lead' as const,
          text: {
            en: 'The defining decision in IMMAR was made before any interface was designed: students would get their own application, and the web dashboard would never be for them.',
            ar: 'القرار الحاسم في إعمار اتُّخذ قبل تصميم أي واجهة: للطلاب تطبيقهم الخاص، ولوحة الويب لن تكون لهم أبداً.',
          },
        },
        {
          type: 'prose' as const,
          text: {
            en: 'It is tempting to build one responsive web application and give every role a filtered view of it. That approach fails quickly here. A student on a mid-range Android phone opening a lesson has almost nothing in common with an administrator reconciling activation codes and settlements across multiple teachers. Their sessions differ, their security requirements differ, and their failure modes differ.',
            ar: 'من المغري بناء تطبيق ويب متجاوب واحد ومنح كل دور نسخة مُصفّاة منه. لكن هذا النهج يفشل سريعاً هنا. الطالب الذي يفتح درساً على هاتف أندرويد متوسط لا يشترك تقريباً في شيء مع الإداري الذي يطابق أكواد التفعيل والتسويات عبر معلّمين متعدّدين. جلساتهم مختلفة، ومتطلبات أمانهم مختلفة، وأنماط فشلهم مختلفة.',
          },
        },
        {
          type: 'callout' as const,
          title: { en: 'The boundary', ar: 'الحدّ الفاصل' },
          text: {
            en: 'Students use the mobile application. The web dashboard serves administrators, teachers and authorised teacher staff. A student account cannot authenticate into the dashboard — this is enforced by the role model, not by hiding a link.',
            ar: 'الطلاب يستخدمون تطبيق الهاتف. ولوحة الويب تخدم الإداريين والمعلّمين وطاقم المعلّمين المخوّل. لا يستطيع حساب الطالب الدخول إلى اللوحة — وهذا مفروض بنموذج الأدوار لا بإخفاء رابط.',
          },
        },
      ],
    },
    {
      id: 'roles',
      title: { en: 'Roles and permissions', ar: 'الأدوار والصلاحيات' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'IMMAR is multi-teacher. A teacher owns their content and their students; teacher staff act on a teacher’s behalf within limits; administrators operate the platform across everyone. Getting that hierarchy wrong exposes one teacher’s material — or one teacher’s revenue — to another.',
            ar: 'إعمار منصة متعدّدة المعلّمين. المعلّم يملك محتواه وطلابه؛ وطاقم المعلّم يعمل نيابةً عنه ضمن حدود؛ والإداريون يشغّلون المنصة عبر الجميع. الخطأ في هذه الهرمية يكشف محتوى معلّم — أو إيراداته — لمعلّم آخر.',
          },
        },
        {
          type: 'matrix' as const,
          caption: {
            en: 'Access model. The student column is intentionally empty on the web dashboard — students act only through the mobile application.',
            ar: 'نموذج الوصول. عمود الطالب فارغ عن قصد في لوحة الويب — فالطالب يتعامل عبر تطبيق الهاتف فقط.',
          },
          columns: [
            { en: 'Admin', ar: 'إداري' },
            { en: 'Teacher', ar: 'معلّم' },
            { en: 'Teacher staff', ar: 'طاقم المعلّم' },
            { en: 'Student (mobile)', ar: 'طالب (هاتف)' },
          ],
          rows: [
            {
              label: { en: 'Web dashboard access', ar: 'الوصول إلى لوحة الويب' },
              values: ['yes', 'yes', 'yes', 'no'] as const,
            },
            {
              label: { en: 'Publish course content', ar: 'نشر محتوى المقرّر' },
              values: ['yes', 'yes', 'partial', 'no'] as const,
            },
            {
              label: { en: 'Assessments & grading', ar: 'التقييمات والدرجات' },
              values: ['yes', 'yes', 'partial', 'no'] as const,
            },
            {
              label: { en: 'Attendance records', ar: 'سجلات الحضور' },
              values: ['yes', 'yes', 'yes', 'no'] as const,
            },
            {
              label: { en: 'Activation codes', ar: 'أكواد التفعيل' },
              values: ['yes', 'partial', 'no', 'no'] as const,
            },
            {
              label: { en: 'Financial operations', ar: 'العمليات المالية' },
              values: ['yes', 'partial', 'no', 'no'] as const,
            },
            {
              label: { en: 'Consume lessons & assignments', ar: 'متابعة الدروس والواجبات' },
              values: ['no', 'no', 'no', 'yes'] as const,
            },
          ],
        },
        {
          type: 'showcase' as const,
          id: 'immar-roles' as const,
          caption: {
            en: 'Interface concept — role and permission management. Composed from IMMAR’s real permission catalogue; not a captured screenshot.',
            ar: 'تصوّر للواجهة — إدارة الأدوار والصلاحيات. مبني على كتالوج الصلاحيات الفعلي لإعمار، وليس لقطة شاشة.',
          },
        },
      ],
    },
    {
      id: 'ux',
      title: { en: 'Two surfaces, two design problems', ar: 'واجهتان، مسألتان تصميميتان' },
      blocks: [
        {
          type: 'list' as const,
          items: [
            {
              title: { en: 'The student application', ar: 'تطبيق الطالب' },
              text: {
                en: 'Built in Flutter and designed around a single question: what am I studying next? Content, assignments and assessments are reachable in as few taps as possible, and the app has to stay usable on an inconsistent mobile connection.',
                ar: 'بُني بـFlutter وصُمّم حول سؤال واحد: ما الذي أدرسه تالياً؟ المحتوى والواجبات والتقييمات على بُعد أقل عدد ممكن من اللمسات، ويجب أن يبقى التطبيق صالحاً على اتصال متقطّع.',
              },
            },
            {
              title: { en: 'The operational dashboard', ar: 'لوحة التشغيل' },
              text: {
                en: 'Designed for density and repetition. Teachers and staff work through long lists of students, submissions, attendance and codes, so the dashboard is optimised for scanning and bulk action rather than for a guided journey.',
                ar: 'صُمّمت للكثافة والتكرار. يعمل المعلّمون والطاقم عبر قوائم طويلة من الطلاب والتسليمات والحضور والأكواد، لذلك حُسّنت اللوحة للمسح السريع والإجراءات الجماعية بدل الرحلة الموجّهة.',
              },
            },
          ],
        },
        {
          type: 'showcase' as const,
          id: 'immar-mobile' as const,
          caption: {
            en: 'Interface concept — the student application. The learning surface is deliberately narrow; operational tooling lives elsewhere.',
            ar: 'تصوّر للواجهة — تطبيق الطالب. واجهة التعلّم ضيّقة عن قصد؛ وأدوات التشغيل في مكان آخر.',
          },
        },
        {
          type: 'prose' as const,
          text: {
            en: 'Arabic and English are treated as equal materials rather than a base language and a translation. Both directions were designed, not derived: the dashboard’s navigation, tables, date handling and form flow each have an authored RTL behaviour, and technical identifiers stay left-to-right inside Arabic screens.',
            ar: 'تُعامل العربية والإنجليزية كمادتين متكافئتين لا كلغة أصل وترجمة. صُمّم الاتجاهان ولم يُشتق أحدهما من الآخر: للتنقّل والجداول ومعالجة التواريخ وتدفّق النماذج سلوك RTL مكتوب عمداً، بينما تبقى المعرّفات التقنية من اليسار إلى اليمين داخل الشاشات العربية.',
          },
        },
      ],
    },
    {
      id: 'architecture',
      title: { en: 'Backend architecture', ar: 'معمارية الخادم' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'The API is an ASP.NET Core 8 modular monolith with a strictly one-way dependency flow. Domain knows nothing about persistence or HTTP; Application holds services, DTOs, validators and provider ports; Infrastructure implements them; the API layer only composes. That constraint is what keeps a platform with this many modules from turning into a single tangled service.',
            ar: 'الواجهة الخلفية أحادية معيارية على ASP.NET Core 8 بتدفّق تبعيات أحادي الاتجاه بصرامة. طبقة المجال لا تعرف شيئاً عن التخزين أو HTTP؛ وطبقة التطبيق تحوي الخدمات وكائنات النقل والمدقّقات ومنافذ المزوّدين؛ والبنية التحتية تنفّذها؛ وطبقة الواجهة تركّب فقط. هذا القيد هو ما يمنع منصة بهذا العدد من الوحدات من التحوّل إلى خدمة متشابكة.',
          },
        },
        {
          type: 'layers' as const,
          caption: {
            en: 'Dependency flow: Domain ← Application ← Infrastructure ← Api. Arrows never point back.',
            ar: 'تدفّق التبعيات: المجال ← التطبيق ← البنية التحتية ← الواجهة. ولا تعود الأسهم للخلف أبداً.',
          },
          layers: [
            {
              name: { en: 'Domain', ar: 'المجال' },
              note: { en: 'No EF, no DI, no HTTP', ar: 'بلا EF ولا حقن تبعيات ولا HTTP' },
              items: ['Entities', 'Enums', 'Interfaces'],
            },
            {
              name: { en: 'Application', ar: 'التطبيق' },
              note: { en: 'Business services and contracts', ar: 'خدمات وعقود الأعمال' },
              items: ['Services', 'DTOs', 'Validators', 'Provider ports'],
            },
            {
              name: { en: 'Infrastructure', ar: 'البنية التحتية' },
              note: { en: 'Persistence and adapters', ar: 'التخزين والمحوّلات' },
              items: ['DbContext', 'Migrations', 'Seeders', 'JWT / OTP / hashing'],
            },
            {
              name: { en: 'API', ar: 'الواجهة' },
              note: { en: 'Composition only', ar: 'تركيب فقط' },
              items: ['Controllers', 'Middleware', 'Swagger', 'Health checks'],
            },
          ],
        },
        {
          type: 'flow' as const,
          caption: {
            en: 'Protected content delivery — the path a paid lesson takes before it reaches a student device.',
            ar: 'تسليم المحتوى المحمي — المسار الذي يسلكه درس مدفوع قبل وصوله إلى جهاز الطالب.',
          },
          steps: [
            {
              label: { en: 'Activation', ar: 'التفعيل' },
              text: {
                en: 'A student redeems an activation code that grants access to specific content rather than to the platform generally.',
                ar: 'يستخدم الطالب كود تفعيل يمنح وصولاً إلى محتوى محدّد لا إلى المنصة عموماً.',
              },
            },
            {
              label: { en: 'Device binding', ar: 'ربط الجهاز' },
              text: {
                en: 'The session is tied to a device, so a single account cannot be shared across an unlimited number of phones.',
                ar: 'تُربط الجلسة بجهاز، فلا يمكن مشاركة حساب واحد عبر عدد غير محدود من الهواتف.',
              },
            },
            {
              label: { en: 'Authorisation', ar: 'التخويل' },
              text: {
                en: 'Every content request is checked against the student’s entitlements — not just against being logged in.',
                ar: 'يُفحص كل طلب محتوى مقابل استحقاقات الطالب — لا مقابل كونه مسجّل الدخول فقط.',
              },
            },
            {
              label: { en: 'Delivery', ar: 'التسليم' },
              text: {
                en: 'Video and materials are served through the protected pipeline, with the entitlement re-evaluated rather than cached indefinitely.',
                ar: 'يُقدَّم الفيديو والمواد عبر مسار محمي، مع إعادة تقييم الاستحقاق بدل تخزينه بلا نهاية.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'engineering',
      title: { en: 'Engineering decisions', ar: 'القرارات الهندسية' },
      blocks: [
        {
          type: 'decisions' as const,
          items: [
            {
              challenge: {
                en: 'One account shared across a class defeats the entire commercial model of a paid education platform.',
                ar: 'مشاركة حساب واحد بين صفّ كامل تُسقط النموذج التجاري لمنصة تعليم مدفوعة.',
              },
              decision: {
                en: 'Device and session management binds an active session to a device, with administrative controls to reset it when a student legitimately changes phone.',
                ar: 'إدارة الأجهزة والجلسات تربط الجلسة النشطة بجهاز، مع أدوات إدارية لإعادة الضبط عند تغيير الطالب هاتفه بشكل مشروع.',
              },
              tradeoff: {
                en: 'Adds a support workflow — but the alternative is a platform teachers will not publish to.',
                ar: 'يضيف مساراً للدعم — لكن البديل منصة لن ينشر عليها المعلّمون.',
              },
            },
            {
              challenge: {
                en: 'Permissions written as code checks scattered across controllers become impossible to audit.',
                ar: 'الصلاحيات المكتوبة كفحوص متناثرة في المتحكّمات تصبح غير قابلة للتدقيق.',
              },
              decision: {
                en: 'Permissions, system roles and settings are seeded as catalogued data, so the access model can be read as a table instead of inferred from source.',
                ar: 'الصلاحيات وأدوار النظام والإعدادات تُزرع كبيانات مفهرسة، فيمكن قراءة نموذج الوصول كجدول بدل استنتاجه من الشيفرة.',
              },
              tradeoff: {
                en: 'Requires disciplined seeding and migration hygiene on every release.',
                ar: 'يتطلّب انضباطاً في الزرع والترحيل مع كل إصدار.',
              },
            },
            {
              challenge: {
                en: 'A demo environment with real-looking accounts is a production security risk waiting to happen.',
                ar: 'بيئة عرض بحسابات تبدو حقيقية هي خطر أمني إنتاجي مؤجّل.',
              },
              decision: {
                en: 'Development seed accounts are gated so they can never be created in a production environment.',
                ar: 'حسابات بيئة التطوير مقيّدة بحيث لا يمكن إنشاؤها في بيئة الإنتاج إطلاقاً.',
              },
              tradeoff: {
                en: 'Slightly more configuration per environment, and no chance of a well-known password reaching production.',
                ar: 'إعدادات أكثر قليلاً لكل بيئة، ولا فرصة لوصول كلمة مرور معروفة إلى الإنتاج.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'outcome',
      title: { en: 'Result', ar: 'النتيجة' },
      blocks: [
        {
          type: 'facts' as const,
          items: [
            {
              label: { en: 'Status', ar: 'الحالة' },
              value: { en: 'Delivered · Private platform', ar: 'مُسلَّم · منصة خاصة' },
            },
            {
              label: { en: 'Clients', ar: 'الواجهات' },
              value: {
                en: 'Flutter student app + web dashboard',
                ar: 'تطبيق طالب بـFlutter + لوحة ويب',
              },
            },
            {
              label: { en: 'My role', ar: 'دوري' },
              value: {
                en: 'Product planning and full-stack delivery',
                ar: 'تخطيط المنتج والتنفيذ المتكامل',
              },
            },
            {
              label: { en: 'Languages', ar: 'اللغات' },
              value: { en: 'Arabic and English, full parity', ar: 'العربية والإنجليزية بتكافؤ كامل' },
            },
          ],
        },
        {
          type: 'prose' as const,
          text: {
            en: 'IMMAR is the project that convinced me most of my job is drawing boundaries. The hard parts were not the modules — courses, quizzes, attendance, finance are all solvable. The hard part was deciding what each role is allowed to see and holding that line while the feature list grew.',
            ar: 'إعمار هو المشروع الذي أقنعني أن معظم عملي هو رسم الحدود. لم تكن الوحدات هي الجزء الصعب — المقرّرات والاختبارات والحضور والمالية كلها قابلة للحل. الصعب كان تحديد ما يُسمح لكل دور برؤيته، والتمسّك بذلك الحدّ بينما تتوسّع قائمة الميزات.',
          },
        },
      ],
    },
  ],
};
