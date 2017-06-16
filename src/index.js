import dva from 'dva';
import './index.html';
import 'antd/dist/antd.css';
import './styles/common.less';

// 1. Initialize
const app = dva({
  onError(e) {
    console.log(e);
  }
});

// 3. Model
app.model(require('./models/userManage'));
app.model(require('./models/blacklistManage'));


// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
