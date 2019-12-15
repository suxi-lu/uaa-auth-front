import { Request, Response } from "express";
import { parse } from "url";
import { TableUaaUserItem, TableListParams } from "./data.d";

// mock tableListDataSource
let tableListDataSource: TableUaaUserItem[] = [];

for (let i = 0; i < 10; i += 1) {
  tableListDataSource.push({
    key: i,
    id: `${i}`,
    userName: "曲丽丽",
    loginName: `TradeCode ${i}`,
    password: "",
    mobile: `TradeCode ${i}`,
    email: "email",
    isAdmin: i % 2 === 0 ? "0" : "1",
    lastLoginDate: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    loginCount: 1,
    description: ""
  });
}

function getUser(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== "[object String]") {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as TableListParams;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split("_");
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === "descend") {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.loginName) {
    dataSource = dataSource.filter(data =>
      data.loginName.includes(params.loginName || "")
    );
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    data: dataSource,
    total: dataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.currentPage}`, 10) || 1
  };

  return res.json(result);
}

function postUser(req: Request, res: Response, u: string, b: Request) {
  console.log("params");
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== "[object String]") {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case "delete":
      tableListDataSource = tableListDataSource.filter(
        item => key.indexOf(item.key) === -1
      );
      break;
    case "post":
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        id: `${i}`,
        userName: "曲丽丽",
        loginName: `TradeCode ${i}`,
        password: "",
        mobile: `TradeCode ${i}`,
        email: "email",
        isAdmin: i % 2 === 0 ? "0" : "1",
        lastLoginDate: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
        loginCount: 1,
        description: ""
      });
      break;
    case "update":
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          return { ...item, desc, name };
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length
    }
  };

  return res.json(result);
}

export default {
  "GET /api/user": getUser,
  "POST /api/user": postUser
};
