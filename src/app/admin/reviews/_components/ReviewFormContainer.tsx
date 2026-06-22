import { getArticlesPublicList, getServicesPublicList } from '@/app/actions';
import { ReviewForm } from '@/app/components';
import {
  CreateReviewRequestDTO,
  REVIEW_PAGE_OPTIONS,
  ReviewTargetOptionDto,
  UpdateReviewDTO,
} from '@/app/types';

export const revalidate = 60;

type BaseProps = {
  onClose: () => void;
  submitLabel?: string;
};

type CreateModeProps = BaseProps & {
  mode: 'create';
  onSubmit: (values: CreateReviewRequestDTO) => void | Promise<void>;
};

type EditModeProps = BaseProps & {
  mode: 'edit';
  initialValues: Partial<CreateReviewRequestDTO>;
  onSubmit: (values: UpdateReviewDTO) => void | Promise<void>;
};

type Props = CreateModeProps | EditModeProps;

export default async function ReviewFormContainer(props: Props) {
  const services = await getServicesPublicList({ limit: 20 });

  const serviceOptions: ReviewTargetOptionDto[] = services.map(service => ({
    value: service.id,
    label: service.title,
  }));

  const articles = await getArticlesPublicList({ limit: 50 });
  const articleOptions: ReviewTargetOptionDto[] = articles.items.map(
    article => ({
      value: article.id,
      label: article.title,
    })
  );

  return (
    <ReviewForm
      {...props}
      serviceOptions={serviceOptions}
      articleOptions={articleOptions}
      pageOptions={REVIEW_PAGE_OPTIONS}
    />
  );
}
