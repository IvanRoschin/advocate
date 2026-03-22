import { ReviewForm } from '@/app/components';
import { articleService } from '@/app/lib/services/article.service';
import { serviceService } from '@/app/lib/services/service.service';
import {
  CreateReviewRequestDTO,
  REVIEW_PAGE_OPTIONS,
  ReviewTargetOptionDto,
  UpdateReviewDTO,
} from '@/app/types';

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
  const services = await serviceService.getPublicList({ limit: 100 });

  const serviceOptions: ReviewTargetOptionDto[] = services.map(service => ({
    value: service.id,
    label: service.title,
  }));

  const articles = await articleService.getPublicList({ limit: 100 });
  const articleOptions: ReviewTargetOptionDto[] = articles.map(article => ({
    value: article.id,
    label: article.title,
  }));

  return (
    <ReviewForm
      {...props}
      serviceOptions={serviceOptions}
      articleOptions={articleOptions}
      pageOptions={REVIEW_PAGE_OPTIONS}
    />
  );
}
