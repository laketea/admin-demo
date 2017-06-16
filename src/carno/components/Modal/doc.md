## HModal 模态框组件

对`antd modal`的封装，简化对模态框的状态控制.

首先来看看目前项目中对`antd.modal`的使用方式：

```javascript

export default class Test extend React.component {
  constructor(props){
    super(props);
    this.state = {
      state: false
    }
  }

  handleModal() {
    this.state = {
      visible: true
    }
  }

  handleCancel() {
    this.sttae = {
      visible: false
    }
  }

  render() {
    const { visible } = this.state

    const modalProps = {
      visible,
      onCancel: this.handleCancel,
      onOk: this.props.onSave
    }

    return (
      <div>
        ...
        { visible && <DetailModal {...modalProps} />}
      <div>
    )
  }

}

```

在上述代码中，需要处理`visible`状态来控制`modal`的打开与关闭，特别是关闭状态，既需要在`onCancel`中将`visible`设置为`false`, 又需要在`onOk`中处理.    
 如果是将`visible`状态存入`model`中，又会导致`visible`状态控制更为的繁琐，而本质上`visible`仅仅只是一个中间组件的状态，对于实际的业务而已并没有什么意义.

`HModal`的引入正是为了解决以上问题，在`antd.modal`属性的基础上，我们做了如下调整:

- **visible**
    `visible`数据类型调整为原子数据(`Symbol`), 每次改变的时候，则会打开`modal`
- **onCancel** 
    `onCancel`属性不再是必须，当触发`cancel`时，组件内部自动处理`visble`状态
- **confirmLoading** 
    `confirmLoading`属性除了控制btn状态，还会关联`visible`属性，如果没有设置`confirmLoading`属性，点确定时会自动关闭`modal`, 如果设置了`confirmLoading`属性，则点击确定后，`confirm`从`true`变为`false`的时候，将关闭`modal`
- **form**
    与`form`配合使用，如果传递了`form`属性，则点击确定时候，只有在`form` `validate`成功后，才会触发`cancel`的处理，并且`onOk`属性会传递`form values`数据
## 代码演示

## DEMOS

## API

| 参数      | 说明                                     | 类型       | 默认值 |
|-----------|------------------------------------------|------------|-------|
| visible | 原子类型，每次改变值的时候，会显示modal框 | Symbol |  |
| form | 如果配置了form属性,则只有form validate成功后，才会触发关闭modal的处理 | antd form对象 |  |
| ...others | 传递给antd modal的其它属性, 请参考ant.modal属性 | - | - |
