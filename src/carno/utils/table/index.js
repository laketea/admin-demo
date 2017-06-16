import { default as fieldTypes, combineTypes } from './fieldTypes';

/*
 * 获取column中显示的filedValue
 */
function getFieldValue(value, field = {}) {
  let type = field.type || (field.enums && 'enum');
  type = fieldTypes.hasOwnProperty(type) ? type : 'normal';
  return fieldTypes[type](value, field);
}

/*
 * 获取表格column数组
 * 示例:
 * const columns = getColumns(fields,['name','author'],{ name: { render: ()=>{} }}).values();
 * const columns = getColumns(fields).excludes(['id','desc']).values();
 * const columns = getColumns(fields).pick(['name','author','openTime']).enhance({name:{ render: ()=>{} }}).values();
 * @param originField 原始fields
 * @param fieldKeys 需要包含的字段keys
 * @param extraFields 扩展的fields
 * @result 链式写法，返回链式对象(包含pick,excludes,enhance,values方法), 需要调用values返回最终的数据
 */
function getColumns(fields, fieldKeys, extraFields) {

  const chain = {};
  let columns = [];

  const transform = (_fields) => {
    return _fields.map(field => {
      let { dataIndex, title, key, name, render, ...others } = field;

      if (!render) {
        render = (value) => {
          return getFieldValue(value, field);
        };
      }

      return {
        dataIndex: key || dataIndex,
        title: name || title,
        render,
        ...others
      };
    });
  };

  const pick = (_fieldKeys) => {
    _fieldKeys = [].concat(_fieldKeys);
    columns = _fieldKeys.map(fieldKey => {
      let column = columns.find(item => fieldKey == (item.key || item.dataIndex));
      if (!column) {
        // 如果fieldKey不存在，则创建text类型的column
        column = {
          dataIndex: fieldKey,
          title: fieldKey,
          render: (value) => {
            return getFieldValue(value);
          }
        };
      }
      return column;
    });
    return chain;
  };

  const excludes = (_fieldKeys) => {
    _fieldKeys = [].concat(_fieldKeys);
    columns = columns.filter(column => !_fieldKeys.includes(column.dataIndex));
    return chain;
  };

  const enhance = (_extraColumns) => {
    if (!Array.isArray(_extraColumns)) {
      _extraColumns = Object.keys(_extraColumns).map(key => {
        return Object.assign(_extraColumns[key], {
          key
        });
      });
    }
    _extraColumns.forEach(extraColumn => {
      let { dataIndex, title, key, name, ...others } = extraColumn;
      extraColumn = {
        dataIndex: key || dataIndex,
        title: name || title,
        ...others
      };

      const column = columns.find(item => item.dataIndex == extraColumn.dataIndex);
      if (column) {
        Object.assign(column, extraColumn);
      } else {
        columns.push(extraColumn);
      }
    });

    return chain;
  };

  const values = () => {
    return columns;
  };

  columns = transform(fields);

  if (fieldKeys) {
    pick(fieldKeys);
  }

  if (extraFields) {
    enhance(extraFields);
  }

  return Object.assign(chain, {
    pick,
    excludes,
    enhance,
    values
  });
}

export default {
  combineTypes,
  getFieldValue,
  getColumns
};
