import React from 'react';
import Utils from 'carno/utils';
import { Form, Button, Row, Col } from 'antd';
import styles from './index.less';

const FormUtil = Utils.Form;
const FormItem = Form.Item;

/**
 * 查询表单
 *
 * @props fields 表单字段定义
 * @props search 查询字段初始值
 * @props form antd form
 * @props showLabel 是否显示输入框名称
 * @props showReset 是否显示重置按钮
 * @props formItemLayout 查询框布局定义
 * @props onSearch 查询回调函数
 * @props ...others 其他属性
 *
 */
const HSearchForm = ({ fields, search = {}, form, showLabel, showReset, formItemLayout = {}, onSearch, onReset, ...others }) => {
  formItemLayout = {
    itemCol: {
      span: 6
    },
    labelCol: {
      span: showLabel ? 6 : 0
    },
    wrapperCol: {
      span: showLabel ? 18 : 24
    },
    btnCol: {
      span: 6
    },
    ...formItemLayout,
  };

  const handleSubmit = () => {
    FormUtil.validate(form, fields)(onSearch);
  };

  const handleReset = () => {
    form.resetFields();
    onReset && onReset();
  };

  const getLabelName = (field) => {
    return showLabel ? `${field.name}:` : '';
  };

  return (
    <Form layout="inline" {...others} >
      <Row>
        {fields.map((field, index) =>
          <Col {...formItemLayout.itemCol} key={`itemKey${index}`}>
            <FormItem className={styles.formItem} label={getLabelName(field)} help={field.help} key={field.key} labelCol={formItemLayout.labelCol} wrapperCol={formItemLayout.wrapperCol} >
              {FormUtil.createFieldDecorator(field, search, form.getFieldDecorator)}
            </FormItem>
          </Col>
        )}
        <Col {...formItemLayout.btnCol} key={'itemKeySubmit'}>
          <FormItem style={{ marginBottom: 15 }}>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>查询</Button>
          </FormItem>
          {showReset &&
            <FormItem>
              <Button type="primary" onClick={handleReset} >重置</Button>
            </FormItem>
          }
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create()(HSearchForm);
