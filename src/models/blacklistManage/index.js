import { Model } from 'carno';
import * as services from 'services';
import fields from './fields';

const initialSearch = {
  pn: 1,
  ps: 10
};

export default Model.extend({
  namespace: 'blacklist',

  state: {
    fields,
    total: 0,
    search: initialSearch,
    blacklists: []
  },

  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen('/blacklist/manage', () => {
        dispatch({ type: 'resetState' });
        dispatch({ type: 'fetchBlacklists' });
      });
    }
  },

  effects: {
    *fetchBlacklists({ payload }, { select, update, callWithLoading }) {
      let { search } = yield select(({ blacklist }) => blacklist);
      search = { ...search, ...payload };
      const { content: blacklists, tc: total } = yield callWithLoading(services.getBlacklists, search);
      yield update({ blacklists, total, search });
    },
    *saveBlacklist({ payload: { data } }, { put, callWithConfirmLoading }) {
      /* 换行分割‘内容’  将‘内容’分别存储 */
      const contents = data.content.split(/\n/);
      for (let i = 0; i < contents.length; i++) {
        const content = contents[i];
        yield callWithConfirmLoading(services.saveBlacklist, { ...data, content });
      }
      yield put({ type: 'fetchBlacklists' });
    },
    *deleteBlacklist({ payload: { id } }, { put, callWithLoading }) {
      yield callWithLoading(services.blacklist.deleteBlacklist, id);
      yield put({ type: 'fetchBlacklists' });
    }
  },

  reducers: {
    updateSearch(state, { payload: { search } }) {
      return {
        ...state,
        search: { ...state.search, pn: 1, ...search }
      };
    }
  }
});
