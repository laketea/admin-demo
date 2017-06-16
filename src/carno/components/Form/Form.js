import React from 'react';
import { Form } from 'antd';
import Utils from 'carno/utils';

const FormUtil = Utils.Form;
const FormItem = Form.Item;

export default ({ fields, item, form, layout = {}, ...others }) => {
  return (
    <Form horizontal {...others} >
      {fields.map((field) =>
        (<FormItem label={`${field.name}:`} help={field.help} hasFeedback={field.hasFeedback === false ? field.hasFeedback : true} key={field.key} {...layout}>
          {FormUtil.createFieldDecorator(field, item, form.getFieldDecorator)}
        </FormItem>)
      )}
    </Form>
  );
};
