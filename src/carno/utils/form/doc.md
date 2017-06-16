# Form工具类

后台系统业务大部分都是表格＋表单的形式，故我们在`model`层，统一定义模型的数据结构，以方便在`table+form`中复用，简化实际的开发工作.  
这里主要介绍下`Form`工具类的使用.

### 使用场景
field提供统一的数据格式，以方便在form以及table中复用，参考如下:

``` javascript

const fields = [
  {
    key: 'name', // 字段key
    name: '名称' // 字段name
    type: 'text' // 字段类型支持如下类型: date|datetime|datetimeRange|enum|boolean|number|textarea|text
    meta: {
      min: 0,
      max: 100,
      rows: 12
    },
    required: true
  }
]

```

Form类的主要作用是将以上通用的`field`格式，转换为`createFieldDecorator`内部函数支持的格式

### 如何使用
form工具类通过Utils类中引入.

> import { Utils } from 'carno';
> const { getFields } = Utils;

form工具类主要提供以下接口:

- getFields 转换field为form field格式
- combineTypes 扩展支持的字段类型
- validate form数据验证扩展
- getDateValue 转换datetime数据格式
- createFieldDecorator 创建新的fieldDecorator

##### getFields
核心方法，转换通用字段类型为表单field格式, getFields返回的数据需要配合[FormGen](#/components/FormGen)组件使用.

参数：

- originFields 通用的fields定义，一般由model中定义
- fieldKeys 需要pick的keys, 通用的fields往往是个字段的超级，在form中一般只需要显示部分字段
- extraFields 扩展的字段定义, 可以对通用字段的属性扩展

getFields返回的是一个链式对象，需要调用`values`方法才能返回最终的结果。
链式对象支持如下方法:

- pick 参数与fieldKeys格式一致
- excludes 排除部分字段
- enhance 参数与extraFields格式一致
- values 返回数据结果

```javascript 

import { Form, Button } from 'antd';
import { Utils, FormGen } from 'carno';

const { getFields, validate } = Utils.Form;

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
    key: 'birthday',
    name: '生日',
    type: 'date'
  }, {
    key: 'desc',
    name: '自我介绍',
    type: 'textarea'
  }
];

let results = {};

function FormGenBase({ form }) {
  const formProps = {
    fields: getFields(fields).values(),
    item: {},
    form
  };

  return (
    <div>
      <FormGen {...formProps} />
    </div>
  );
}

export default Form.create()(FormGenBase);

```

##### combineTypes

扩展通用字段定义支持的表单类型, 自定义字段类型写法参考如下:

```javascript
combineTypes（{
  //参数：初始值,meta(字段meta数据，例如: rows,min,max等), field字段定义对象
  text: (initialValue, meta, field, showPlaceholder) => {
      const placeholder = meta.placeholder || (showPlaceholder ? `${field.name}` : '');
      //返回值为一个对象，需要返回
      // input: 表单控件
      // initialValue: 初试值
      return {
        input: <Input type="text" placeholder={placeholder} />,
        initialValue
      };
    }
})

```

##### validate

validate对象是对antd validate方法的包装，主要作用是统一处理form中的datatime类型的数据，将moment数据结构转换为number类型.

参数：

- form antd表单对象

```
const onSuccess = (values) => {
  // values 中的datatime类型已自动转换为number
}
const  onError ＝ () => {

}
validate(form)(onSuccess, onError)

```

##### getDateValue

提供一个工具函数，方便转换moment类型为number

```javascript

getDateValue(item.updateTime);

```

##### createFieldDecorator

创建antd的fieldDecorator对象,目前此函数主要是提供给`FormGen`组件使用

参数如下:

- field 字段定义
- item 初始化数据对象
- getFieldDecorator antd form对象中的getFieldDecorator
- showPlaceholder 是否显示Placeholder














