import React, { useEffect, useState } from 'react';
import './index.css';
import { Space, Switch, Table } from 'antd';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import type { TableColumnsType, TableProps } from 'antd';

type TableRowSelection<T> = TableProps<T>['rowSelection'];

interface DataType {
  key: React.ReactNode;
  name: string;
  age: number;
  index?: number;
  address: string;
  children?: DataType[];
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: '12%',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '30%',
    key: 'address',
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: '11',
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park',
      },
      {
        key: '12',
        name: 'John Brown jr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: '121',
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park',
          },
        ],
      },
      {
        key: '13',
        name: 'Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: '131',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: '1311',
                name: 'Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park',
              },
              {
                key: '1312',
                name: 'Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];

const rowSelection: TableRowSelection<DataType> = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

const App: React.FC = () => {
  const [checkStrictly, setCheckStrictly] = useState(false);
  const [dataSource, setDataSource] = useState<DataType[]>(data);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(dataSource);
    const sourceIndex = result.source.index; // index is already a number
    const destinationIndex = result.destination.index; // Extract index from result.destination
    console.log(result);

    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    setDataSource(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Space align="center" style={{ marginBottom: 16 }}>
        CheckStrictly:{' '}
        <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space>
      <Droppable droppableId="table">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Table
              columns={columns}
              rowSelection={{ ...rowSelection, checkStrictly }}
              dataSource={dataSource}
              pagination={false}
              components={{
                body: {
                  row: (props: any, index: any) => {
                    console.log('Row index:', index);
                    const item = dataSource;
                    console.log(item);
                    return (
                      <Draggable
                        draggableId={props['data-row-key']}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {props.children}
                          </tr>
                        )}
                      </Draggable>
                    );
                  },
                },
              }}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default App;
