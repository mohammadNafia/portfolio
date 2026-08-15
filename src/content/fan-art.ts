import type { Localized } from './schema';

/**
 * Real artwork for the hero fan.
 *
 * Keyed by the project each image actually *depicts*, not by filename order.
 * The delivered files are not a 1:1 run across the fan's seven slots — they
 * cover five projects, one of them twice:
 *
 *   fan-1 → al-tafawuq        fan-4 → sendy (the strongest; centre slot)
 *   fan-2 → virtual-banking   fan-5 → immar
 *   fan-3 → sendy (spare)     fan-6 → invoice-mini-app
 *
 * Mapping by filename instead would have put a school dashboard on the invoice
 * card and sent anyone clicking it to the wrong case study, so the fan resolves
 * art through this table and falls back to `FanCardArt` for the two projects
 * that have no photograph yet (form-builder, nano-ocr). Those two are already
 * registered in `scripts/optimize-images.mjs` as `fan-form-builder.png` and
 * `fan-nano-ocr.png` — named by project, since the index names are the thing
 * that misleads here. Dropping either into the source folder and re-running
 * `npm run images` leaves only the entry below to add.
 *
 * `fan-3.png` is a second Sendy composition — the storefront and the admin
 * console — with no slot of its own, since a project cannot appear twice in the
 * fan without duplicating its link. It stays in the source-of-truth folder and
 * is not shipped.
 *
 * These paths are the *served* copies, written by `scripts/optimize-images.mjs`
 * from the full-resolution PNGs in `docs/pixel-portfolio-style/assets/img/`.
 * They are 840×1120 WebP — 3:4, which is exactly the ratio of both the desktop
 * 210×280 slot and the mobile 168×224 one. Do not point these at the docs
 * folder; it is documentation and is not served.
 */
export type FanArt = {
  src: string;
  alt: Localized;
};

export const fanArt: Record<string, FanArt> = {
  sendy: {
    src: '/img/fan-4.webp',
    alt: {
      en: 'Sendy — the merchant console: order counts by state, the delivery status history and the live order table, in Arabic.',
      ar: 'ساندي — لوحة التاجر: أعداد الطلبات حسب الحالة، سجل حالات التوصيل وجدول الطلبات الحيّ.',
    },
  },
  immar: {
    src: '/img/fan-5.webp',
    alt: {
      en: 'IMMAR — the student app: the course catalogue, lesson progress and a course detail screen.',
      ar: 'إيمار — تطبيق الطالب: دليل الدورات، تقدّم الدروس وشاشة تفاصيل الدورة.',
    },
  },
  'virtual-banking': {
    src: '/img/fan-2.webp',
    alt: {
      en: 'Virtual Banking API — wallet screens driven by the API: an account balance in Iraqi dinars, quick actions and a transfer flow.',
      ar: 'واجهة الخدمات المصرفية الافتراضية — شاشات محفظة تعمل على الواجهة البرمجية: رصيد بالدينار العراقي، إجراءات سريعة وعملية تحويل.',
    },
  },
  'al-tafawuq': {
    src: '/img/fan-1.webp',
    alt: {
      en: 'Al-Tafawuq School System — the admin dashboard: the attendance trend, outstanding instalments and the day’s absences.',
      ar: 'نظام مدرسة التفوق — لوحة التحكم: منحنى الحضور، الأقساط المتبقية وغياب اليوم.',
    },
  },
  'invoice-mini-app': {
    src: '/img/fan-6.webp',
    alt: {
      en: 'Invoice Mini App — composing an invoice, the generated invoice, and the mini-app’s opening screen.',
      ar: 'تطبيق الفواتير المصغّر — إنشاء فاتورة، الفاتورة الناتجة، وشاشة افتتاح التطبيق المصغّر.',
    },
  },
};

export function getFanArt(slug: string): FanArt | undefined {
  return fanArt[slug];
}
