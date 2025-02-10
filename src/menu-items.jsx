const user = JSON.parse(localStorage.getItem('user'));
const userRole = user?.roles;
const filterMenuItem = (menu) => {
  const filterItems = (items) =>
    items
      .filter((item) => !(['Admin'].includes(userRole) && ['users'].includes(item.id)))
      .filter((item) => !(['Operator'].includes(userRole) && [].includes(item.id)))
      .filter(
        (item) =>
          !(
            ['supervisor'].includes(userRole) &&
            [
              'approve_godown',
              'stockout',
              'users',
              'purchaser',
              'GodownAccessories',
              'GoDownGatePass',
              'customers',
              'stock_to_godown',
              'approve_operator',
              'godown_stock'
            ].includes(item.id)
          )
      )
      .filter(
        (item) =>
          !(
            ['sub_supervisor'].includes(userRole) &&
            [
              'usersGroup',
              'products',
              'Accessory',
              'stockin',
              'Warehouse_Accessories',
              'stockout',
              'WarehouseGatePass',
              'stockout'
            ].includes(item.id)
          )
      )
      .filter(
        (item) =>
          !(
            ['operator'].includes(userRole) &&
            [
              'approve_godown',
              'users',
              'purchaser',
              'GodownAccessories',
              'GoDownGatePass',
              'customers',
              'stock_to_godown',
              'approve_operator',
              'godown_stock',
              'usersGroup',
              'products',
              'Accessory',
              'stockin',
              'Warehouse_Accessories',
              'WarehouseGatePass'
            ].includes(item.id)
          )
      )
      .map((item) => (item.children ? { ...item, children: filterItems(item.children) } : item));

  return { ...menu, items: filterItems(menu.items) };
};

// Menu items
const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Home',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/dashboard'
        }
      ]
    },
    {
      id: 'usersGroup',
      title: 'Users',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'Users',
          title: 'People',
          type: 'collapse',
          icon: 'feather icon-users',

          children: [
            {
              id: 'users',
              title: 'Users',
              icon: 'feather icon-user',
              type: 'item',
              url: '/users'
            },
            {
              id: 'suppliers',
              title: 'Suppliers',
              icon: 'feather icon-share-2',
              type: 'item',
              url: '/supplier'
            },
            {
              id: 'purchaser',
              title: 'Purchaser',
              icon: 'feather icon-users',
              type: 'item',
              url: '/receiver'
            },
            {
              id: 'customers',
              title: 'Customers',
              icon: 'feather icon-user-check',
              type: 'item',
              url: '/customers'
            }
          ]
        }
      ]
    },
    {
      id: 'products',
      title: 'Product',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'products-id',
          title: 'Products',
          icon: 'feather icon-package',
          type: 'collapse',
          style: {
            boxShadow: '0px 4px 6px rgba(19, 15, 15, 0.1)',
            borderRadius: '8px',
            padding: '10px',
            backgroundColor: '#ffffff'
          },
          children: [
            {
              id: 'category1',
              title: ' Product',
              type: 'item',
              url: '/shades',
              icon: 'feather icon-package'
            },
            {
              id: 'category2',
              title: ' Products Category',
              type: 'item',
              url: '/product_category',
              icon: 'feather icon-package'
            }
          ]
        }
      ]
    },
    {
      id: 'Accessory',
      title: 'Accessories',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'accessories',
          title: 'Accessories',
          icon: 'feather icon-package',
          type: 'collapse',
          style: {
            boxShadow: '0px 4px 6px rgba(19, 15, 15, 0.1)',
            borderRadius: '8px',
            padding: '10px',
            backgroundColor: '#ffffff'
          },
          children: [
            {
              id: 'accessoriesadd',
              title: 'Add Accessories',
              type: 'item',
              url: '/add_accessories',
              icon: 'feather icon-package'
            },
            {
              id: 'accessories_record',
              title: 'Accessories',
              type: 'item',
              url: '/accessories_record',
              icon: 'feather icon-package'
            },
            {
              id: 'add_warehouse_accessory',
              title: 'Add WareAccessories',
              type: 'item',
              url: '/add_warehouse_accessories',
              icon: 'feather icon-package'
            }
          ]
        }
      ]
    },
    {
      id: 'stockin',
      title: 'Stock In',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'stocks',
          title: 'Stocks In',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'list_stock',
              title: 'List',
              icon: 'feather icon-list',
              type: 'item',
              url: '/invoices'
            },
            {
              id: 'add_invoice',
              title: 'Add Invoice',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/add-invoice'
            },
            {
              id: 'all_stocks',
              title: 'Stocks',
              icon: 'feather icon-clipboard',
              type: 'collapse',
              children: [
                {
                  id: 'roller_stock',
                  title: 'Roller Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/all-stocks'
                },
                {
                  id: 'wooden_stock',
                  title: 'Wooden Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/box_All_Stock'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'stockout',
      title: 'Stock Out',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'stocksout',
          title: 'Stocks Out',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'invoice_out',
              title: 'Invoice',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/invoice-out'
            },

            {
              id: 'invoice_out_index',
              title: 'All Out Invoice',
              icon: 'feather icon-file-minus',
              type: 'item',
              url: '/all-invoices-out'
            },
            {
              id: 'invoice_operator_index',
              title: 'All Operator Invoice',
              icon: 'feather icon-file-minus',
              type: 'item',
              url: '/operator_invoice'
            },
            {
              id: 'invoice_out_stock',
              title: 'All Out Stock',
              icon: 'feather icon-file-minus',
              type: 'item',
              url: '/all-out-stock'
            }
          ]
        }
      ]
    },
    {
      id: 'WarehouseGatePass',
      title: 'Godown GatePass',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'send_to_godown',
          title: 'GatePass',
          type: 'collapse',
          icon: 'feather icon-box',

          children: [
            {
              id: 'create_gate_pass',
              title: 'Add GatePass',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/stockout/godown'
            },
            {
              id: 'generated_gate_pass',
              title: 'View Gate Pass',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/generated_gate_pass'
            }
          ]
        }
      ]
    },
    {
      id: 'GoDownGatePass',
      title: 'Stock GatePass',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'godown_gatepass',
          title: 'GatePass',
          type: 'collapse',
          icon: 'feather icon-box',

          children: [
            {
              id: 'approve_stock',
              title: 'Stock GatePass',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/approve/godown'
            },
            {
              id: 'approve_accessory',
              title: 'Accessory GatePass',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/approve/accessory'
            }
          ]
        }
      ]
    },
    {
      id: 'GodownAccessories',
      title: 'Stock',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'godown_stock',
          title: 'Stocks GatePass',
          type: 'collapse',
          icon: 'feather icon-box',

          children: [
            {
              id: 'godown_stock',
              title: 'Product Stocks',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/stocks/godown'
            },
            {
              id: 'godown_accessory',
              title: 'Accessory Stocks',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/view_approve_gatepass'
            }
          ]
        }
      ]
    },
    {
      id: 'Warehouse_Accessories',
      title: 'Warehouse Accessories',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'accessories_gatepass',
          title: 'Accessory GatePass',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'invoice_out',
              title: 'Add GatePass',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/accessory/gatepass'
            },
            {
              id: 'accessory_out_index',
              title: 'View GatePass',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/accessory/gatepassview'
            },
            ,
            {
              id: 'warehouse_accessory',
              title: 'Warehouse Accessories',
              type: 'item',
              url: '/warehouse_accessories',
              icon: 'feather icon-package'
            }
          ]
        }
      ]
    }
  ]
};

// Filter the menu items
const filteredMenuItems = filterMenuItem(menuItems);

export default filteredMenuItems;
