import React from 'react';
import { Form } from 'antd';
import Utils from 'carno/utils';

const FormUtil = Utils.Form;
const FormItem = Form.Item;

const FORM_ITEM_KEYS = ['label', 'labelCol', 'wrapperCol', 'help', 'extra', 'required', 'validateStatus', 'hasFeedback', 'colon'];
const DECORATOR_KEYS = ['trigger', 'valuePropName', 'getValueFromEvent', 'validateTriggger', 'exclusive'];

function pick(obj, keys) {
  return keys.map(k => k in obj ? { [k]: obj[k] } : {})
            .reduce((res, o) => Object.assign(res, o), {});
}

function extend(dest = {}, source = {}) {
  const result = Object.assign({}, dest);
  for (const key in source) {
    if (source.hasOwnProperty(key) && source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * HFormItem
 * 对FormItem组件封装,统一FormItem与getFieldDecorator的属性，方便使用
 * @props form 表单对象
 * @props field 字段定义对象
 * @props item 默认值数据对象
 * @props rules 校验规则
 * @props onChange 控件改变事件
 * @props initialValue 控件初始值，会覆盖item中对应key的value
 * @props placeholder 如果为false则不显示placeholder
 * @props {...ForItemProps Form.Item 属性集} 包含所有Form.Item属性,参考Form.Item文档
 * @props {...DecoratorOptions 属性集} 包含所有DecoratorOptions属性,参考DecoratorOptions文档
 *
 */
export default function (props) {
  let formItemProps = pick(props, FORM_ITEM_KEYS);
  const decoratorOpts = pick(props, DECORATOR_KEYS);

  let { inputProps } = props;
  let { label, help, hasFeedback } = formItemProps;
  const { form, field, item, rules, initialValue, placeholder, onChange } = props;
  const { key, name } = field;

  label = label === undefined ? name : label;
  help = help === undefined ? field.help : help;

  if (field.hasFeedback === false || hasFeedback === false) {
    hasFeedback = false;
  } else {
    hasFeedback = true;
  }

  const dataItem = item || { [key]: initialValue };
  const fieldItem = extend(field, { rules });

  formItemProps = extend(formItemProps, { label, help, hasFeedback, key });
  inputProps = extend(inputProps, { onChange });

  return (
    <FormItem {...formItemProps} >
        {FormUtil.createFieldDecorator(fieldItem, dataItem, form.getFieldDecorator, placeholder, inputProps, decoratorOpts)}
    </FormItem>
  );
}
