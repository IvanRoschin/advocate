export const getPagination = (page?: number, limit?: number) => {
  const safePage = Math.max(1, page ?? 1);
  const safeLimit = Math.max(1, limit ?? 10);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};
