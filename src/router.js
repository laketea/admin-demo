import { Router, Route, IndexRedirect } from 'dva/router';

import pages from './pages';
import Layout from './components/Layout';

export default function ({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={Layout} breadcrumbName="" >
        <IndexRedirect to="/user/manage" />
        <Route path="user/manage" component={pages.UserManage} breadcrumbName="用户管理" />
        <Route path="blacklist/manage" component={pages.BlacklistManage} breadcrumbName="黑名单管理" />
      </Route>
    </Router>
  );
}
