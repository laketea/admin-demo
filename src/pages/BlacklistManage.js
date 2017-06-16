import { connect } from 'dva';
import BlacklistManage from 'components/BlacklistManage';

function mapStateToProps({ blacklist }) {
  return {
    ...blacklist,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSave(data) {
      dispatch({ type: 'blacklist/saveBlacklist', payload: { data } });
    },
    onDelete(id) {
      dispatch({ type: 'blacklist/deleteBlacklist', payload: { id } });
    },
    onSearch(search) {
      dispatch({ type: 'blacklist/updateSearch', payload: { search } });
      dispatch({ type: 'blacklist/fetchBlacklists' });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlacklistManage);
