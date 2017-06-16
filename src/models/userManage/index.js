import { Model } from 'carno';
import * as services from 'services';
import fields from './fields';

export default Model.extend({
  namespace: 'userManage',

  state: {
    fields,
    users: [],
  },

  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen('/user/manage', () => {
        dispatch({ type: 'resetState' });
        dispatch({ type: 'fetchUsers' });
      });
    }
  },

  effects: {
    * fetchUsers({ payload }, { put, callWithLoading, update }) {
      const users = yield callWithLoading(services.getUsers);
      yield update({ users });
    },
    * saveUser({ payload }, { put, update, callWithConfirmLoading }) {
      yield callWithConfirmLoading(services.saveUser, payload, { successMsg: '保存用户成功!' });
      yield put({ type: 'fetchUserList' });
    }
  },

  reducers: {}
});
