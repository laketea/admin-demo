## HTTP 请求类

由于不同的后端服务交互的数据格式不一致，故提供通用的http类，以屏蔽底层细节，方便复用，并且实现了中间件的机制以方便扩展。

### 如何创建http实例
`Http`是实现的一个通用请求`class`, 实际使用的时候，需要创建一个实例化的对象, 可通过以下两种方式创建新的实例

- Http.create(config,middlewares)
- new Http(config,middlewares)

通过`Http`类静态方法`create`创建的实例，默认会添加`defaults.middlewares`中的中间件.
也可以直接实例化`Http`对象,这种方式创建的实例，不会继续默认的`middlewares`.

```javascript
/*
  * http默认配置
  */
const defaults = {
  middlewares: [
    middlewares.status(),
    middlewares.json(),
    middlewares.dataStatus(),
    middlewares.onerror(),
    middlewares.authFailed()
  ],
  config: {}
};
```

`http`实例提供了get,post,del,put等方法,默认支持`json`&`formdata`数据格式
通过`http`实例上的`create`方法, 可以创建新的实例，且新的实例会自动继承父`http`的`config`以及`middlewares`
    
```javascript
//http.js
import { Http } from 'carno';
const {} = Http';

//建议在应用系统先创建一个基础的http类，其他的http在通过create方法来扩展
//create方法支持4种参数场景：
//create('domain')
//create(config)
//create(middlewares)
//create(config,mddlewares)

const { domain, queryToken, dataTransform } = Http.middlewares;

const middlewares = [
  domain(getServer()),
  queryToken(() => {
    return {
      sid: cookie.get('sid'),
      st: cookie.get('st')
    };
  }),
  dataTransform((data, options) => {
    if (options.dataType == 'form') {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      data = formData;
    } else {
      options.headers = Object.assign(options.headers || {}, {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      });
      data = qs.stringify(data);
    }
    return {
      data,
      options
    };
  })
];

export default Http.create(middlewares);

const http = Http.create()

// server.js
import http from 'utils/http';
const {get, post} = http.create('ag');
```

### 中间件
中间件主要在发送请求以及响应之后，做一些数据以及参数处理，http中提供了一些常用的中间件，部分中间件支参数配置, 使用时，可以根据自己的业务特点灵活配置.

如果需要添加自定义中间件，则参考如下代码:

    const middle = {
        //请求前
        request: (_request_) => {
            //do something
            return _request;
        },
        //请求错误
        requestError: (_request) => {
            //do something
            return _request;
        },
        //数据响应后
        response: (_reponse, _request) => {
            //do something
            return _reponse;
        },
        //数据响应失败后
        responseError: (_reponse, _request) => {
            //do something
            return _reponse;
        }
    }

下面再详细说明下内置的一些常用的中间件:

#### domain 
服务域中间件, 自动将url加上host路径, 使用时需传入hosts

    const domainMiddles = middlewares.domain({
        api: '//api.56qq.cn',
        ag: '//ag.56qq.cn'
    });

### dataTransform
响应数据转换中间件, 使用时需传入转换函数

    // dataType， 在发送请求的时候传入
    // data: 参数数据
    // options: 请求配置项
    const dataTransform = middlewares.dataTransform((data, options) => {
        if (options.dataType == 'form') {
          const formData = new FormData();
          Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
          });
          data = formData;
        } else {
          options.headers = Object.assign(options.headers || {}, {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          });
          data = qs.stringify(data);
        }
        return {
          data,
          options
        };
      })

    // 请求时配置dataType为form
    export function upload(data) {
      return post('/server/op/roster/upload', data, {
        dataType: 'form'
      });
    }

### queryToken
token中间件，参数附加在url中, 使用时，需传入token对象

    const queryTokenMiddle = middlewares.queryToken(() => {
       return {
          sid: cookie.get('sid'),
          st: cookie.get('st')
        } 
    });


### headerToken
token中间件，参数存放在header中,使用方式与queryToken类似

    const headerTokenMiddle = middlewares.headeroken(() => {
       return {
          authorization: cookie.get('sid'),
        } 
    });

### onerror
错误处理中间件, 拦截res&req错误，并弹出modal框显示错误详情，如单个请求需屏蔽错误弹出框，则在请求的config中设置参数`ignoreErrorModal`为`true`

### status
响应状态处理中间件

### json
响应数据json处理

### content
响应数据content处理中间件, 后端数据一般会将真实数据设置一个统一key值(例如：content，data等)，使用中间件的时候，可以传入contentKey

    const headerTokenMiddle = middlewares.content('data');

### authFailed
授权失败中间件， 授权失败后，默认会跳转到登陆页面， 支持配置授权失败的code以及登陆hash

    const authFailedMiddle = middlewares.authFailed({
        codes: ['120001', '120002'],
        hash: '/login'
    });



