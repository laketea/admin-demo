const mock = require('mockjs');
const utils = require('./utils');

const mockData = mock.mock({
    'users|1-10': [{
        'id|+1': 1,
        'age|+1': 15,
        'name|+1': 'john',
        'career': '软件工程师',
        'gender': 'male',
        'createTime': 1482705955000
    }],
    'user': {
      'username': 'curie',
      'id': '123',
      'token': 'pass'
    },
    'blacklists|1-10': [{
        "id|+1": 4980,
        "type": 'PHONE',
        "userId": 0,
        "content": "rt345",
        "createDate": 1496375531000,
        "reason": "测试方要求禁用"
    }]
});

if (!global.users) {
    Object.assign(global, mockData);
}


module.exports = {
    'GET /web/user/list': utils.createResponse('users'),
    'POST /web/user/save': utils.createSaveResponse('users'),
    'POST /web/login': utils.createResponse('user'),
    "GET /web/blacklist/list": utils.createPageResponse("blacklists"),
    "POST /web/blacklist/save": utils.createSaveResponse("blacklists"),
};

