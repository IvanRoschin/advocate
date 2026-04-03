import { renderLayout } from '@/app/lib/layouts/renderLayout';
import {
  privacyPolicyLayout,
  PrivacyPolicyLayoutNode,
} from '@/app/resources/content/pages/privacy-policy.layout';

import {
  PRIVACY_POLICY_SECTIONS,
  PrivacyPolicySectionProps,
} from './_components/privacy.sections';

export const dynamic = 'force-dynamic';

export default async function PrivacyPolicyPage() {
  const sectionProps: PrivacyPolicySectionProps = {};

  return (
    <main className="bg-background text-foreground min-h-screen">
      {renderLayout({
        layout: privacyPolicyLayout as PrivacyPolicyLayoutNode[],
        sections: PRIVACY_POLICY_SECTIONS,
        sectionProps,
        renderGroup: ({ node, children, index }) => (
          <div key={`${node.key}-${index}`} className={node.wrapperClassName}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              {children}
            </div>
          </div>
        ),
      })}
    </main>
  );
}
