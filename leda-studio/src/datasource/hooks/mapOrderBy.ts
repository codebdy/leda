
export const mapOrderBy = (orderBy?: "ascend" | "descend"): 'asc' | 'desc' | undefined => {
  if (orderBy === "ascend") {
    return "asc";
  } else if (orderBy === "descend") {
    return "desc";
  }
  return orderBy;
};
