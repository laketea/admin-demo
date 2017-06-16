import { Button } from 'antd';
import { HModal } from 'carno';

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
        this.state = { visible: false };
    }

    handleModal(){
        this.setState({ visible: Symbol() });
    }

    render(){
        const { visible } = this.state;
        const modalProps = {
            visible,
            onOk: () => console.log('close')
        }
        return (
            <div>
                <Button type="primary" onClick={() => this.handleModal()}>普通模态框</Button>
                <DetailModal {...modalProps}/>
            </div>
        );

    }
}