import { Button } from 'antd';
import { SearchBar } from 'carno';

function Base() {
  const btns = (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      <Button type="primary" style={{ marginLeft: '10px' }}>新增用户</Button>
    </div>
  );

  const fields = [{
    key: 'serviceName',
    name: '服务名称',
  }, {
    key: 'serviceVersion',
    name: '版本',
  }, {
    key: 'serviceImage',
    name: '镜像',
  }, {
    key: 'appName',
    name: '应用名称',
  }, {
    key: 'departmentName',
    name: '业务线',
  }, {
    key: 'deployType',
    name: '环境',
  }, {
    key: 'createdTime',
    name: '开始时间',
    type: 'datetime',
  }, {
    key: 'createdTime',
    name: '结束时间',
    type: 'datetime',
  }];

  const onSearch = (values) => {
    console.log(values);
  };

  const searchBarProps = {
    showLabel: true,
    showReset: true,
    btns,
    fields,
    onSearch,
  };

  return (
    <SearchBar {...searchBarProps} />
  );
}

export default Base;
