## Form相关组件


### HForm 表单组件

表单组件, 是对`antd`中`form`的封装，支持通过字段配置直接生成表单, 需要配合[Utils.Form](#/components/Form)类使用,
`HForm`内部的表单控件布局默认为`horizontal`.

### HFormItem 表单Item组件

Item组件，是对`antd`中`FormItem`以及`getFieldDecorator`的封装，提供统一的接口，以简化使用.
提供单个控件的封装组件以方便实现表单的灵活布局.

## 代码演示

## DEMOS

## API

## HForm属性

| 参数      | 说明                                     | 类型       | 默认值 |
|-----------|------------------------------------------|------------|-------|
| fields | 表单控件定义数组,详细属性请参考Field说明 | array |  |
| item | 默认数据对象 | object | - |
| form | antd form对象 | object | - |
| layout | 表单控件布局属性,参考antd formitem中的布局，示例: {labelCol: {span: 3, offset: 0}, wrapperCol: { span: 20 }} | object | - |
| ...others | 传递给antd form的其它属性, 请参考ant.form属性 | - | - |


## HFormIten属性
`antd`中`FormItem`的层级包括`FormItem/FieldDecorator/Input`, 使用起来太过繁琐, 我们提供统一的组件，将三层结构压缩为一级结构，将三层结构的属性，合并层一级结构的属性，并且将常用的属性提示到顶级属性上以方便使用.

| 参数      | 说明                                     | 类型       | 默认值 |
|-----------|------------------------------------------|------------|-------|
| form | antd form实例对象 | object |  |
| field | 表单控件定义对象，参考下面的FIELD属性 | object | - |
| item | 表单初试数据对象 | object | - |
| rules | 表单校验规则,参考antd rules 规则, 此属性会覆盖field里面的rules配置 | array |
| initialValue | 控件初始值，此属性会覆盖item中定义的初试数据 | any | - |
| onChange | 表单控件改变事件 | function | - |
| placeholder | placeholder如果为false则不显示，如果为string则显示对应的值，默认为label | boolean|string | - |
| inputProps | 传入给控件的属性对象 | object | - |
| ...FormItem | 包含全部的FormItem属性,参考antd FormItem属性定义 | - | - |
| ...DecoratorOptions | 包含全部的DecoratorOptions属性,参考antd DecoratorOptions属性定义 | - | - |

## FIELD属性
`fields`为`form/table`共用的数据结构对象，其属性说明如下:

| 属性      | 说明                                     | 类型       | 默认值 |
|-----------|------------------------------------------|------------|-------|
| key | 字段key | string |  |
| name | 字段名称，在form中即为header名称，table中作为lable名称 | string | - |
| type | 字段类型,目前支持如下类型:date,datetime,datetimeRange,enum,boolean,number,textarea,text | string | text |
| meta | 字段额外配置属性,支持:min,max,rows | object | - |
| enums | 字段枚举定义, 如果字段拥有此属性，则字段类型为enmu,示例: enums:{ ENABLED: '启用', DISABLED: '禁用'} | {} | - |
| required | form专用属性，是否必填字段 | boolean | - |
| render | table专用属性，自定义渲染 | boolean | - |



