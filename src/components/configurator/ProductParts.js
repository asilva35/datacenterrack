import React, { useContext } from 'react';
import styles from '@/styles/ProductParts.module.css';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tabs,
  Tab,
} from '@nextui-org/react';

import { AppContext } from '@/context/AppContext';

const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'CATEGORY', uid: 'category' },
];

const productParts = [
  {
    id: 1,
    name: 'Az-20',
    category: 'Titanium',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
];

const productParts02 = [
  {
    id: 2,
    name: 'Az-40',
    category: 'Aluminium',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
];

export default function ProductParts() {
  const { state, dispatch } = useContext(AppContext);
  const renderCell = React.useCallback((record, columnKey) => {
    const cellValue = record[columnKey];

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: record.avatar }}
            description={record.name}
            name={cellValue}
            className={styles.TableCell}
            onClick={() => {
              onSelectionProductPart(record);
            }}
          >
            {record.name}
          </User>
        );
      default:
        return (
          <div
            className={styles.TableCell}
            onClick={() => {
              onSelectionProductPart(record);
            }}
          >
            {cellValue}
          </div>
        );
    }
  }, []);
  const onSelectionProductPart = (record) => {
    dispatch({
      type: 'SELECT_PRODUCT_PART',
      currentPartSelected: record,
    });
  };
  return (
    <div className={`${styles.ProductParts}`}>
      <div className={`${styles.wrapper}`}>
        <Tabs aria-label="PartOptions" className={`${styles.Tabs}`}>
          <Tab key="side-left" title="Side Left">
            <Table
              className={`${styles.Table}`}
              selectionMode="single"
              aria-label="Product Parts Info"
              color={'primary'}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.uid} align={'start'}>
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={productParts}>
                {(item) => (
                  <TableRow key={item.id} className={styles.TableRow}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Tab>
          <Tab key="side-right" title="Side Right">
            <Table
              className={`${styles.Table}`}
              selectionMode="single"
              aria-label="Product Parts Info"
              color={'primary'}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.uid} align={'start'}>
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={productParts02}>
                {(item) => (
                  <TableRow key={item.id} className={styles.TableRow}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
