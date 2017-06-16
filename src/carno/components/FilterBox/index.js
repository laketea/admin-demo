import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import classNames from 'classnames';

import styles from './index.less';

class FilterBox extends Component {
  constructor() {
    super();

    this.state = {
      visible: true
    };

    this.timer = '';
  }

  handleFilterClick(visible) {
    this.setState({
      visible: !visible
    });
  }

  render() {
    const { visible } = this.state;

    const btnsCls = classNames({
      [styles.filterBtns]: true,
      [styles.filterActive]: visible,
    });

    const filterBtnCls = classNames({
      [styles.active]: visible,
    });

    const filterBoxCls = classNames({
      [styles.filterBox]: true,
      [styles.active]: visible,
    });

    return (
      <div>
        <div className={btnsCls}>
          <Button className={filterBtnCls} onClick={() => this.handleFilterClick(visible)}>过滤<Icon type="down" /></Button>
          {this.props.overlay}
        </div>
        {visible &&
          <div className={filterBoxCls}>
            {this.props.children}
          </div>
        }
      </div>
    );
  }
}

export default FilterBox;
