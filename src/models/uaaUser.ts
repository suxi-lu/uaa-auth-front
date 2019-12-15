import { Effect } from "dva";
import { Reducer } from "redux";

import { queryCurrent, query as queryUsers } from "@/services/user";

export interface UaaUser {
  id?: string;
  userName?: string;
  loginName?: string;
  password?: string;
  mobile?: string;
  email?: string;
  isAdmin?: string;
  lastLoginDate?: Date;
  loginCount?: number;
  description?: string;
}

export interface UaaUserModelState {
  currentUser?: Partial<UaaUser>;
}

export interface UaaUserModelType {
  namespace: "uaaUser";
  state: UaaUserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UaaUserModelState>;
  };
}

const UaaUserModel: UaaUserModelType = {
  namespace: "uaaUser",

  state: {
    currentUser: {}
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: "save",
        payload: response
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: "saveCurrentUser",
        payload: response
      });
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {}
      };
    }
  }
};

export default UaaUserModel;
