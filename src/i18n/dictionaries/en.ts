export const en = {
  meta: {
    siteName: 'Mohammed Nafia',
    role: 'Full-Stack Software Engineer & Product Founder',
    defaultTitle: 'Mohammed Nafia — Full-Stack Software Engineer & Product Founder',
    defaultDescription:
      'I build digital products that survive the real world. Multi-tenant commerce systems, AI platforms and education ecosystems — engineered in Baghdad, built for the world.',
  },

  common: {
    skipToContent: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    switchToArabic: 'التبديل إلى العربية',
    switchToEnglish: 'Switch to English',
    viewCaseStudy: 'View case study',
    viewProject: 'View project',
    allWork: 'All work',
    startProject: 'Start a project',
    workWithMe: 'Work with Me',
    readCaseStudy: 'Read Case Study',
    comingSoon: 'Coming soon...',
    sendMessage: 'Send me a message',
    exploreWork: 'Explore selected work',
    availableForWork: 'Available for select projects',
    localTime: 'Baghdad local time',
    backToWork: 'Back to all work',
    nextProject: 'Next project',
    role: 'Role',
    year: 'Year',
    status: 'Status',
    stack: 'Stack',
    category: 'Category',
    scrollToExplore: 'Scroll to explore',
    readingProgress: 'Reading progress',
    chapters: 'Chapters',
    onThisPage: 'On this page',
    externalLink: 'Opens in a new tab',
    email: 'Email',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    interfaceConcept: 'Interface concept',
    nextCard: 'Next card',
  },

  /*
   * Alt text for the photographic assets. These are content, not decoration —
   * the portrait and the cutout carry information a sighted visitor gets for
   * free. Only the grain, squiggles and sawtooth are `aria-hidden`.
   *
   * Per-image descriptions for the hero fan live with the artwork in
   * `src/content/fan-art.ts`, because they describe a specific screenshot
   * rather than a piece of interface copy.
   */
  alt: {
    avatar: 'Illustrated portrait of Mohammed Nafia',
    cutout: 'Mohammed Nafia, standing, hands clasped',
  },

  nav: {
    work: 'Work',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    home: 'Home',
    caseStudies: 'Case Studies',
    background: 'Background',
  },

  classification: {
    'founder-product': 'Founder product',
    'client-product': 'Client product',
    hackathon: 'Hackathon project',
    'training-program': 'Programme project',
    independent: 'Independent build',
    academic: 'Academic project',
  },

  category: {
    saas: 'SaaS',
    product: 'Product',
    backend: 'Backend',
    ai: 'AI',
    mobile: 'Mobile',
    dashboard: 'Dashboard',
    experiment: 'Experiment',
  },

  /*
   * The home page is a single authored document, supplied as final copy in both
   * locales. Nothing here is a translation of the other side: the two were
   * written separately, which is why several prose arrays differ in length
   * between `en` and `ar` — the same argument, split into a different number of
   * paragraphs. `tests/unit/content.test.ts` lists those paths explicitly.
   *
   * Section titles are stored in their authored casing. The display face
   * uppercases Latin headings in CSS and leaves Arabic alone, so storing
   * SHOUTING here would only make the source harder to proof-read against the
   * copy document.
   */
  home: {
    hero: {
      /* Two tiers: the name on the display face, the role tracked beneath it. */
      name: 'Mohammed Nafia',
      role: 'Software & AI Engineer',
      intro:
        'I build web systems and digital products from idea to deployment, with attention to the details that make a system clear, reliable, and ready to grow.',
      orbitLabel: 'Featured products',
    },
    work: {
      title: 'Selected Work',
      intro:
        'Projects across commerce, education, fintech, and AI. I selected the ones where the problem was clear and the engineering decisions were worth explaining.',
      /* Order is load-bearing: `WORK_SLUGS` in `home/sections.tsx` zips to it. */
      items: [
        {
          title: 'Sendy',
          subtitle: 'Multi-Tenant Commerce & Logistics Platform',
          text: 'A platform that brings merchant operations, orders, and delivery into one system, with clear separation between users, roles, and organizations.',
          cta: 'View Sendy Case Study',
        },
        {
          title: 'IMMAR',
          subtitle: 'Bilingual Education Platform',
          text: 'A student application and a separate web dashboard for administrators and teachers. Both work with the same platform and data, but each has its own permissions and user flow.',
          cta: 'View IMMAR Case Study',
        },
        {
          /*
           * Every line here already existed for this project: the subtitle is
           * its `categoryLabel` and the text is its `headline` — the field the
           * schema designates for cards. Nothing was written for this slot.
           */
          title: 'Virtual Banking API',
          subtitle: 'Fintech backend · Digital wallet',
          text: 'A money transfer that fails halfway is worse than one that never starts. This project is about the halfway case.',
          cta: 'View Virtual Banking API Case Study',
        },
        {
          title: 'Al-Tafawuq School System',
          subtitle: 'School Management & Operations Platform',
          text: 'A system that brings attendance, absences, tuition, and student follow-up into one dashboard, giving school administration a single place for the information they use every day.',
          cta: 'View Al-Tafawuq',
        },
      ],
    },
    background: {
      title: 'Background',
      lead: "I'm Mohammed Nafia.",
      paragraphs: [
        "I'm a Software & AI Engineer. I started my professional experience working with Qi Card, then went on to work across different products and software projects. Today, I work independently with companies and teams to build software systems and digital products.",
        'The projects I enjoy most usually involve more than a screen connected to an API.',
        'There are different users and permissions, data moving between multiple parts of the system, and flows that still need to behave correctly when a request fails, a state changes, or someone tries to access something they should not.',
        'That is why I usually start with how the system works before deciding how the interface should look.',
        'I define who uses it, what they need to see, what they are allowed to change, and how the system should behave when things do not go as expected.',
        'Then I build.',
      ],
      /*
       * Not from the copy document — the résumé download was specified as a
       * requirement rather than as a sentence, and a button needs a label.
       */
      cv: 'Download CV (PDF)',
    },
    process: {
      title: 'How I Work',
      steps: [
        {
          number: '01',
          title: 'Understand the System Before Writing Code',
          text: [
            'I define users, permissions, data flow, core states, and failure cases early, before those decisions turn into scattered fixes during development.',
          ],
        },
        {
          number: '02',
          title: 'Build the Product as One System',
          text: [
            'The database, API, and interface are parts of the same product. A decision in one layer should have a clear and understood effect on the others.',
          ],
        },
        {
          number: '03',
          title: 'Arabic Is Not a Secondary Version',
          text: [
            'If a product supports Arabic and English, I design for both from the beginning: RTL and LTR layouts, text, tables, forms, and navigation.',
          ],
        },
        {
          number: '04',
          title: 'Deploy, Test, Then Deliver',
          text: [
            'Finishing the code is not the end of the project.',
            'I review the main flows, error cases, permissions, APIs, and deployed environment before delivery, and make sure the product behaves the way it was designed to behave outside the development environment.',
          ],
        },
      ],
    },
    results: {
      title: 'Results & Milestones',
      /* An array, because the Arabic section carries no support line at all. */
      note: ['I prefer to have a real project or result behind anything I claim.'],
      items: [
        {
          value: 'Sendy',
          text: 'Founded and engineered a multi-tenant SaaS platform for commerce and logistics.',
        },
        {
          value: '1st Place',
          event: 'QI CARD Hackathon 2025',
          text: 'Banking System — addressed duplicate money transfers caused by repeated requests, with a focus on transaction safety and preventing the same financial operation from being processed more than once.',
        },
        {
          value: '1st Place',
          event: 'ITS Hackathon 2025',
          text: 'NANO — an AI-powered optical character recognition platform for Arabic documents.',
        },
        {
          value: '2nd Place',
          event: 'HUB200 Hackathon 2025',
          text: 'Dynamic Form Builder — a no-code tool for creating and configuring dynamic forms.',
        },
      ],
    },
    tech: {
      title: 'Technologies I Use',
      intro:
        'I do not list every technology I have tried. These are the tools I regularly return to when building projects.',
      groups: [
        {
          title: 'Backend',
          items: ['ASP.NET Core', 'C#', 'FastAPI', 'Python', 'Entity Framework Core', 'PostgreSQL'],
        },
        {
          title: 'Frontend',
          items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        },
        {
          title: 'Infrastructure',
          items: ['Docker', 'Railway', 'DigitalOcean'],
        },
        {
          title: 'AI & Automation',
          items: [
            'n8n',
            'Hugging Face',
            'AI APIs',
            'Automation Workflows',
            'OpenAI API',
            'Ollama',
            'LangChain',
          ],
        },
      ],
    },
    cases: {
      title: 'Case Studies',
      intro: [
        'The final interface matters, but it is not the whole story.',
        'Each case study focuses on the problem, the constraints, the decisions I made, and the parts that required more thought than simply writing the code.',
      ],
      /* Order zips to `CASE_SLUGS` in `home/sections.tsx`. */
      items: [
        {
          title: 'Sendy',
          subtitle: 'From Separate Operations to One Operating Platform',
          paragraphs: [
            'A merchant needs to follow an order from the moment it is created until it is delivered.',
            'At the same time, the system needs to know who owns that order, who can modify it, and which parts of the process each user is allowed to see.',
            'In this case study, I break down the system architecture, role separation, and the workflows that move through multiple states before they are complete.',
          ],
          cta: 'Read Sendy Case Study',
        },
        {
          title: 'IMMAR',
          subtitle: 'The Student App and Admin Dashboard Should Not Be the Same Product',
          paragraphs: [
            'Students and staff work within the same platform, but their needs and permissions are completely different.',
            'The challenge was defining that boundary clearly: what belongs in the student application, what stays inside the operational dashboard, and who the system allows to access each part.',
          ],
          cta: 'Read IMMAR Case Study',
        },
        {
          title: 'Virtual Banking API',
          subtitle: 'What Happens When the Same Transfer Is Sent Twice?',
          paragraphs: [
            'In financial systems, receiving a successful request is not enough.',
            'The important part is making sure the operation itself is not repeated because of multiple clicks, retries, or network issues.',
            'This project focuses on transaction safety, operation state, and preventing the same financial transaction from being executed more than once.',
          ],
          cta: 'Read Virtual Banking API Case Study',
        },
      ],
    },
    archive: {
      title: 'Archive',
      support:
        'Smaller projects than the main case studies, but each represents a different part of the work I do.',
      /* Order zips to `ARCHIVE_SLUGS` in `home/sections.tsx`. */
      items: [
        {
          title: 'Al-Tafawuq School System',
          subtitle: 'School Operations Platform',
          paragraphs: [
            'Attendance, absences, tuition, and day-to-day student follow-up in one dashboard.',
          ],
          cta: 'View Project',
        },
        {
          title: 'NANO',
          subtitle: 'Arabic OCR Starting From an Image',
          paragraphs: [
            'Extracting text from the image was only one part of the problem.',
            'The result also had to be reviewable, structured, and useful, especially for Arabic documents that were never created as digital text in the first place.',
          ],
          cta: 'View NANO',
        },
        {
          title: 'Dynamic Form Builder',
          subtitle: 'No-Code Tool',
          paragraphs: [
            'A form builder for adding, arranging, and configuring fields without writing code.',
          ],
          cta: 'View Project',
        },
        {
          title: 'Invoice Mini App',
          subtitle: 'SuperQi Mini App',
          paragraphs: [
            'A mini application for creating and viewing invoices inside the SuperQi ecosystem, where the product operates within the APIs and constraints of a larger platform.',
          ],
          cta: 'View Project',
        },
        {
          title: 'MedicHub AI',
          subtitle: 'Medical Imaging Backend',
          paragraphs: [
            'Multiple image-analysis models exposed through a single FastAPI service, with a unified interface for receiving input and returning results.',
          ],
          cta: 'View Project',
        },
      ],
    },
    contact: {
      title: 'Work With Me',
      paragraphs: [
        'If you are building a new product, internal system, dashboard, backend, or an idea that needs to become a working product, tell me about it.',
        'You do not need a polished brief.',
        'Tell me what exists today, what should happen next, and what is currently getting in the way.',
        'If I believe I can contribute to the project, I will explain how I would approach it from the beginning. If it is outside the kind of work I do, I will tell you directly.',
      ],
      /* The copy sets these two in Latin on both sides. */
      linkedin: 'LinkedIn',
      github: 'GitHub',
      directLabel: 'Direct contact',
    },
  },

  work: {
    eyebrow: 'WORK',
    title: 'Products, platforms and the systems underneath them.',
    support:
      'I build commerce, education, fintech and AI systems — mostly the operational kind, where the interface is used every day and correctness matters more than novelty.',
    featuredLabel: 'Featured case studies',
    archiveLabel: 'Archive',
    filterLabel: 'Filter by type',
    filterAll: 'All',
    resultsCount: 'projects',
    empty: 'No projects match this filter.',
  },

  caseStudy: {
    overview: 'Overview',
    problem: 'The problem',
    outcome: 'The outcome',
    responsibilities: 'What I was responsible for',
    services: 'Services',
    chaptersLabel: 'Case study chapters',
    nextLabel: 'Next case study',
    ctaTitle: 'Building something in this space?',
    ctaText: 'I am available for a limited number of projects. Tell me what you are working on.',
    ctaButton: 'Start a project',
    conceptNotice:
      'The product interfaces on this page are compositions built from each platform’s real module structure. They are not screenshots of production systems — these are private client and commercial platforms.',
    /*
     * Used in place of `conceptNotice` on any case study with a supplied hero
     * export. Both halves have to be said: the image at the top is real product
     * interface but a presentation render rather than a capture, and the
     * compositions further down are still coded concepts.
     */
    mockupNotice:
      'The interface above is a presentation mockup of the product, not a screenshot captured from a running system. The interface compositions further down this page are built from the platform’s real module structure — these are private client and commercial platforms.',
  },

  about: {
    eyebrow: 'ABOUT',
    title: 'I build software that has to work on a Tuesday morning in Baghdad.',
    lead: "I'm Mohammed Nafia, a full-stack software engineer and product founder. I studied Artificial Intelligence and Robotics Engineering at Al-Nahrain University's College of Engineering, and I have been freelancing professionally since 2024 — building commerce, education, fintech and AI systems for clients, and one product of my own.",
    narrative: [
      'Most of what I build is operational software: the kind somebody sits in front of for six hours a day. That has shaped how I work. I care much more about what happens when a delivery provider times out, when a permission check is ambiguous, or when a merchant has three hundred rows to get through, than about how a landing page animates.',
      'I founded Sendy because I watched merchants in Baghdad run entire businesses across a notebook, a chat app and three delivery companies that did not talk to each other. I planned and built IMMAR because an education platform serving students and teachers cannot be one interface pretending to be two. I built NANO in a weekend with a team and we won, mostly because we spent our last hours making the result verifiable instead of marginally more accurate.',
      'I work in Arabic and English, and I treat them as equal materials. Bilingual implementation is not a translation task added at the end — it changes how you author every layout, every table, every date field. Products built for this region deserve better than a mirrored afterthought.',
    ],
    timelineTitle: 'Timeline',
    timeline: [
      {
        period: '2026 — Present',
        title: 'Founder & Full-Stack Developer, Sendy',
        text: 'Multi-tenant commerce and logistics SaaS platform. Founded the project, built the merchant dashboard, driver application and storefronts, and deployed on DigitalOcean and Railway.',
      },
      {
        period: '2024 — Present',
        title: 'Freelance Full-Stack Developer & Technical Project Coordinator',
        text: 'Client software projects end to end — discovery, requirements, development, testing, deployment and handover — across React, TypeScript, ASP.NET Core, FastAPI and PostgreSQL.',
      },
      {
        period: '2025',
        title: '1st place — ITS Hackathon',
        text: 'Team award for NANO, an AI-powered OCR platform that extracts and digitises text from images in real time.',
      },
      {
        period: '2025',
        title: '2nd place — HUB200 Hackathon',
        text: 'Dynamic Form Builder, during Global Entrepreneurship Week — a drag-and-drop tool for creating custom web forms without coding.',
      },
      {
        period: '6-month programme',
        title: 'Software Engineering Trainee, Iraq TechSchool',
        text: 'In collaboration with Qi Card, Digital Zone, Computiq and HUB200. REST API design, database modelling, authentication flows and layered system architecture, with team projects in production-like environments.',
      },
      {
        period: 'Selected',
        title: 'Iraqi Young Leaders Exchange Program (IYLEP), United States',
        text: 'Selected for a competitive international leadership and entrepreneurship exchange programme.',
      },
      {
        period: 'Education',
        title: 'B.Sc. Artificial Intelligence & Robotics Engineering',
        text: 'Al-Nahrain University — College of Engineering, Baghdad, Iraq.',
      },
    ],
    valuesTitle: 'How I think about the work',
    values: [
      {
        title: 'Ownership',
        text: 'I take a project from requirements through deployment. Not "the frontend is done" — done.',
      },
      {
        title: 'Clarity',
        text: 'If I cannot explain the architecture to the person paying for it, the architecture is wrong.',
      },
      {
        title: 'Reliable execution',
        text: 'Failure paths, permission checks, error states and reconciliation are the job, not the polish.',
      },
      {
        title: 'Product thinking',
        text: 'I ask what the business actually needs before I ask what should be built.',
      },
      {
        title: 'Continuous learning',
        text: 'Every project on this site taught me something I got wrong on the one before it.',
      },
    ],
    stackTitle: 'Current technical focus',
    stackGroups: [
      {
        title: 'Frontend',
        items: [
          'React',
          'TypeScript',
          'Next.js',
          'Tailwind CSS',
          'shadcn/ui',
          'Vite',
          'TanStack Query',
        ],
      },
      {
        title: 'Backend & APIs',
        items: [
          'ASP.NET Core',
          'C#',
          'FastAPI',
          'Python',
          'REST API design',
          'Clean Architecture',
          'Webhooks',
        ],
      },
      {
        title: 'Data',
        items: [
          'PostgreSQL',
          'SQL Server',
          'Entity Framework Core',
          'Data modelling',
          'Query optimisation',
        ],
      },
      {
        title: 'Security & access',
        items: ['JWT', 'RBAC', 'Permission management', 'Input validation', 'Secure API design'],
      },
      {
        title: 'Cloud & tooling',
        items: ['Docker', 'Railway', 'DigitalOcean', 'Git', 'GitHub', 'DNS & domains'],
      },
      {
        title: 'Practices',
        items: [
          'Debugging',
          'Audit logging',
          'Transactional systems',
          'Arabic/English localisation',
          'RTL/LTR implementation',
        ],
      },
    ],
    workingStyleTitle: 'Working with me',
    workingStyle: [
      'I ask a lot of questions at the start. It is cheaper than rebuilding later.',
      'I write things down — scope, API contracts, decisions — so nothing depends on someone remembering a conversation.',
      'I show working software early and often, in vertical slices rather than in a big reveal.',
      'I will tell you when something you asked for is a bad idea, once, with a reason. Then I will build what you decide.',
      'I work in Arabic and English, with clients in Iraq, the region, and remotely.',
    ],
    languagesTitle: 'Languages',
    languages: 'Arabic — native. English (B2–C1) — professional working proficiency.',
    cta: 'Start a project',
  },

  services: {
    eyebrow: 'SERVICES',
    title: 'What you can hire me to do.',
    support:
      'I work with founders, business owners and teams who need a product built properly rather than quickly. Below is what that looks like in practice.',
    forWhom: 'Who it is for',
    solves: 'What it solves',
    deliverables: 'Typical deliverables',
    howIWork: 'How I work',
    proof: 'Proof',
    items: [
      {
        title: 'Product discovery & technical planning',
        forWhom: 'Founders and business owners with an idea, a spreadsheet, or a broken process.',
        solves:
          'You know what the business needs but not what should be built, in what order, or what it will cost you technically.',
        deliverables: [
          'Product scope and module breakdown',
          'User flows and role model',
          'System architecture and data model outline',
          'Task plan and delivery milestones',
        ],
        howIWork:
          'I start with how the business runs today, not with technology. The output is a plan you could hand to another engineer.',
      },
      {
        title: 'Full-stack SaaS & web application delivery',
        forWhom: 'Businesses that need a real product, not a prototype that stalls at 80%.',
        solves:
          'You need one person accountable from data model to interface, who will finish it and deploy it.',
        deliverables: [
          'Complete web application, frontend and backend',
          'Authentication, roles and permissions',
          'Deployment, environments and handover documentation',
        ],
        howIWork:
          'Vertical slices — each one shippable — so you see working software throughout rather than at the end.',
      },
      {
        title: 'Backend systems & API architecture',
        forWhom: 'Teams with a frontend, a mobile app, or a partner integration that needs a solid API behind it.',
        solves:
          'Your business rules are scattered, duplicated across clients, or impossible to audit.',
        deliverables: [
          'REST API with validated contracts',
          'Clean Architecture / layered structure',
          'Database design, migrations and seed data',
          'Auth, RBAC and audit logging',
        ],
        howIWork:
          'All business rules live in one place. Clients render and validate for the user — they never become a second source of truth.',
      },
      {
        title: 'Dashboards & operational platforms',
        forWhom: 'Operations teams drowning in spreadsheets, WhatsApp groups and paper.',
        solves:
          'The information exists but nobody can see all of it at once, and nothing reconciles.',
        deliverables: [
          'Role-based operational dashboard',
          'Data tables with filtering, pagination and bulk action',
          'Reporting and export surfaces',
          'Complete loading, empty and error states',
        ],
        howIWork:
          'Designed for the person who uses it eight hours a day, which is a different problem from designing for a demo.',
      },
      {
        title: 'Arabic/English bilingual product implementation',
        forWhom: 'Products serving Iraqi and regional users alongside international ones.',
        solves:
          'Your product was built LTR and the Arabic version is a mirrored afterthought that breaks on every dense screen.',
        deliverables: [
          'Logical-property layout system',
          'Authored RTL behaviour for navigation, tables, dates and forms',
          'LTR isolation for technical and numeric tokens',
          'Localised validation, metadata and accessibility labels',
        ],
        howIWork:
          'Both directions are designed, not derived. This is structural work, and it is much cheaper to do early.',
      },
      {
        title: 'AI integrations & workflow automation',
        forWhom: 'Businesses with a manual, repetitive information-handling step.',
        solves:
          'Someone is retyping, re-checking or re-routing information that a system could handle.',
        deliverables: [
          'Inference or extraction pipeline',
          'Service interface over the model',
          'A verification UI so results can be trusted or corrected',
        ],
        howIWork:
          'The interface matters as much as the model. An output nobody can verify is not a result.',
      },
      {
        title: 'Production hardening, debugging & deployment support',
        forWhom: 'Teams with something built that is not reliable, not deployed, or not maintainable.',
        solves:
          'It works on a developer machine, breaks in production, and nobody is sure why.',
        deliverables: [
          'Environment configuration, domains and DNS',
          'Deployment on Railway, DigitalOcean or similar',
          'Error handling, audit logging and failure recovery',
          'Handover documentation and seed/test data',
        ],
        howIWork:
          'I find the smallest root cause rather than the fastest patch, and I document what I changed.',
      },
    ],
    engagementTitle: 'Scope, timeline and budget',
    engagementText:
      'I do not publish fixed prices, because a number quoted before understanding a product is a guess dressed as a commitment. Tell me what you are building and what is blocking it, and we will discuss scope, timeline and budget once the shape of the work is clear. If the project is not a fit for me, I will say so early.',
    cta: 'Start a project',
  },

  contact: {
    eyebrow: 'CONTACT',
    title: "Tell me what you're building.",
    support:
      'The more specific you are, the more useful my reply will be. I read every message and respond to the ones I can genuinely help with.',
    directTitle: 'Or reach me directly',
    availabilityTitle: 'Availability',
    availabilityText:
      'Currently taking on a limited number of projects. I will tell you honestly if I do not have capacity.',
    form: {
      name: 'Your name',
      namePlaceholder: 'Mohammed Nafia',
      email: 'Email',
      emailPlaceholder: 'you@company.com',
      company: 'Company or project name',
      companyOptional: 'Optional',
      companyPlaceholder: 'Acme Trading',
      service: 'What do you need?',
      servicePlaceholder: 'Select a service',
      summary: 'Project summary',
      summaryPlaceholder:
        'What are you building, who is it for, and what is blocking it right now?',
      timeline: 'Desired timeline',
      timelinePlaceholder: 'Select a timeline',
      budget: 'Approximate budget range',
      budgetOptional: 'Optional',
      budgetPlaceholder: 'Prefer to discuss',
      contactMethod: 'Preferred contact method',
      language: 'Preferred language',
      submit: 'Send inquiry',
      submitting: 'Sending…',
      required: 'Required',
      timelineOptions: [
        'As soon as possible',
        'Within 1–3 months',
        'In 3–6 months',
        'Still planning',
      ],
      budgetOptions: [
        'Prefer to discuss',
        'Small scope',
        'Medium scope',
        'Large / ongoing',
      ],
      contactMethods: ['Email', 'LinkedIn', 'WhatsApp'],
      languageOptions: ['English', 'Arabic'],
    },
    validation: {
      nameRequired: 'Please enter your name.',
      emailRequired: 'Please enter an email address.',
      emailInvalid: 'That does not look like a valid email address.',
      serviceRequired: 'Please choose a service.',
      summaryRequired: 'Please describe your project.',
      summaryShort: 'Please add a little more detail — at least 20 characters.',
      formInvalid: 'Please fix the highlighted fields and try again.',
    },
    states: {
      successTitle: 'Message sent.',
      successText:
        'Thank you — your inquiry has been received. I will reply to the email address you provided.',
      successAgain: 'Send another message',
      errorTitle: 'That did not send.',
      errorText: 'Something went wrong on my side. Please try again.',
      networkErrorTitle: 'Connection problem.',
      networkErrorText:
        'Your message could not be sent because the request did not reach the server. Please check your connection and try again.',
      unavailableTitle: 'The form is not connected yet.',
      unavailableText:
        'No delivery provider is configured on this deployment, so I cannot honestly tell you the message was sent. Please email me directly instead — your message has not been delivered.',
      retry: 'Try again',
    },
  },

  privacy: {
    eyebrow: 'PRIVACY',
    title: 'Privacy',
    updated: 'Last updated',
    sections: [
      {
        title: 'What this site collects',
        text: 'This site has no analytics, no tracking scripts, no advertising pixels and no third-party embeds. Nothing about your visit is recorded.',
      },
      {
        title: 'The contact form',
        text: 'If you submit the inquiry form, the information you type into it — your name, email address, optional company name, selected service, project summary, timeline, optional budget range, preferred contact method and preferred language — is sent to me so I can reply. It is not shared with anyone, sold, or used for marketing.',
      },
      {
        title: 'Delivery provider',
        text: 'When a delivery provider is configured for this deployment, form submissions pass through it in order to reach my inbox. If no provider is configured, the form tells you clearly that your message was not delivered rather than pretending it succeeded.',
      },
      {
        title: 'Language preference',
        text: 'Your chosen language is stored in a cookie on your own device so the site opens in the language you picked. It contains nothing else and identifies nobody.',
      },
      {
        title: 'Your data',
        text: 'If you have sent me an inquiry and want it deleted, email me and I will remove it.',
      },
    ],
  },

  notFound: {
    code: '404',
    title: 'This route does not resolve.',
    text: 'The page you were looking for is not here. It may have moved, or the link may be wrong.',
    ctaWork: 'See selected work',
    ctaHome: 'Back to home',
  },

  footer: {
    tagline: 'Engineered in Baghdad. Designed for the real world.',
    navTitle: 'Navigate',
    connectTitle: 'Connect',
    localeTitle: 'Language',
    rights: 'All rights reserved.',
    builtWith: 'Designed and built by Mohammed Nafia.',
  },
} as const;

/**
 * Widen literal types so other locales must match the *shape* of `en` — every
 * key, every nesting level — without having to repeat English string literals.
 * A missing or misspelled key in any locale is a type error, not a runtime
 * surprise. Array *lengths* are additionally checked by `tests/unit/i18n.test.ts`.
 */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;

export type Dictionary = Widen<typeof en>;
