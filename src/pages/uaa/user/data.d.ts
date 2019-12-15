import { UaaUser } from "@/models/uaaUser";

export interface TableUaaUserItem extends UaaUser {
  key: number;

  id: string;
  userName: string;
  loginName: string;
  password: string;
  mobile: string;
  email: string;
  isAdmin: string;
  lastLoginDate: Date;
  loginCount: number;
  description: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableUaaUserItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  userName?: string;
  loginName?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
}
