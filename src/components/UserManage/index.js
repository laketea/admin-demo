import { Table, Button, Popconfirm } from 'antd';
import { Utils } from 'carno';

import UserModal from './UserModal';

const { getColumns } = Utils.Table;

class UserManage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  getInitalColumns(fields) {
    const extraFields = [{
      key: 'operator',
      name: '操作',
      render: (value, record) => {
        return (
          <div>
            <Popconfirm
              placement="top"
              title="是否删除此用户？"
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
  handleModal() {
    this.setState({
      visible: Symbol()
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
    const { fields, users, loading, confirmLoading } = this.props;
    const { visible } = this.state;
    const columns = this.getInitalColumns(fields);

    const tableProps = {
      dataSource: users,
      columns,
      loading,
      rowKey: 'id',
      pagination: false,
    };

    const modalProps = {
      fields,
      visible,
      confirmLoading,
      onOk: this.handleSave.bind(this),
    };

    return (
      <div>
        <div className="actions">
          <Button type="primary" onClick={this.handleModal.bind(this)}>创建用户</Button>
        </div>
        <Table {...tableProps} />
        <UserModal {...modalProps} />
      </div>
    );
  }
}

export default UserManage;
