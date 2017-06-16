import { connect } from 'dva';

import UserManage from 'components/UserManage';

function mapStateToProps({ userManage }) {
  return {
    ...userManage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSave(data) {
      dispatch({ type: 'userManage/saveUser', payload: data });
    },
    onDelete(id) {
      dispatch({ type: 'userManage/deleteUser', payload: id });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
