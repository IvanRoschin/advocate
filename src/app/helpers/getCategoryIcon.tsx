import { iconLibrary, IconName } from '../resources';

export const getCategoryIcon = (key?: IconName) => {
  if (!key) return iconLibrary.civil;

  return iconLibrary[key] ?? iconLibrary.civil;
};
