import type { IconType } from 'react-icons';
import {
  FaBalanceScale,
  FaBriefcase,
  FaBuilding,
  FaBullhorn,
  FaChevronDown,
  FaChevronUp,
  FaClipboardList,
  FaCreditCard,
  FaEnvelope,
  FaFileAlt,
  FaGavel,
  FaHandshake,
  FaHardHat,
  FaMoneyBillWave,
  FaPen,
  FaQuoteLeft,
  FaQuoteRight,
  FaRegRegistered,
  FaScroll,
  FaShieldAlt,
  FaShoppingCart,
  FaTags,
  FaTrash,
  FaUniversity,
  FaUsers,
  FaUserShield,
  FaUserTie,
} from 'react-icons/fa';
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaThreads,
  FaViber,
  FaWhatsapp,
  FaX,
  FaXTwitter,
} from 'react-icons/fa6';
import {
  FiBookOpen,
  FiGrid,
  FiHome,
  FiMoon,
  FiSettings,
  FiSun,
  FiUser,
} from 'react-icons/fi';
import { GrBusinessService } from 'react-icons/gr';
import {
  HiArrowRight,
  HiArrowTopRightOnSquare,
  HiArrowUpRight,
  HiCalendarDays,
  HiEnvelope,
  HiOutlineDocument,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineLink,
  HiOutlineRocketLaunch,
} from 'react-icons/hi2';
import { IoIosPeople } from 'react-icons/io';
import { LuBriefcaseBusiness } from 'react-icons/lu';
import {
  PiBookBookmarkDuotone,
  PiGridFourDuotone,
  PiImageDuotone,
  PiUserCircleDuotone,
} from 'react-icons/pi';
import {
  SiFigma,
  SiJavascript,
  SiNextdotjs,
  SiSupabase,
  SiTheboringcompany,
} from 'react-icons/si';

export const iconLibrary = {
  arrowUpRight: HiArrowUpRight,
  arrowRight: HiArrowRight,
  email: HiEnvelope,
  globe: HiOutlineGlobeAsiaAustralia,
  services: GrBusinessService,
  person: PiUserCircleDuotone,
  grid: PiGridFourDuotone,
  book: PiBookBookmarkDuotone,
  openLink: HiOutlineLink,
  calendar: HiCalendarDays,
  gallery: PiImageDuotone,
  discord: FaDiscord,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaX,
  twitter: FaXTwitter,
  threads: FaThreads,
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,
  document: HiOutlineDocument,
  rocket: HiOutlineRocketLaunch,
  javascript: SiJavascript,
  nextjs: SiNextdotjs,
  supabase: SiSupabase,
  figma: SiFigma,
  facebook: FaFacebook,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
  reddit: FaReddit,
  telegram: FaTelegram,
  instagram: FaInstagram,
  phone: FaPhone,
  viber: FaViber,
  envelope: FaEnvelope,
  registered: FaRegRegistered,
  briefcaseBusiness: LuBriefcaseBusiness,
  boringCompany: SiTheboringcompany,
  people: IoIosPeople,
  quoteLeft: FaQuoteLeft,
  quoteRight: FaQuoteRight,
  chevronDown: FaChevronDown,
  chevronUp: FaChevronUp,
  sun: FiSun,
  moon: FiMoon,
  home: FiHome,
  about: FiUser,
  practices: FiGrid,
  blog: FiBookOpen,

  // admin / dashboard
  user: FiUser,
  folder: FaTags,
  inbox: FaBullhorn,
  settings: FiSettings,

  // существующие admin keys
  clients: FaUserTie,
  users: FaUsers,
  articles: FaFileAlt,
  categories: FaTags,
  orders: FaShoppingCart,
  leads: FaBullhorn,
  reviews: FiBookOpen,

  // actions
  pen: FaPen,
  trash: FaTrash,

  // misc nav
  payments: FaMoneyBillWave,
  contact: FaEnvelope,
  order: FaShoppingCart,

  banking: FaUniversity, // 🏦 Банковское право
  credit: FaCreditCard, // 💳 Кредитное право
  family: FaUsers, // 👨‍👩‍👧‍👦 Семейное право
  military: FaShieldAlt, // 🛡️ Военное право
  inheritance: FaScroll, // 📜 Наследственное право
  business: FaBriefcase, // 💼 Бизнес право
  civil: FaBalanceScale, // ⚖️ Гражданское право
  criminal: FaGavel, // 🔨 Уголовное право
  administrative: FaClipboardList, // 📋 Административное право
  realEstate: FaBuilding, // 🏢 Недвижимость
  labor: FaHardHat, // 👷 Трудовое право
  documents: FaFileAlt, // 📄 Документы
  disputes: FaHandshake, // 🤝 Споры
  protection: FaUserShield, // 🛡️ Защита прав
} as const satisfies Record<string, IconType>;

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
