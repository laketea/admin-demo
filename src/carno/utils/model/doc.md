## Model 工具类

对`dva model`的扩展，使得`model`更实用.

## extend

主要作用是继承默认的`model`配置, 
参数:

- defaults: 默认model
- properties: 属性集

如果`defaults`为空,则继承自默认的`model`

默认配置如下:

```javascript
{
    state: {
      visible: false,
      loading: false,
      spinning: false,
      confirmLoading: false
    },
    subscriptions: {},
    effects: {},
    reducers: {
      updateLoading: createNestedReducer('loading'),
      updateConfirmLoading: createNestedReducer('confirmLoading'),
      updateSpinner: createNestedReducer('spinning'),
      showLoading: createNestedValueRecuder('loading', true),
      hideLoading: createNestedValueRecuder('loading', false),
      showConfirmLoading: createNestedValueRecuder('confirmLoading', true),
      hideConfirmLoading: createNestedValueRecuder('confirmLoading', false),,
      showSpinning: createNestedValueRecuder('spinning', true),,
      hideSpinning: createNestedValueRecuder('spinning', true),,
      updateState(state, { payload }) {
        return {
          ...state,
          ...payload
        };
      },
      resetState(state) {
        return {
          ...initialState
        }
      }
    }
  }

```

使用示例:

```
import { Model } from 'carno';

export default Model.extend({
  namespace: 'user',

  subscriptions: {},

  effects: {},

  reducers: {}
});
```
部分业务场景中，`model`需要多个`spinning/loading/confirmLoading`状态进行控制，`model`中的默认状态`reducer`都支持嵌套数据更新, 下面我们以`loading`为例(spinning, confirmLoading类似)

- showLoading
  支持单状态以及嵌套状态, 
  单状态: yield put({ type: 'showLoading' })
  多状态: yield put({ type: 'showLoading', payload: { key: 'users' } })
- hideLoading
  支持单状态以及嵌套状态, 
  单状态: yield put({ type: 'hideLoading' })
  多状态: yield put({ type: 'hideLoading', payload: { key: 'users' } })
- updateLoading
  仅支持嵌套状态
  yield put({ type: 'updateLoading', payload: { user: true } })
- callWithLoading
  支持单状态以及嵌套状态, 
  单状态: yield callWithLoading(services.getUsers);
  多状态: yield callWithLoading(services.getUsers, null, { key: users});

> 注意: 在同一个业务不要混合发送单状态以及多状态的reducer

```javascript

import { Model } from 'carno';

export default Model.extend({

  state: {
    // 如果同一个页面中，有多处confirmLoading或者spinner, 可以参考如下定义state
    spinning: {
      users: false,
      logs: false
    }
  },

  effects: {
    *fetchUsers({ payload }, { put }) {
      yield put({ type: 'showSpinning', payload: { key: 'users' }});
      yield call(services.getUsers);
      yield put({ type: 'hideSpinning', payload: { key: 'users' }});

      // 也可以使用如下写法: 
      yield callWithSpinning(services.getUsers, null, { key: 'users' });
    },
    *fetchLogs({ payload }, { put }) {
      yield put({ type: 'showSpinning', payload: { key: 'logs' }});
      yield call(services.getLogs);
      yield put({ type: 'hideSpinning', payload: { key: 'logs' }});
    }
  }
})


```



如果项目中需要扩展`defaultModel`，可以自行包装一个`extend`方法,参考如下代码:

```javascript

import { Model } from 'carno';

const extend = (properties) => {
  const defaultModel = {
    ...
  };

  return Model.extend(defaultModel, properties);
}

export extend;
```


### subsciptions扩展

为方便对`path`的监听，在`model`的subscriptions配置函数参数中，额外添加了扩展方法`listen`    
`listen`函数参数如下：

- pathReg
  需要监听的pathName
- action
  action既可以是 redux action,也可以是一个回调函数
  如果action是函数，调用时，将传入{ ...location, params }作为其参数

listen函数也支持同时多多个pathname的监听，传入的参数需要为`{pathReg: action}`健值对的对象.

```javascript
import { Model } from 'carno';

export default Model.extend({

  namespance: 'user',

  pathSubscriptions: {
    setup({ dispatch, listen }) {
      
      //action为 redux action
      listen('/user/list', { type: 'fetchUsers'});

      //action为 回调函数
      listen('/user/query', ({ query, params }) => {
        dispatch({
          type: 'fetchUsers',
          payload: params
        })
      });

      //支持对多个path的监听
      listen({
        '/user/list': ({ query, params }) => {},
        '/user/query': ({ query, params }) => {},
      });
  }
})


```

### effects扩展

此外，我们对`effects`也做了一些扩充，方便处理加载状态以及指定的成功/失败消息.
扩展方法如下:

- put 扩展put方法，支持双参数模式 put(type, payload)
- update udpateState的快捷方法 update({ accounts })
- callWithLoading 调用请求时，自动处理loading状态
- callWithConfirmLoading 调用请求时，自动处理confirmLoading状态
- callWithSpinning 调用请求时，自动处理spinning状态 
- callWithMessage 调用请求后，显示指定的成功或者失败的消息
- callWithExtra 原始扩展方法，支持config(loading,confirmloading,success,error)参数

以上函数都支持第三个参数,message = { successMsg, errorMsg }

```javascript
Model.extend({
  state: {},
  effects: {
    *fetchUsers({payload}, {put,select,call,callWithLoading,callWithConfirmLoading,callWithMessage,callWithExtra}){

      //发送请求前，显示loading状态，完成后结束loading状态.如果请求成功则提示加载用户成功,失败则提示
      const users = yeild callWithLoading(service.user.getList,null,{successMsg:'加载用户成功',errorMsg:'加载用户失败'});

      //发送请求前，显示ConfirmLoading状态，完成后结束ConfirmLoading状态.如果请求成功则提示加载用户成功,失败则提示
      const users = yeild callWithConfirmLoading(service.user.getList,null,{successMsg:'加载用户成功',errorMsg:'加载用户失败'});

      //发送请求前，显示spinning状态，完成后结束spinning状态.如果请求成功则提示加载用户成功,失败则提示
      const users = yeild callWithSpinning(service.user.getList,null,{successMsg:'加载用户成功',errorMsg:'加载用户失败'});

      //仅处理成功/失败的消息提示
      const users = yeild callWithMessage(service.user.getList,null,{successMsg:'加载用户成功',errorMsg:'加载用户失败'});

      //支持config参数的call方法，目前仅支持: loading,confirmloading,success,error
      const users = yield callWithExtra(service.user.getList,null,{
        loading: ture,
        confirmLoading: true,
        successMsg:'加载用户成功',
        errorMsg:'加载用户失败'
      });

      //更新当前model的state
      yield update({ users })
      // update 方法等同于以下方法
      yield put({
        type: 'updateState',
        payload: {
          users
        }
      })

      //扩展put方法
      yield put('updateItem', { item });
      // 等同于以下方法
      yield put({
        type: 'updateItem',
        payload: {
          item
        }
      })

    }
  }
})

```
