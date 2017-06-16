import { Form, Row, Col } from 'antd';
import { HModal, HFormItem, Utils } from 'carno';

const { getFields } = Utils.Form;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

class UserModal extends React.Component {
  
  render() {
    const { visible, fields, form, confirmLoading, onOk } = this.props;
    const itemProps = { form, item: {}, ...layout };
    const fieldMap = getFields(fields).toMapValues();

    return (
      <HModal title="创建用户" visible={visible} width="900" form={form} confirmLoading={confirmLoading} onOk={onOk} >
        <Row>
          <Col span={24}>
            <HFormItem {...itemProps} field={fieldMap.name} />
          </Col>
          <Col span={24}>
            <HFormItem {...itemProps} field={fieldMap.gender} />
          </Col>
          <Col span={24}>
            <HFormItem {...itemProps} field={fieldMap.age} />
          </Col>
          <Col span={24}>
            <HFormItem {...itemProps} field={fieldMap.career} />
          </Col>
          <Col span={24}>
            <HFormItem {...itemProps} field={fieldMap.nation} />
          </Col>
          <Col span={24}>
            <HFormItem {...itemProps} field={fieldMap.createTime} />
          </Col>
        </Row>
      </HModal>
    );
  }
}

export default Form.create()(UserModal);
