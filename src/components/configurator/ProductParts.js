import React from 'react';
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
    id: 1,
    name: 'Az-40',
    category: 'Aluminium',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
];

export default function ProductParts() {
  const renderCell = React.useCallback((productPart, columnKey) => {
    const cellValue = productPart[columnKey];

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: productPart.avatar }}
            description={productPart.name}
            name={cellValue}
          >
            {productPart.name}
          </User>
        );
      default:
        return cellValue;
    }
  }, []);
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
                  <TableRow key={item.id}>
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
                  <TableRow key={item.id}>
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
