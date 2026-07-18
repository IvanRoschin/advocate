import { Case, Client, ClientAccess } from '@/app/models';

/**
 * Каскадно видаляє клієнта разом з його справами (Case) та доступами
 * (ClientAccess). Повертає id видаленого клієнта або null, якщо клієнта
 * не знайдено.
 */
export async function deleteClientCascade(id: string) {
  const client = await Client.findById(id);
  if (!client) return null;

  await Case.deleteMany({ clientId: id });
  await ClientAccess.deleteMany({ clientId: id });
  await Client.findByIdAndDelete(id);

  return client._id.toString();
}
