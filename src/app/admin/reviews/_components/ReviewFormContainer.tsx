import { articleActions } from '@/app/actions/article.actions';
import { serviceActions } from '@/app/actions/service.actions';
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
  const services = await serviceActions.getAll({ limit: 20 });

  const serviceOptions: ReviewTargetOptionDto[] = services.items.map(
    service => ({
      value: service._id,
      label: service.title,
    })
  );

  const articles = await articleActions.getAll({ limit: 20 });
  const articleOptions: ReviewTargetOptionDto[] = articles.items.map(
    article => ({
      value: article._id,
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
