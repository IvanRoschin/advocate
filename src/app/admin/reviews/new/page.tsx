import ReviewEditorClient from '../_components/ReviewEditorClient';

export const dynamic = 'force-dynamic';

export default async function NewReviewPage() {
  return <ReviewEditorClient mode="create" />;
}
