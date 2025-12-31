export const createPageUrl = (page: string) =>
  page === "Home" ? "/" : `/${page}`;
