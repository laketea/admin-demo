import FilterBox from '../FilterBox';
import HSearchForm from '../Form/SearchForm';
import styles from './index.less';
/**
 * 搜索栏组件
 * @props btns 自定义按钮
 * @props ...formProps 参考HSearchForm组件属性
 */

//type: box, bar
//trigger: change, submit 
function SearchBar(props) {
  const { btns, ...formProps } = props;
  return (
    <FilterBox overlay={btns}>
      <HSearchForm className={styles.searchForm} {...formProps} />
    </FilterBox>
  );
}

export default SearchBar;

