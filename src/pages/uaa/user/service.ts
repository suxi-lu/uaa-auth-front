import request from "@/utils/request";
// import {TableListParams, TableUaaUserItem} from "@/pages/uaa/user/data";

export async function queryUser(params?: any) {
  return request("/api/user", {
    params
  });
}

export async function removeUser(params: { key: string[] }) {
  return request("/api/user", {
    method: "POST",
    data: {
      ...params,
      method: "delete"
    }
  });
}

export async function addUser(params: any) {
  return request("/api/user", {
    method: "POST",
    data: {
      ...params,
      method: "post"
    }
  });
}

export async function updateUser(params: any) {
  return request("/api/user", {
    method: "POST",
    data: {
      ...params,
      method: "update"
    }
  });
}
