import { Popconfirm,message } from 'antd';
import React from 'react';

const text = 'are you sure to delete?';

const confirm = () => {
  message.info('Clicked on Yes.');
};

const Msg = () => (
    
      <Popconfirm placement="bottom" title={text} onConfirm={confirm} okText="Yes" cancelText="No">
        <span>Bottom</span>
      </Popconfirm>
);

export default Msg;