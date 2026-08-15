/**
 * NANO — AI/OCR hackathon product.
 *
 * Sources: `cv/cv_data.py` — ACHIEVEMENTS ("1st Place – ITS Hackathon 2025,
 * team award for NANO, an AI-powered OCR platform") and the NANO project entry
 * ("Co-developed an AI-powered optical character recognition web application
 * that extracts and digitizes text from images in real time... delivered the
 * extraction pipeline and web interface as a team under hackathon time
 * constraints").
 *
 * No accuracy figure, benchmark, dataset size, customer or production-scale
 * claim appears here — none is documented in any source material.
 */
export const nano = {
  slug: 'nano-ocr',
  title: 'NANO',
  titleLocalized: { en: 'NANO', ar: 'نانو' },
  category: 'ai' as const,
  categoryLabel: {
    en: 'AI / OCR platform',
    ar: 'منصة ذكاء اصطناعي / تعرّف ضوئي',
  },
  classification: 'hackathon' as const,
  role: {
    en: 'Team member · Extraction pipeline & web interface',
    ar: 'عضو فريق · مسار الاستخراج وواجهة الويب',
  },
  year: '2025',
  status: { en: '1st place · ITS Hackathon 2025', ar: 'المركز الأول · هاكاثون ITS 2025' },
  headline: {
    en: 'Arabic documents that exist only as photographs are effectively unsearchable. NANO turns a phone photo into structured, usable text in real time.',
    ar: 'المستندات العربية الموجودة كصور فقط غير قابلة للبحث عملياً. نانو يحوّل صورة الهاتف إلى نص منظّم قابل للاستخدام فورياً.',
  },
  summary: {
    en: 'NANO is an AI-powered optical character recognition platform that extracts and digitises text from images in real time. Built as a team under hackathon constraints, it pairs machine-learning inference with a production-shaped web interface — and won first place at the ITS Hackathon 2025.',
    ar: 'نانو منصة تعرّف ضوئي مدعومة بالذكاء الاصطناعي تستخرج النص من الصور وترقمنه فورياً. بُني كعمل فريق ضمن قيود الهاكاثون، ويجمع بين استدلال التعلّم الآلي وواجهة ويب بمستوى إنتاجي — وفاز بالمركز الأول في هاكاثون ITS 2025.',
  },
  problem: {
    en: 'An enormous amount of administrative information in Iraq exists only as images: a photographed invoice, a scanned form, a picture of a printed record. It cannot be searched, filtered, summed or checked. Somebody has to retype it, and that person makes mistakes.',
    ar: 'كمّ هائل من المعلومات الإدارية في العراق موجود كصور فقط: فاتورة مصوّرة، استمارة ممسوحة، صورة لسجل مطبوع. لا يمكن البحث فيها ولا تصفيتها ولا جمعها ولا التحقق منها. لا بد أن يعيد أحدهم كتابتها — ويرتكب أخطاء.',
  },
  outcome: {
    en: 'A working end-to-end product: image in, structured text out, through an interface a non-technical judge could use unaided. First place at ITS Hackathon 2025.',
    ar: 'منتج عامل من الطرف إلى الطرف: صورة تدخل، ونص منظّم يخرج، عبر واجهة يستطيع محكّم غير تقني استخدامها دون مساعدة. المركز الأول في هاكاثون ITS 2025.',
  },
  responsibilities: [
    {
      en: 'Co-developed an AI-powered OCR web application that extracts and digitises text from images in real time.',
      ar: 'شاركتُ في تطوير تطبيق ويب للتعرّف الضوئي مدعوم بالذكاء الاصطناعي يستخرج النص من الصور ويرقمنه فورياً.',
    },
    {
      en: 'Delivered the extraction pipeline and the web interface as part of a team, under hackathon time constraints.',
      ar: 'نفّذتُ مسار الاستخراج وواجهة الويب ضمن فريق، تحت ضغط وقت الهاكاثون.',
    },
    {
      en: 'Paired machine-learning inference with a production-ready web interface rather than a notebook demo.',
      ar: 'جمعتُ استدلال التعلّم الآلي مع واجهة ويب جاهزة للإنتاج بدل عرض داخل دفتر تجريبي.',
    },
  ],
  stack: ['Python', 'FastAPI', 'OCR', 'Machine learning inference', 'React', 'REST API'],
  services: [
    { en: 'AI integration', ar: 'دمج الذكاء الاصطناعي' },
    { en: 'Workflow automation', ar: 'أتمتة سير العمل' },
    { en: 'Rapid product delivery', ar: 'تسليم منتج سريع' },
  ],
  accent: '#e4572e',
  accentName: 'NANO copper',
  featured: true,
  tier: 1 as const,
  cover: 'nano-pipeline' as const,
  proof: {
    en: '1st place — ITS Hackathon 2025',
    ar: 'المركز الأول — هاكاثون ITS 2025',
  },
  links: [],
  seo: {
    title: {
      en: 'NANO — AI-powered OCR platform, first place at ITS Hackathon 2025',
      ar: 'نانو — منصة تعرّف ضوئي بالذكاء الاصطناعي، المركز الأول في هاكاثون ITS 2025',
    },
    description: {
      en: 'How NANO turns photographed documents into structured, searchable text in real time — the extraction pipeline, the interface decisions, and what a 48-hour constraint actually changes.',
      ar: 'كيف يحوّل نانو المستندات المصوّرة إلى نص منظّم قابل للبحث فورياً — مسار الاستخراج، وقرارات الواجهة، وما الذي يغيّره قيد الوقت فعلياً.',
    },
  },
  chapters: [
    {
      id: 'context',
      title: { en: 'The problem with a photograph', ar: 'مشكلة الصورة' },
      blocks: [
        {
          type: 'lead' as const,
          text: {
            en: 'A photograph of a document looks like information. To software, it is a rectangle of pixels — and everything downstream that wants to search, total or verify it has to wait for a human.',
            ar: 'صورة المستند تبدو كمعلومة. لكنها بالنسبة للبرمجيات مستطيل من البكسلات — وكل ما يريد لاحقاً أن يبحث أو يجمع أو يتحقّق ينتظر إنساناً.',
          },
        },
        {
          type: 'prose' as const,
          text: {
            en: 'The gap is not exotic. Invoices, forms, records and receipts are captured on phones every day and then re-entered by hand into a system that could have read them directly. The re-entry is slow, it is expensive, and it introduces errors precisely where accuracy matters most.',
            ar: 'الفجوة ليست نادرة. تُلتقط الفواتير والاستمارات والسجلات والإيصالات بالهواتف يومياً ثم تُعاد كتابتها يدوياً في نظام كان بإمكانه قراءتها مباشرة. إعادة الإدخال بطيئة ومكلفة، وتُدخل الأخطاء في المكان الذي تهم فيه الدقة أكثر ما تهم.',
          },
        },
        {
          type: 'callout' as const,
          title: { en: 'Honest scope', ar: 'نطاق صريح' },
          text: {
            en: 'NANO was built as a hackathon product by a team, over a fixed and short period. It is presented here as exactly that: a working end-to-end prototype that won its category — not a deployed commercial service, and not a benchmarked model.',
            ar: 'بُني نانو كمنتج هاكاثون بعمل فريق خلال مدة قصيرة ومحدّدة. ويُعرض هنا بالضبط كما هو: نموذج عامل من الطرف إلى الطرف فاز بفئته — لا خدمة تجارية منشورة، ولا نموذجاً مُقاساً بمعايير.',
          },
        },
      ],
    },
    {
      id: 'pipeline',
      title: { en: 'From photo to structured text', ar: 'من الصورة إلى نص منظّم' },
      blocks: [
        {
          type: 'flow' as const,
          caption: {
            en: 'The extraction pipeline. Each stage is independently inspectable — which is what made debugging possible inside the time limit.',
            ar: 'مسار الاستخراج. كل مرحلة قابلة للفحص باستقلال — وهو ما جعل تتبّع الأخطاء ممكناً داخل الوقت المحدّد.',
          },
          steps: [
            {
              label: { en: 'Capture', ar: 'الالتقاط' },
              text: {
                en: 'A photograph or scan arrives — uneven lighting, a slight angle, a phone camera rather than a flatbed.',
                ar: 'تصل صورة أو مسح ضوئي — إضاءة غير متساوية وزاوية مائلة وكاميرا هاتف لا ماسح مسطّح.',
              },
            },
            {
              label: { en: 'Preprocess', ar: 'المعالجة المسبقة' },
              text: {
                en: 'The image is normalised before any model sees it. Most accuracy problems in real-world OCR are image problems, not model problems.',
                ar: 'تُطبَّع الصورة قبل أن يراها أي نموذج. معظم مشاكل الدقة في التعرّف الضوئي الواقعي مشاكل صورة لا مشاكل نموذج.',
              },
            },
            {
              label: { en: 'Recognise', ar: 'التعرّف' },
              text: {
                en: 'Machine-learning inference reads the text regions and produces raw character output.',
                ar: 'يقرأ استدلال التعلّم الآلي مناطق النص وينتج مخرجاً حرفياً خاماً.',
              },
            },
            {
              label: { en: 'Structure', ar: 'الهيكلة' },
              text: {
                en: 'Raw output becomes ordered, usable text rather than a wall of characters — the step that decides whether the result is actually useful.',
                ar: 'يتحوّل المخرج الخام إلى نص مرتّب قابل للاستخدام بدل جدار من الحروف — وهي الخطوة التي تحدّد إن كانت النتيجة مفيدة فعلاً.',
              },
            },
            {
              label: { en: 'Present', ar: 'العرض' },
              text: {
                en: 'The interface shows source and extraction together so a person can verify the result instead of trusting it blindly.',
                ar: 'تعرض الواجهة المصدر والاستخراج معاً ليتحقّق الإنسان من النتيجة بدل الوثوق بها عمياً.',
              },
            },
          ],
        },
        {
          type: 'showcase' as const,
          id: 'nano-pipeline' as const,
          caption: {
            en: 'Interface concept — the extraction stages made visible. Composed for this case study; not a captured screenshot of the hackathon build.',
            ar: 'تصوّر للواجهة — مراحل الاستخراج مرئية. مبني لهذه الدراسة، وليس لقطة شاشة من نسخة الهاكاثون.',
          },
        },
      ],
    },
    {
      id: 'ux',
      title: { en: 'Why the interface won it', ar: 'لماذا حسمت الواجهة النتيجة' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'Most hackathon AI projects are a model with a form bolted on. They demo badly, because a judge cannot tell whether the output is right. The decision that mattered most in NANO was spending scarce hours on the interface rather than on chasing a marginally better recognition result.',
            ar: 'معظم مشاريع الذكاء الاصطناعي في الهاكاثونات نموذج مربوط باستمارة. تُعرض بشكل سيّئ لأن المحكّم لا يستطيع الحكم على صحة المخرج. القرار الأهم في نانو كان إنفاق ساعات شحيحة على الواجهة بدل مطاردة تحسّن هامشي في نتيجة التعرّف.',
          },
        },
        {
          type: 'bullets' as const,
          items: [
            {
              en: 'Source image and extracted text are shown side by side, so correctness is checkable at a glance.',
              ar: 'تُعرض الصورة المصدر والنص المستخرج جنباً إلى جنب، فتكون الصحة قابلة للتحقّق بنظرة.',
            },
            {
              en: 'Processing state is visible — the user always knows whether the system is working or has failed.',
              ar: 'حالة المعالجة مرئية — يعرف المستخدم دائماً إن كان النظام يعمل أم فشل.',
            },
            {
              en: 'Output is copyable and usable immediately, because an extraction nobody can act on is not a result.',
              ar: 'المخرج قابل للنسخ والاستخدام فوراً، لأن استخراجاً لا يمكن التصرّف به ليس نتيجة.',
            },
            {
              en: 'The product runs as a web application, so evaluating it needs no setup — a real constraint when judging is timed.',
              ar: 'يعمل المنتج كتطبيق ويب، فلا يحتاج تقييمه إلى أي إعداد — وهو قيد حقيقي حين يكون التحكيم موقوتاً.',
            },
          ],
        },
        {
          type: 'showcase' as const,
          id: 'nano-output' as const,
          caption: {
            en: 'Interface concept — source and extraction shown together, the decision that made the result verifiable.',
            ar: 'تصوّر للواجهة — المصدر والاستخراج معاً، وهو القرار الذي جعل النتيجة قابلة للتحقّق.',
          },
        },
      ],
    },
    {
      id: 'role',
      title: { en: 'My contribution', ar: 'مساهمتي' },
      blocks: [
        {
          type: 'prose' as const,
          text: {
            en: 'NANO was a team award, and it matters to say clearly which part was mine. I worked on the extraction pipeline and the web interface — the path from an uploaded image through to a structured result a person can read, check and copy.',
            ar: 'كان نانو جائزة فريق، ومن المهم توضيح الجزء الذي كان لي. عملتُ على مسار الاستخراج وواجهة الويب — الطريق من صورة مرفوعة إلى نتيجة منظّمة يستطيع الإنسان قراءتها والتحقّق منها ونسخها.',
          },
        },
        {
          type: 'bullets' as const,
          items: [
            {
              en: 'Extraction pipeline: the sequence from captured image through preprocessing and recognition to structured output.',
              ar: 'مسار الاستخراج: التسلسل من الصورة الملتقطة عبر المعالجة المسبقة والتعرّف حتى المخرج المنظّم.',
            },
            {
              en: 'Web interface: upload, processing state, side-by-side verification and copyable output.',
              ar: 'واجهة الويب: الرفع وحالة المعالجة والتحقّق جنباً إلى جنب والمخرج القابل للنسخ.',
            },
            {
              en: 'Pairing machine-learning inference with a production-shaped product rather than a notebook demo.',
              ar: 'جمع استدلال التعلّم الآلي مع منتج بشكل إنتاجي بدل عرض داخل دفتر تجريبي.',
            },
          ],
        },
        {
          type: 'callout' as const,
          title: { en: 'What is not claimed', ar: 'ما لا يُدّعى' },
          text: {
            en: 'I am not claiming sole authorship, a trained model of my own, or any measured accuracy figure. The award was won by a team, and the numbers were never published.',
            ar: 'لا أدّعي التأليف المنفرد، ولا نموذجاً مدرَّباً خاصاً بي، ولا أي رقم دقة مُقاس. فازت بالجائزة فريق، ولم تُنشر الأرقام قط.',
          },
        },
      ],
    },
    {
      id: 'architecture',
      title: { en: 'Architecture under time pressure', ar: 'المعمارية تحت ضغط الوقت' },
      blocks: [
        {
          type: 'layers' as const,
          caption: {
            en: 'A deliberately thin stack. Every layer that could be removed was removed.',
            ar: 'حزمة رفيعة عن قصد. كل طبقة أمكن حذفها حُذفت.',
          },
          layers: [
            {
              name: { en: 'Interface', ar: 'الواجهة' },
              note: { en: 'Upload, state, verification view', ar: 'الرفع والحالة وعرض التحقّق' },
              items: ['React', 'REST client'],
            },
            {
              name: { en: 'Service', ar: 'الخدمة' },
              note: { en: 'One endpoint per pipeline stage', ar: 'نقطة نهاية لكل مرحلة' },
              items: ['FastAPI', 'Python'],
            },
            {
              name: { en: 'Inference', ar: 'الاستدلال' },
              note: { en: 'Preprocessing and recognition', ar: 'المعالجة المسبقة والتعرّف' },
              items: ['Image preprocessing', 'OCR model inference'],
            },
          ],
        },
        {
          type: 'decisions' as const,
          items: [
            {
              challenge: {
                en: 'A single opaque endpoint makes it impossible to tell which stage is producing a bad result.',
                ar: 'نقطة نهاية واحدة معتمة تجعل من المستحيل معرفة أي مرحلة تنتج نتيجة سيئة.',
              },
              decision: {
                en: 'Each pipeline stage stays inspectable in isolation, so a bad extraction can be traced to preprocessing or to recognition.',
                ar: 'تبقى كل مرحلة قابلة للفحص باستقلال، فيمكن إرجاع الاستخراج السيّئ إلى المعالجة المسبقة أو إلى التعرّف.',
              },
              tradeoff: {
                en: 'Slightly more surface area than a monolithic call, and dramatically faster debugging.',
                ar: 'مساحة أوسع قليلاً من نداء واحد مغلق، وتتبّع أخطاء أسرع بكثير.',
              },
            },
            {
              challenge: {
                en: 'Real photographs are nothing like clean test images.',
                ar: 'الصور الحقيقية لا تشبه صور الاختبار النظيفة.',
              },
              decision: {
                en: 'Preprocessing was treated as a first-class stage rather than an afterthought before inference.',
                ar: 'عوملت المعالجة المسبقة كمرحلة أساسية لا كخطوة عابرة قبل الاستدلال.',
              },
              tradeoff: {
                en: 'Time spent on image handling instead of model tuning — the right trade for real inputs.',
                ar: 'وقت أُنفق على معالجة الصور بدل ضبط النموذج — وهي المقايضة الصحيحة لمدخلات واقعية.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'result',
      title: { en: 'Result and recognition', ar: 'النتيجة والتقدير' },
      blocks: [
        {
          type: 'facts' as const,
          items: [
            {
              label: { en: 'Recognition', ar: 'التقدير' },
              value: { en: '1st place — ITS Hackathon 2025', ar: 'المركز الأول — هاكاثون ITS 2025' },
            },
            {
              label: { en: 'Award type', ar: 'نوع الجائزة' },
              value: { en: 'Team award', ar: 'جائزة فريق' },
            },
            {
              label: { en: 'My contribution', ar: 'مساهمتي' },
              value: {
                en: 'Extraction pipeline and web interface',
                ar: 'مسار الاستخراج وواجهة الويب',
              },
            },
            {
              label: { en: 'Deliverable', ar: 'المُنجز' },
              value: {
                en: 'Working end-to-end product',
                ar: 'منتج عامل من الطرف إلى الطرف',
              },
            },
          ],
        },
        {
          type: 'prose' as const,
          text: {
            en: 'NANO is the shortest project on this site and one of the most instructive. Under a hard deadline you cannot build everything, so you find out quickly what you actually believe matters. In our case it was this: a model nobody can verify is not a product, and a product that needs a setup guide will not survive a five-minute evaluation.',
            ar: 'نانو أقصر مشروع على هذا الموقع وأكثرها إفادة. تحت موعد نهائي صارم لا تستطيع بناء كل شيء، فتكتشف سريعاً ما تؤمن فعلاً بأهميته. وفي حالتنا كان هذا: نموذج لا يستطيع أحد التحقّق منه ليس منتجاً، ومنتج يحتاج دليل تنصيب لن ينجو من تقييم مدته خمس دقائق.',
          },
        },
      ],
    },
  ],
};
