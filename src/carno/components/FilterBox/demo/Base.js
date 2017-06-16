import { Button, Input, Row, Col } from 'antd';
import { FilterBox } from 'carno';

function Base() {
  const btns = (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      <Button type="primary" style={{ marginLeft: '10px' }}>刷新</Button>
      <Button style={{ float: 'right' }} type="primary">发布应用</Button>
    </div>
  );

  return (
    <FilterBox overlay={btns}>
      <Row style={{ marginBottom: '16px' }}>
        <Col span={6}>
          <Input placeholder="请输入应用名称" />
        </Col>
      </Row>
    </FilterBox>
  );
}

export default Base;
