const TYPES = {
  'QQ': 'QQ',
  'PHONE': '手机',
  'TELE': '电话',
  'USER': '用户',
};
const fields = [
  {
    key: 'type',
    name: '类型',
    enums: TYPES
  }, {
    key: 'userId',
    name: '用户ID',
  }, {
    key: 'content',
    name: '内容'
  }, {
    key: 'reason',
    name: '说明',
    type: 'textarea'
  }, {
    key: 'createDate',
    name: '创建时间',
    type: 'datetime'
  }
];

export default fields;
