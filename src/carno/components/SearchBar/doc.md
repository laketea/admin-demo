## 搜索栏组件

对FilterBox与FormSearchGen组件的封装

## 何时使用

一般在列表页使用

## 代码演示

## DEMOS

## API

### SearchBar

| 参数           | 说明                     | 类型             | 默认值   |
|---------------|--------------------------|-----------------|---------|
| layout | 表单布局(antd@2.8 之后支持) | horizontal,vertical,inline |horizontal |
| btns       | 自定义按钮 | Element | - |
| onSearch       | 查询回调函数 | Function() | - |
| fields       | 查询字段配置,参考model中的fields格式 | Array | - |
| search       | 查询字段初始值 | Object | - |
| formItemLayout       | 查询框布局属性: { itemCol: { span: 6 }, labelCol: { span: 6 }, wrapperCol: { span: 6 }, btnCol: { span: 4 }} | Object | - |
| showLabel       | 是否显示label | Object | - |
| showReset       | 是否显示重置按钮 | Boolean | - |

