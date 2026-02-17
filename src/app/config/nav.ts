import type { ComponentType } from "react";
import { FiBookOpen, FiGrid, FiHome, FiImage, FiUser } from "react-icons/fi";

export type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  /**
   * true = пункт выделяем, если pathname начинается с href (как /blog/*)
   * false = строгое совпадение
   */
  startsWith?: boolean;
  enabled?: boolean;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Главная", Icon: FiHome, startsWith: false, enabled: true },
  { href: "/about", label: "Обо мне", Icon: FiUser, startsWith: false, enabled: true },
  { href: "/work", label: "Практика", Icon: FiGrid, startsWith: true, enabled: true },
  { href: "/blog", label: "Блог", Icon: FiBookOpen, startsWith: true, enabled: true },
  { href: "/gallery", label: "Галерея", Icon: FiImage, startsWith: true, enabled: true },
];