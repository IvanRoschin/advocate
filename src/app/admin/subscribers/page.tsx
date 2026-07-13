import { subscriberPublicActions } from '@/app/actions/subscriber.actions';
import SubscribersClient from './SubscribersClient';

const SubscribersPage = async () => {
  const result = await subscriberPublicActions.list({ limit: 50 }); // можно увеличить лимит

  return <SubscribersClient initialSubscribers={result.items} />;
};

export default SubscribersPage;
