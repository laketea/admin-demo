import { Form } from 'antd';
import { HForm, HModal, Utils } from 'carno';

const { getFields } = Utils.Form;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

class BlacklistModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit(values) {
    const { blacklist: { id }, onOk } = this.props
    onOk({ ...values, id });
  }

  render() {
    const { visible, form, fields, confirmLoading, blacklist, onOk } = this.props;
    const formProps = {
      form,
      layout,
      item: blacklist,
      fields: getFields(fields).values()
    };
    return (
      <HModal title="黑名单" {...{ visible, form, confirmLoading, onOk }} >
        <HForm {...formProps} />
      </HModal>
    );
  }
}

export default Form.create()(BlacklistModal);
