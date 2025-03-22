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
              'users',
              'approve_godown',
              'operator-stockout',
              'godownStock',
              'godown-stockout',
              'GodownAccessories',
              'GoDownGatePass',
              'customers',
              'stock_to_godown',
              'approve_operator',
              'godown_stock',
              'StockTransfer'
            ].includes(item.id)
          )
      )
      .filter(
        (item) =>
          !(
            ['sub_supervisor'].includes(userRole) &&
            [
              'usersGroup',
              'operator-stockout',
              'products',
              'Accessory',
              'stockin',
              'Warehouse_Accessories',
              'WarehouseGatePass'
              // 'godown-stockout'
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
              'GodownAccessories',
              'approve_stock',
              'suppliers',
              'godown-stockout',
              'stock_to_godown',
              'approve_operator',
              'godown_stock',
              'products',
              'Accessory',
              'stockin',
              'Warehouse_Accessories',
              'WarehouseGatePass',
              'godownStock'
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
              id: 'Seller',
              title: 'Seller',
              icon: 'feather icon-users',
              type: 'item',
              url: '/company'
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
      title: 'Blinds',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'products-id',
          title: 'Blinds',
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
              id: 'category2',
              title: ' Blinds Category',
              type: 'item',
              url: '/product_category',
              icon: 'feather icon-package'
            },
            {
              id: 'category1',
              title: ' Blinds',
              type: 'item',
              url: '/shades',
              icon: 'feather icon-package'
            }
          ]
        }
      ]
    },
    {
      id: 'Accessory',
      title: 'Accessories IN',
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
              id: 'accessories_record',
              title: 'Accessories',
              type: 'item',
              url: '/accessories_record',
              icon: 'feather icon-package'
            },
            {
              id: 'add_warehouse_accessory',
              title: 'Warehouse Accessories',
              type: 'item',
              url: '/warehouse_accessories',
              icon: 'feather icon-package'
            }
          ]
        }
      ]
    },
    {
      id: 'stockin',
      title: 'Blinds In',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'stocks',
          title: 'Blinds In',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'add_invoice',
              title: 'Add Invoice',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/add-invoice'
            },
            {
              id: 'list_stock',
              title: 'View Invoice',
              icon: 'feather icon-list',
              type: 'item',
              url: '/invoices'
            },
            {
              id: 'all_stocks',
              title: 'Blinds Stocks',
              icon: 'feather icon-clipboard',
              type: 'collapse',
              children: [
                {
                  id: 'roller_stock',
                  title: 'Roller Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/roller_stock'
                },
                {
                  id: 'wooden_stock',
                  title: 'Wooden Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/wooden_stock'
                },
                {
                  id: 'vertical_stock',
                  title: 'Vertical Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/vertical_stock'
                },
                {
                  id: 'honeycomb_stock',
                  title: 'HoneyComb Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/honeycomb_stock'
                },
                {
                  id: 'zebra_stock',
                  title: 'Zebra Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/zebra_stock'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'operator-stockout',
      title: 'Blinds Stock Out',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'stocksout',
          title: 'Blinds Out',
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
              title: 'View Invoice',
              icon: 'feather icon-file-minus',
              type: 'item',
              url: '/all-invoices-out'
            },
            {
              id: 'invoice_out_stock',
              title: 'Invoice Out Stock',
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
      title: 'Blinds Godown GatePass',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'send_to_godown',
          title: 'Blinds GatePass',
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
              title: 'View GatePass',
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
      title: 'Blinds Stock GatePass',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'godown_gatepass',
          title: 'Blinds GatePass',
          type: 'collapse',
          icon: 'feather icon-box',

          children: [
            {
              id: 'approve_stock',
              title: 'Blinds Stock GatePass',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/approve/godown'
            },
            {
              id: 'all_stocks',
              title: 'Blinds Stocks',
              icon: 'feather icon-clipboard',
              type: 'collapse',
              children: [
                {
                  id: 'roller_stock',
                  title: 'Roller Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/godown/roller_stock'
                },
                {
                  id: 'wooden_stock',
                  title: 'Wooden Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/godown/wooden_stock'
                },
                {
                  id: 'vertical_stock',
                  title: 'Vertical Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/godown/vertical_stock'
                },
                {
                  id: 'honeycomb_stock',
                  title: 'HoneyComb Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/godown/honeycomb_stock'
                },
                {
                  id: 'zebra_stock',
                  title: 'Zebra Stocks',
                  icon: 'feather icon-list',
                  type: 'item',
                  url: '/zebra_stock_godown'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'StockTransfer',
      title: 'Blinds Godown Transfer',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'transfer_form_godown',
          title: 'Blinds Tranfer',
          type: 'collapse',
          icon: 'feather icon-box',

          children: [
            {
              id: 'stock_transfer',
              title: 'Stock Transfer',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/stock-tranfer'
            },
            {
              id: 'view_stock_transfer',
              title: 'View Stock Transfer',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/view_stock_transfer'
            },
            {
              id: 'view_get_transfer',
              title: 'View Get Transfer',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/view_get_transfer'
            }
          ]
        }
      ]
    },
    {
      id: 'GodownAccessories',
      title: 'Accessories Stock',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'godown_stock',
          title: 'Accessory Stocks',
          type: 'collapse',
          icon: 'feather icon-box',

          children: [
            {
              id: 'approve_accessory',
              title: 'GatePass',
              icon: 'feather icon-file-plus',
              type: 'item',
              url: '/approve/accessory'
            },
            {
              id: 'godown_accessory',
              title: 'Stocks',
              icon: 'feather icon-list',
              type: 'item',
              url: '/view_approve_gatepass'
            },
            {
              id: 'all_godown_accessoryout',
              title: 'StocksOut',
              icon: 'feather icon-list',
              type: 'item',
              url: '/all-accessory-out'
            }
          ]
        }
      ]
    },
    {
      id: 'godown-stockout',
      title: 'Stocks Out',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'godownstockout',
          title: 'Stocks Out',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'approve_operator',
              title: 'Invoice Out ',
              icon: 'feather icon-file-minus',
              type: 'item',
              url: '/operator_invoice'
            },
            {
              id: 'approve_operator',
              title: 'view all out Invoice ',
              icon: 'feather icon-file-minus',
              type: 'item',
              url: '/all_out_stock_godown'
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
            }
          ]
        }
      ]
    }
  ]
};
const filteredMenuItems = filterMenuItem(menuItems);

export default filteredMenuItems;
