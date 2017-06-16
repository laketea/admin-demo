import { Table, Button, Popconfirm } from 'antd';
import { Utils } from 'carno';

import BlacklistModal from './BlacklistModal';
import SearchMore from './SearchMore';

const { getColumns } = Utils.Table;

class Blacklist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      operateType: '', // add|update
      visible: false,
      blacklist: {},
    };
  }

  getInitalColumns(fields) {
    const extraFields = [{
      key: 'operator',
      name: '操作',
      render: (value, record) => {
        return (
          <div>
            <a onClick={() => this.handleModal('update', record)}>修改</a>
            <span className="ant-divider"></span>
            <Popconfirm
              placement="top"
              title="是否删除此黑名单？"
              onConfirm={() => this.handleDelete(record.id)}
              okText="是"
              cancelText="否"
            >
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      }
    }];

    return getColumns(fields).enhance(extraFields).values();
  }

  // 显示添加或修改的弹出框
  handleModal(type, blacklist = {}) {
    this.setState({
      operateType: type,
      visible: Symbol(),
      blacklist
    });
  }

  // 保存
  handleSave(data) {
    this.props.onSave(data);
  }

  // 删除
  handleDelete(uuid) {
    this.props.onDelete(uuid);
  }

  render() {
    const { fields, blacklists, total, search, loading, confirmLoading, onSearch } = this.props;
    const { pn, ps } = search;
    const { operateType, visible, blacklist } = this.state;
    const columns = this.getInitalColumns(fields);

    const pagination = {
      current: pn,
      total,
      pageSize: ps,
      onChange: page => onSearch({ pn: page })
    };

    const tableProps = {
      dataSource: blacklists,
      columns,
      loading,
      rowKey: 'id',
      pagination
    };

    const modalProps = {
      operateType,
      confirmLoading,
      blacklist,
      visible,
      fields,
      onOk: this.handleSave.bind(this),
    };

    const searchBarProps = {
      onAdd: () => { this.handleModal('add'); },
      onSearch,
      fields
    };

    return (
      <div>
        <SearchMore {...searchBarProps} />
        <Table {...tableProps} />
        <BlacklistModal {...modalProps} />
      </div>
    );
  }
}

export default Blacklist;
