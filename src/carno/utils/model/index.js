import pathToRegexp from 'path-to-regexp';
import { message as Message, Modal } from 'antd';

const PATH_SUBSCRIBER_KEY = '_pathSubscriberKey';

const createNestedValueRecuder = (parentKey, value) => (state, { payload: { key } }) => {
  let parentState = state[parentKey];

  if (key) {
    parentState = typeof parentState == 'boolean' ? {} : parentState;
    parentState = { ...parentState, [key]: value };
  } else {
    // 兼容旧版本，如果type不存在，则直接对parent赋值
    parentState = value;
  }

  return {
    ...state,
    [parentKey]: parentState
  };
};

const createNestedRecuder = (parentKey) => (state, { payload }) => {
  let parentState = state[parentKey];
  parentState = typeof parentState == 'boolean' ? {} : parentState;

  return {
    ...state,
    [parentKey]: {
      ...parentState,
      payload
    }
  }
}

const getDefaultModel = () => {
  return {
    // 为了兼容旧版本，初始值依旧为false.如果应用中需要多个控制状态，则在model中覆盖初始属性
    state: {
      visible: false,
      spinning: false,
      loading: false,
      confirmLoading: false
    },
    subscriptions: {},
    effects: {},
    reducers: {
      showLoading: createNestedValueRecuder('loading', true),
      hideLoading: createNestedValueRecuder('loading', false),
      showConfirmLoading: createNestedValueRecuder('confirmLoading', true),
      hideConfirmLoading: createNestedValueRecuder('confirmLoading', false),
      showSpinning: createNestedValueRecuder('spinning', true),
      hideSpinning: createNestedValueRecuder('spinning', false),
      updateLoading: createNestedRecuder('loading'),
      updateSpinner: createNestedRecuder('spinning'),
      updateConfirmLoading: createNestedRecuder('confirmLoading'),
      updateState(state, { payload }) {
        return {
          ...state,
          ...payload
        };
      }
    }
  };
};

/**
 * 扩展subscription函数的参数,支持listen方法，方便监听path改变
 *
 * listen函数参数如下:
 * pathReg 需要监听的pathname
 * action 匹配path后的回调函数，action即可以是redux的action,也可以是回调函数
 * listen函数同时也支持对多个path的监听，参数为{ pathReg: action, ...} 格式的对象
 *
 * 示例:
 * subscription({ dispath, history, listen }) {
 *  listen('/user/list', { type: 'fetchUsers'});
 *  listen('/user/query', ({ query, params }) => {
 *    dispatch({
 *      type: 'fetchUsers',
 *      payload: params
 *    })
 *  });
 *  listen({
 *    '/user/list': ({ query, params }) => {},
 *    '/user/query': ({ query, params }) => {},
 *  });
 * }
 */
const enhanceSubscriptions = (subscriptions = {}) => {
  return Object
    .keys(subscriptions)
    .reduce((wrappedSubscriptions, key) => {
      wrappedSubscriptions[key] = createWrappedSubscriber(subscriptions[key]);
      return wrappedSubscriptions;
    }, {});

  function createWrappedSubscriber(subscriber) {
    return (props) => {
      const { dispatch, history } = props;

      const listen = (pathReg, action) => {
        let listeners = {};
        if (typeof pathReg == 'object') {
          listeners = pathReg;
        } else {
          listeners[pathReg] = action;
        }

        history.listen((location) => {
          const { pathname } = location;
          Object.keys(listeners).forEach(key => {
            const _pathReg = key;
            const _action = listeners[key];
            const match = pathToRegexp(_pathReg).exec(pathname);

            if (match) {
              if (typeof _action == 'object') {
                dispatch(_action);
              } else if (typeof _action == 'function') {
                _action({ ...location, params: match.slice(1) });
              }
            }
          });
        });
      };

      subscriber({ ...props, listen });
    };
  }
};

/**
 * 扩展effect函数中的sagaEffects参数
 * 支持:
 *  put 扩展put方法，支持双参数模式: put(type, payload)
 *  update 扩展自put方法，方便直接更新state数据，update({ item: item});
 *  callWithLoading,
 *  callWithConfirmLoading,
 *  callWithSpinning,
 *  callWithMessage,
 *  callWithExtra
 *  以上函数都支持第三个参数,message = { successMsg, errorMsg }
 */
const enhanceEffects = (effects = {}) => {
  const wrappedEffects = {};
  Object
    .keys(effects)
    .forEach(key => {
      wrappedEffects[key] = function* (action, sagaEffects) {
        const extraSagaEffects = {
          ...sagaEffects,
          put: createPutEffect(sagaEffects),
          update: createUpdateEffect(sagaEffects),
          callWithLoading: createExtraCall(sagaEffects, { loading: true }),
          callWithConfirmLoading: createExtraCall(sagaEffects, { confirmLoading: true }),
          callWithSpinning: createExtraCall(sagaEffects, { spinning: true }),
          callWithMessage: createExtraCall(sagaEffects),
          callWithExtra: (serviceFn, args, config) => { createExtraCall(sagaEffects, config)(serviceFn, args, config); }
        };

        yield effects[key](action, extraSagaEffects);
      };
    });

  return wrappedEffects;

  function createPutEffect(sagaEffects) {
    const { put } = sagaEffects;
    return function* putEffect(type, payload) {
      let action = { type, payload };
      if (arguments.length == 1 && typeof type == 'object') {
        action = arguments[0];
      }
      yield put(action);
    };
  }

  function createUpdateEffect(sagaEffects) {
    const { put } = sagaEffects;
    return function* updateEffect(payload) {
      yield put({ type: 'updateState', payload });
    };
  }

  function createExtraCall(sagaEffects, config = {}) {
    const { put, call } = sagaEffects;
    return function* extraCallEffect(serviceFn, args, message = {}) {
      let result;
      const { loading, confirmLoading, spinning } = config;
      const { successMsg, errorMsg, key } = message;

      if (loading) {
        yield put({ type: 'showLoading', payload: { key } });
      }
      if (confirmLoading) {
        yield put({ type: 'showConfirmLoading', payload: { key } });
      }
      if (spinning) {
        yield put({ type: 'showSpinning', payload: { key } });
      }

      try {
        result = yield call(serviceFn, args);
        successMsg && Message.success(successMsg);
      } catch (e) {
        errorMsg && Modal.error({ title: errorMsg });
        throw e;
      } finally {
        if (loading) {
          yield put({ type: 'hideLoading', payload: { key } });
        }
        if (confirmLoading) {
          yield put({ type: 'hideConfirmLoading', payload: { key } });
        }
        if (spinning) {
          yield put({ type: 'hideSpinning', payload: { key } });
        }
      }

      return result;
    };
  }
};

/**
 * 模型继承方法
 *
 * 如果参数只有一个，则继承默认model
 * @param defaults
 * @param properties
 */
function extend(defaults, properties) {
  if (!properties) {
    properties = defaults;
    defaults = null;
  }

  const model = defaults || getDefaultModel();
  const modelAssignKeys = ['state', 'subscriptions', 'effects', 'reducers'];
  const { namespace } = properties;

  modelAssignKeys.forEach((key) => {
    if (key == 'subscriptions') {
      properties[key] = enhanceSubscriptions(properties[key]);
    }
    if (key == 'effects') {
      properties[key] = enhanceEffects(properties[key]);
    }
    Object.assign(model[key], properties[key]);
  });

  const initialState = {
    ...model.state
  };

  Object.assign(model.reducers, {
    resetState() {
      return {
        ...initialState
      };
    }
  });

  return Object.assign(model, { namespace });
}

export default {
  extend
};
