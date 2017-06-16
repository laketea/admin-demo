import { Modal } from 'antd';
import Utils from 'carno/utils';
const { validate } = Utils.Form;
/**
 * 模态框组件
 *
 * @props visible Symbol类型参数，每次visible改变的时候，都会显示模态框
 * @props form 如果配置了form属性，则onOk属性会传递values,且只有在form validate success之后，才触发cancel逻辑
 * @props {...modalProps} 参考antd 模态框组件
 */
export default class HModal extends React.Component {
  constructor(props) {
    super(props);
    const { visible } = props;
    this.state = {
      visible: !!visible
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  componentWillReceiveProps({ visible, confirmLoading }) {
    // 如果props中的visible属性改变，则显示modal
    if (visible && (visible !== this.props.visible)) {
      this.setState({
        visible: true
      });
    }
    // 如果confirmLoading 从true转变为flase,则隐藏modal
    if (confirmLoading == false && this.props.confirmLoading) {
      this.setState({
        visible: false
      });
    }
  }

  handleCancel() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }

    this.setState({
      visible: false
    });
  }

  handleOk() {
    const { confirmLoading, form, onOk } = this.props;
    const hideModal = () => {
      // 如果没有传递confirmLoading,则直接关闭窗口
      if (confirmLoading == undefined) {
        this.handleCancel();
      }
    };

    if (onOk && form) {
      // 如果配置了form属性，则验证成功后才关闭表单
      validate(form)((values, originValues) => {
        onOk(values, originValues);
        hideModal();
      });
    } else {
      onOk && onOk();
      hideModal();
    }

  }

  render() {
    const modalProps = { ...this.props, visible: true, onOk: this.handleOk, onCancel: this.handleCancel };
    return (
      <div>{this.state.visible && <Modal {...modalProps} >{this.props.children}</Modal>}</div>
    );
  }
}