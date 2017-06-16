import { Button } from 'antd';
import { SearchBar as HSearchBar, Utils } from 'carno';

const { getFields } = Utils.Form;

function SearchMore({ search = {}, fields, onAdd, onSearch }) {

  const btns = (
    <Button onClick={onAdd} type="primary">新增黑名单</Button>
  );

  const searchFields = getFields(fields).pick(['type', 'userId', 'content']).values();
  const searchBarProps = { search, btns, onSearch, layout: 'inline', fields: searchFields, showReset: true, formItemLayout: { itemCol: { span: 4 }, btnCol: { span: 8 } } };

  return (
    <HSearchBar {...searchBarProps} />
  );
}

export default SearchMore;
