import qs from 'qs';
import { Modal } from 'antd';
import { Promise } from 'es6-promise';

const getParamValue = (paramOrFn) => {
  return typeof paramOrFn == 'function' ? paramOrFn() : paramOrFn;
};

const transform = (defaults) => {
  return {
    request(_request) {
      const requestTransforms = _request.config.requestTransform || defaults.requestTransform || [];
      if (requestTransforms.length) {
        _request.options.pass = true;
        requestTransforms.forEach(requestTransform => {
          _request = requestTransform(_request);
        });
      }
      return _request;
    },
    response(_reponse, _request) {
      const responseTransforms = _reponse.config.responseTransform || defaults.responseTransform || [];
      responseTransforms.forEach(responseTransform => {
        _reponse = responseTransform(_reponse);
      });
      _request.options.pass = true;
      return _reponse;
    }
  };
};

// 参数数据转化中间件
const dataTransform = (_transform) => {
  return {
    request(_request) {
      let transRequest;
      if (_transform) {
        transRequest = _transform(_request.data, _request.options, _request);
      }
      return Object.assign(_request, transRequest);
    }
  };
};

// domain中间件
const domain = (_hosts) => {
  return {
    request(_request) {
      const hosts = getParamValue(_hosts);
      const { url, options } = _request;
      const host = hosts[options.domain];
      _request.url = `${host}${url}`;
      return _request;
    }
  };
};

// 查询token中间件
const queryToken = (_tokens) => {
  return {
    request(_request) {
      const tokens = getParamValue(_tokens);
      const url = _request.url;
      const tokenStr = qs.stringify(tokens);
      const connector = url.includes('?') ? '&' : '?';
      _request.url = `${url}${connector}${tokenStr}`;
      return _request;
    }
  };
};

// header中间件
const headerToken = (_tokens) => {
  return {
    request(_request) {
      const tokens = getParamValue(_tokens);
      _request.options.headers = Object.assign({}, _request.options.headers, tokens);
      return _request;
    }
  };
};

// 授权失败中间件
const authFailed = (_options) => {
  const defaultOptions = {
    codes: ['120001', '120002', '120008'],
    hash: '/login'
  };
  return {
    responseError(_responseError) {
      const options = getParamValue(_options) || defaultOptions;
      if (options.codes.includes(_responseError.errorCode)) {
        window.location.hash = options.hash;
      }
      return Promise.reject(_responseError);
    }
  };
};



const dataStatus = (validateStateError) => {
  const defaultErrorValidate = (_response) => {
    return _response.status && _response.status.toUpperCase() == 'ERROR';
  };
  return {
    response(_response) {
      if ((validateStateError || defaultErrorValidate)(_response)) {
        return Promise.reject(_response);
      }
      return _response;
    }
  };
};

// 错误处理中间件
const onerror = () => {
  const DEFAULT_RES_ERROR = '请求错误';
  const DEFAULT_REQ_ERROR = '请求异常';
  let hasErrorModal = false;
  return {
    responseError(_responseError, _request) {
      if (!_request.options.ignoreErrorModal && !hasErrorModal) {
        const title = _responseError.message || _responseError.errorMsg || DEFAULT_RES_ERROR;
        Modal.error({
          title,
          onOk: () => {
            hasErrorModal = false;
          },
          onCancel: () => {}
        });
        hasErrorModal = true;
      }
      return Promise.reject(_responseError);
    },
    requestError(_requestError) {
      if (!hasErrorModal) {
        Modal.error({
          title: DEFAULT_REQ_ERROR,
          onOk: () => {
            hasErrorModal = false;
          }
        });
        hasErrorModal = true;
      }
      return Promise.reject(_requestError);
    }
  };
};

// response状态码中间件
const status = () => {
  return {
    response(_response) {
      if (_response.status >= 200 && _response.status < 300) {
        return _response;
      }
      return Promise.reject(_response);
    }
  };
};

// response json中间件
const json = () => {
  return {
    response(_response) {
      return _response.json();
    }
  };
};

// content中间件
const content = (contentKey) => {
  const DEFAULT_CONTENT_KEY = 'content';
  return {
    response(_response) {
      return _response[contentKey || DEFAULT_CONTENT_KEY];
    }
  };
};

export default {
  domain,
  transform,
  dataTransform,
  queryToken,
  headerToken,
  onerror,
  status,
  dataStatus,
  json,
  content,
  authFailed
};
