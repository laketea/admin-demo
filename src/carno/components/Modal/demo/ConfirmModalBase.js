import {Button} from 'antd';
import {HModal} from 'carno';

function DetailModal(props) {

    return (
        <HModal title="测试框" {...props}>
            这是一个测试的modal
        </HModal>
    )
}

export default class ModalBase extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false
        };
    }

    handleModal() {
        this.setState({visible: Symbol()});
    }

    handleSave() {
        // 实际业务中，在modal中处理confirmLoading状态
        const self = this;
        this.setState({confirmLoading: true});
        setTimeout(function () {
            self.setState({confirmLoading: false});
        }, 3000);
    }

    render() {
        const {visible, confirmLoading} = this.state;
        const modalProps = {
            visible,
            confirmLoading,
            onOk: () => this.handleSave()
        }
        return (
            <div>
                <Button type="primary" onClick={() => this.handleModal()}>confirmLoading模态框</Button>
                <DetailModal {...modalProps}/>
            </div>
        );

    }
}