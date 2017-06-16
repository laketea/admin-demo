const male = {
  male: '男',
  female: '女'
};

const fields = [{
  key: 'name',
  name: '用户名',
  required: true
}, {
  key: 'gender',
  name: '性别',
  enums: male,
  required: true
}, {
  key: 'age',
  name: '年龄',
  type: 'number',
  required: true
}, {
  key: 'career',
  name: '职业',
  required: true
}, {
  key: 'nation',
  name: '民族',
  required: true
}, {
  key: 'createTime',
  name: '创建时间',
  type: 'datetime',
  required: true
}];

export default fields;
