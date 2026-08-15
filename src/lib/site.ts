/**
 * Verified public identity. Every value here comes from `cv/cv_data.py` CONTACT.
 * Nothing is invented — an unverified channel is simply absent rather than
 * guessed at.
 */
export const site = {
  name: 'Mohammed Nafia',
  nameAr: 'محمد نافع',
  fullName: 'Mohammed Nafia Nadhim',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mohammednafia.com',
  email: 'mohammadnafia1@gmail.com',
  phone: '+964 780 066 8844',
  linkedin: 'https://www.linkedin.com/in/mohammed-nafia-7b58141ba',
  linkedinHandle: 'mohammed-nafia',
  github: 'https://github.com/mohammadNafia',
  githubHandle: 'mohammadNafia',
  location: 'Baghdad, Iraq',
  locationAr: 'بغداد، العراق',
  /** Asia/Baghdad is UTC+3 year-round — no DST since 2015. */
  timeZone: 'Asia/Baghdad',
  coordinates: '33.3152° N, 44.3661° E',
} as const;

export const socialLinks = [
  { key: 'email', href: `mailto:${site.email}`, label: 'Email', handle: site.email },
  { key: 'linkedin', href: site.linkedin, label: 'LinkedIn', handle: site.linkedinHandle },
  { key: 'github', href: site.github, label: 'GitHub', handle: site.githubHandle },
] as const;
