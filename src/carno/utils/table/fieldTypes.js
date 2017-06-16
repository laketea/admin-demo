import moment from 'moment';

/*
 * column类型定义
 */
const fieldTypes = {
  normal: (value) => value,
  number: (value) => value,
  textarea: (value) => value,
  datetime: (value) => {
    return value ? moment(new Date(parseInt(value, 10))).format('YYYY-MM-DD HH:mm:ss') : '';
  },
  date: (value) => {
    return value ? moment(new Date(value)).format('YYYY-MM-DD') : '';
  },
  enum: (value, field) => {
    return field.enums[value];
  },
  boolean: (value) => {
    return (value == 'true' || value === true) ? '是' : '否';
  }
};

/*
 * 扩展column类型定义
 */
export const combineTypes = (types) => {
  Object.assign(fieldTypes, types);
};

export default fieldTypes;

