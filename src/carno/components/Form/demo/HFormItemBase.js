import { Form, Row, Col, Button } from 'antd';
import { HFormItem } from 'carno';
import Utils from 'utils';

const { validate, getFields } = Utils.Form;

const fields = [
  {
    key: 'name',
    name: '名称',
    required: true
  }, {
    key: 'gender',
    name: '性别',
    enums: {
      MALE: '男',
      FAMALE: '女'
    }
  }, {
    key: 'age',
    name: '年龄'
  }, {
    key: 'birthday',
    name: '生日',
    type: 'date'
  }, {
    key: 'desc',
    name: '自我介绍',
    type: 'textarea'
  }
];


function HFormItemBase({ form }) {

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  const itemProps = { form, item: {}, ...layout };
  const onChange = () => {
    console.log('changed');
  };
  const rules = {
    number: [{ pattern: /^\d+$/, message: '请输入数字' }]
  };
  const submit = () => {
    validate(form, fields)((values) => {
      console.log(values);
    });
  };
  const fieldMap = getFields(fields).toMapValues();

  return (
    <Form >
      <Row>
        <Col span="12" ><HFormItem {...itemProps} field={fieldMap.name} inputProps={{ disabled: true }} placeholder="指定placeholder" /></Col>
        <Col span="12" ><HFormItem {...itemProps} field={fieldMap.gender} /></Col>
      </Row>
      <Row>
        <Col span="12" ><HFormItem {...itemProps} field={fieldMap.age} rules={rules.number} onChange={onChange} /></Col>
        <Col span="12" ><HFormItem {...itemProps} field={fieldMap.birthday} /></Col>
      </Row>
      <Row>
        <Col span="12" ><HFormItem {...itemProps} field={fieldMap.desc} /></Col>
      </Row>
      <Row>
        <Col span="12"><Button type="primary" onClick={submit} >提交</Button></Col>
      </Row>
    </Form>
  );
}

export default Form.create()(HFormItemBase);
