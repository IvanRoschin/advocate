import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';
import { leadClientContent } from './leadClientContent';

export interface LeadClientTemplateProps {
  name?: string;
}

export function leadClientTemplate(props: LeadClientTemplateProps) {
  return baseEmailLayout({
    title: `Дякуємо${props.name ? `, ${props.name}` : ''} 👋`,
    content: leadClientContent(props),
    footer: legalFooter(),
  });
}
