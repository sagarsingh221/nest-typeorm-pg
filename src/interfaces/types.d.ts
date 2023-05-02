export interface StatusResponse {
  status: boolean;
}

export interface ISearchFilter {
  query: string;
  fields: string[];
}

export interface OrderBy {
  field: string,
  type: "DESC" | "ASC" = 'DESC'
}
