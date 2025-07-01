import React from 'react';
import { Select } from 'antd';

export default function TempSelect() {
  return (
    <div style={{ padding: 40, background: '#f0f2f5', minHeight: '100vh' }}>
      <h2>⚙️ Test AntD Select</h2>
      <Select
        style={{ width: 200 }}
        placeholder="Chọn thử"
        options={[
          { value: '1', label: 'Một' },
          { value: '2', label: 'Hai' },
          { value: '3', label: 'Ba' },
        ]}
      />
    </div>
  );
}
