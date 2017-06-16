import http from 'utils/http';

const { get, post } = http.create('demo');

export function getUsers() {
  return get('/web/user/list');
}

export function saveUser(user) {
  return post('/web/user/save', user);
}

export function getBlacklists(params) {
  return get('/web/blacklist/list', params);
}

export function saveBlacklist(blacklist) {
  return post('/web/blacklist/save', blacklist);
}
