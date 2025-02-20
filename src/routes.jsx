import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

import ProtectedRoute from './views/auth/ProtectedRoute';


export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>
                  {route.allowedRoles ? (
                    <ProtectedRoute allowedRoles={route.allowedRoles}>
                      {route.routes ? renderRoutes(route.routes) : <Element />}
                    </ProtectedRoute>
                  ) : (
                    route.routes ? renderRoutes(route.routes) : <Element />
                  )}
                </Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/signin/forgotPassword',
    element: lazy(() => import('./views/auth/signin/forgotPassword'))
  },
  {
    exact: 'true',
    path: '/signin/resetPassword',
    element: lazy(() => import('./views/auth/signin/resetPassword'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/dashboard',
        element: lazy(() => import('./views/dashboard')),
        allowedRoles:  ['superadmin', 'admin','supervisor', ,'sub_supervisor','operator']
      },
      {
        exact: 'true',
        path: '/calculator_vertical',
        element: lazy(() => import('./calculator/calculator_vertical')),
        allowedRoles:  ['superadmin','admin','supervisor', ,'sub_supervisor','operator']
      },
      {
        exact: 'true',
        path: '/wooden',
        element: lazy(() => import('./calculator/wooden')),
        allowedRoles:  ['superadmin','admin','supervisor', ,'sub_supervisor','operator']
      },
      {
        exact: 'true',
        path: '/users',
        element: lazy(() => import('./views/users/Index')),
        allowedRoles:  ['superadmin','admin']
      },
      {
        exact: 'true',
        path: '/add-user',
        element: lazy(() => import('./views/users/AddUser')),
        allowedRoles:  ['superadmin','admin', 'supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/Supplier',
        element: lazy(() => import('./views/supplier/Index')),
        allowedRoles:  ['superadmin','admin', 'supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/add-Supplier',
        element: lazy(() => import('./views/supplier/AddSupplier')),
        allowedRoles:  ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/quotation',
        element: lazy(() => import('./views/operator/quotation')),
        allowedRoles:  ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/company',
        element: lazy(() => import('./views/company/Index')),
        allowedRoles: ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/add-company',
        element: lazy(() => import('./views/company/AddCompany')),
        allowedRoles:  ['superadmin','admin', 'supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/customers',
        element: lazy(() => import('./views/customer/Index')),
        allowedRoles:  ['superadmin', 'admin',,'supervisor','operator']
      },
      {
        exact: 'true',
        path: '/add-Customer',
        element: lazy(() => import('./views/customer/AddCustomer')),
        allowedRoles:  ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/products',
        element: lazy(() => import('./views/products/Index')),
        allowedRoles: ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/stocks',
        element: lazy(() => import('./views/stock/Index')),
        allowedRoles:  ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/add-invoice',
        element: lazy(() => import('./views/stock/Add_inoice')),
        allowedRoles:  ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/accessories_record',
        element: lazy(() => import('./views/accessories/index')),
        allowedRoles:  ['superadmin','admin', 'supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/add_accessories',
        element: lazy(() => import('./views/accessories/add_accessories')),
        allowedRoles:  ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/add_warehouse_accessories',
        element: lazy(() => import('./views/accessories/add_warehouse_accessory')),
        allowedRoles:  ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/warehouse_accessories',
        element: lazy(() => import('./views/accessories/warehouse_accessory')),
        allowedRoles:  ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/view_approve_gatepass',
        element: lazy(() => import('./views/accessories/view_approve_gatepass')),
        allowedRoles:  ['superadmin', 'admin','supervisor', 'operator','sub_supervisor']
      },
      {
        exact: 'true',
        path: '/invoices',
        element: lazy(() => import('./views/stock/Index')),
        allowedRoles:  ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/add-product/:id/:no',
        element: lazy(() => import('./views/stock/Add_product')),
        allowedRoles:  ['superadmin', 'admin', 'supervisor']
      },
      {
        exact: 'true',
        path: '/show_product/:id',
        element: lazy(() => import('./views/stock/Show_product')),
        allowedRoles:  ['superadmin','admin', 'supervisor']
      },
      {
        exact: 'true',
        path: '/shades',
        element: lazy(() => import('./views/shades/Index')),
        allowedRoles:  ['superadmin','admin', 'supervisor']
      },
      {
        exact: 'true',
        path: '/product_category',
        element: lazy(() => import('./views/shades/product_category')),
        allowedRoles:  ['superadmin','admin', 'supervisor']
      },
      {
        exact: 'true',
        path: '/add-shades',
        element: lazy(() => import('./views/shades/AddShade')),
        allowedRoles:  ['superadmin','admin', 'supervisor']
      },
      {
        exact: 'true',
        path: '/roller_stock',
        element: lazy(() => import('./views/stock/roller_stock')),
        allowedRoles:  ['superadmin','admin', 'supervisor']
      },
      {
        exact: 'true',
        path: '/wooden_stock',
        element: lazy(() => import('./views/stock/wooden_stock')),
        allowedRoles:  ['superadmin','admin', 'supervisor']
      },
      {
        exact: 'true',
        path: '/vertical_stock',
        element: lazy(() => import('./views/stock/vertical_stock')),
        allowedRoles:  ['superadmin','admin', 'supervisor']
      },
      {
        exact: 'true',
        path: '/honeycomb_stock',
        element: lazy(() => import('./views/stock/honeycomb_stock')),
        allowedRoles:  ['superadmin','admin', 'supervisor']
      },
      {
        exact: 'true',
        path: '/godown/roller_stock',
        element: lazy(() => import('./views/godown/roller_stock')),
        allowedRoles:  ['superadmin','admin', 'supervisor','operator']
      },
      {
        exact: 'true',
        path: '/godown/wooden_stock',
        element: lazy(() => import('./views/godown/wooden_stock')),
        allowedRoles:  ['superadmin','admin', 'supervisor','operator']
      },
      {
        exact: 'true',
        path: '/godown/vertical_stock',
        element: lazy(() => import('./views/godown/vertical_stock')),
        allowedRoles:  ['superadmin','admin', 'supervisor','operator']
      },
      {
        exact: 'true',
        path: '/godown/add_vertical_stock/:id',
        element: lazy(() => import('./views/godown/add_vertical_stock')),
        allowedRoles:  ['superadmin','admin', 'supervisor',]
      },
      {
        exact: 'true',
        path: '/godown/honeycomb_stock',
        element: lazy(() => import('./views/godown/honeycomb_stock')),
        allowedRoles:  ['superadmin','admin', 'supervisor','operator']
      },
      {
        exact: 'true',
        path: '/invoice-out',
        element: lazy(() => import('./views/stockOut/Invoice_out')),
        allowedRoles:  ['supervisor','operator']
      },
      {
        exact: 'true',
        path: '/all-invoices-out',
        element: lazy(() => import('./views/stockOut/index')),
        allowedRoles:  ['superadmin', 'admin','supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/invoices-out/:id',
        element: lazy(() => import('./views/stockOut/invoice_out_details')),
        allowedRoles:  ['superadmin', 'admin','supervisor','operator']
      },
      {
        exact: 'true',
        path: '/operator_invoice',
        element: lazy(() => import('./views/stockOut/operator_invoice')),
        allowedRoles:  ['superadmin', 'admin','sub_supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/all-out-stock',
        element: lazy(() => import('./views/stockOut/all_out_stock')),
        allowedRoles:  ['superadmin','admin', 'supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/accessory-add-out-stock/:id',
        element: lazy(() => import('./views/stockOut/accessory_stockout')),
        allowedRoles:  ['superadmin','admin', 'supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/stocks/add-radius',
        element: lazy(() => import('./views/godown/Add_role')),
        allowedRoles:  ['superadmin','admin', 'supervisor', 'operator']
      },
      {
        exact: 'true',
        path: '/stockout/godown',
        element: lazy(() => import('./views/stock/stock_send')),
       allowedRoles: ['superadmin','admin','supervisor']
      },
      {
        exact: 'true',
        path: '/approve/godown/',
        element: lazy(() => import('./views/godown/approve_godown')),
        allowedRoles: ['superadmin','admin','supervisor','sub_supervisor']
      },
      {
        exact: 'true',
        path: '/generated_gate_pass',
        element: lazy(() => import('./views/godown/generated_gate_pass')),
        allowedRoles: ['superadmin','admin','supervisor']
      },
      {
        exact: 'true',
        path: '/approve_operator',
        element: lazy(() => import('./views/godown/approve_operator')),
        allowedRoles: ['superadmin','admin','supervisor','sub_supervisor']
      },
      {
        exact: 'true',
        path: '/stocks/old-stock',
        element: lazy(() => import('./views/godown/Old_stock')),
        allowedRoles: ['superadmin','admin','sub_supervisor']
      },
      {
        exact: 'true',
        path: '/stocks/godown/',
        element: lazy(() => import('./views/godown/index')),
        allowedRoles: ['superadmin','admin','supervisor','sub_supervisor']
      },
      {
        exact: 'true',
        path: '/operator',
        element: lazy(() => import('./views/operator/operator'))
      },
      {
        exact: 'true',
        path: '/accessory/gatepass',
        element: lazy(() => import('./views/accessories/gatepass')),
        allowedRoles: ['superadmin','admin','supervisor']
      },
      {
        exact: 'true',
        path: '/accessory/gatepassview',
        element: lazy(() => import('./views/accessories/generated_gatepass')),
        allowedRoles: ['superadmin','admin','supervisor']
      },
      {
        exact: 'true',
        path: '/approve/accessory',
        element: lazy(() => import('./views/accessories/approve_gatepass')),
        allowedRoles: ['superadmin','admin','supervisor','sub_supervisor']
      },
      {
        exact: 'true',
        path: '/accessory/gatepass_details/:id',
        element: lazy(() => import('./views/accessories/gatepass_details')),
        allowedRoles: ['superadmin','admin','supervisor','sub_supervisor']
      },
      {
        exact: 'true',
        path: '/show-gatepass_details/:id',
        element: lazy(() => import('./views/godown/godown_gate_pass_detail')),
        allowedRoles:  ['superadmin','admin', 'supervisor','sub_supervisor']
      },
      {
        exact: 'true',
        path: '/contexts',
        element: lazy(() => import('./menuitems')),
        allowedRoles:  ['superadmin','admin', 'supervisor','sub_supervisor']
      },
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb-paging',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'))
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: 'true',
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: 'true',
        path: '/tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable'))
      },
      {
        exact: 'true',
        path: '/charts/nvd3',
        element: lazy(() => import('./views/charts/nvd3-chart'))
      },
      {
        exact: 'true',
        path: '/maps/google-map',
        element: lazy(() => import('./views/maps/GoogleMaps'))
      },
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      },
      {
        exact: 'true',
        path: '/NavLeft/profile-page',
        element: lazy(() => import('./layouts/AdminLayout/NavBar/NavRight/profile-page'))
      },
      {
        exact: 'true',
        path: '/NavRight/changePassword',
        element: lazy(() => import('./layouts/AdminLayout/NavBar/NavRight/changePassword'))
      },
      
    ]
  }
];

export default routes;

