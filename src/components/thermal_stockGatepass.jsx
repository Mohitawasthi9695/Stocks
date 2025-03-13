import React from 'react';
import { Modal } from 'react-bootstrap';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const PdfPreview = ({ show, onHide, invoiceData, id }) => {
  const invoice = invoiceData.find((invoice) => invoice.id === id);
  const [printMode, setPrintMode] = React.useState('normal');

  // Unique shade numbers
  const uniqueShadeNumbers = [...new Set(invoice.stock_in.map((item) => item.products.shadeNo))];

  const totalQuantity = invoice.stock_in.reduce((sum, item) => sum + item.quantity, 0);

  // Total quantity by each shade, ensuring the array length matches uniqueShadeNumbers
  const totalQuantityByShadeArray = uniqueShadeNumbers.map((shadeNo) => {
    return invoice.stock_in.reduce((sum, item) => {
      return item.products.shadeNo === shadeNo ? sum + item.quantity : sum;
    }, 0);
  });

  const styles = StyleSheet.create({
    page: {
      width: '80mm',
      padding: 5,
      fontSize: 10,
      fontFamily: 'Courier',
      textAlign: 'left'
    },
    header: {
      textAlign: 'center',
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 5
    },
    separator: {
      textAlign: 'center',
      fontSize: 10,
      marginVertical: 3
    },
    section: {
      marginBottom: 5
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    bold: {
      fontWeight: 'bold'
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 12,
      fontWeight: 'bold',
      marginTop: 6
    },
    footer: {
      textAlign: 'center',
      marginTop: 10,
      fontSize: 10
    }
  });

  const handlePrint = () => {
    if (printMode === 'normal') {
      window.print();
    } else {
      printThermalReceipt();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Gate Pass Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: '80vh' }}>
        <PDFViewer width="100%" height="100%">
          <Document>
            <Page size="A4" style={styles.page}>
              <Text style={styles.header}>STOCK IN GATE PASS</Text>

              <View style={styles.flexContainer}>
                {/* Gate Pass Details */}
                <View style={[styles.borderBox, styles.column]}>
                  <Text style={styles.sectionTitle}>Gate Pass Details:</Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Gate Pass No:</Text>
                    <Text style={styles.value}>{invoice.gate_pass_no}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Gate Pass Date:</Text>
                    <Text style={styles.value}>{invoice.gate_pass_date}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={styles.value}>{invoice.status === 0 ? 'Pending' : 'Completed'}</Text>
                  </View>
                </View>

                {/* Warehouse Supervisor */}
                <View style={[styles.borderBox, styles.column]}>
                  <Text style={styles.sectionTitle}>Transport:</Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Driver Name:</Text>
                    <Text style={styles.value}>{invoice.driver_name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Driver Phone:</Text>
                    <Text style={styles.value}>{invoice.driver_phone}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Vechical No:</Text>
                    <Text style={styles.value}>{invoice.vehicle_no}</Text>
                  </View>
                </View>

                {/* Godown Supervisor */}
                <View style={[styles.borderBox, styles.column]}>
                  <Text style={styles.sectionTitle}>Authority:</Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Warehouse Supervisor:</Text>
                    <Text style={styles.value}>{invoice.warehouse_supervisor.name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Godown Supervisor:</Text>
                    <Text style={styles.value}>{invoice.godown_supervisor.name}</Text>
                  </View>
                </View>
              </View>

              {/* Godowns Information */}
              <View style={styles.borderBox}>
                <Text style={styles.sectionTitle}>Stock Godowns Details :</Text>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}> ShadeNo</Text>
                    <Text style={styles.tableCell}>PurShadeNo</Text>
                    <Text style={styles.tableCell}>Ware Code</Text>
                    <Text style={styles.tableCell}>Stock Code</Text>
                    <Text style={styles.tableCell}>Lot No</Text>
                    <Text style={styles.tableCell}>Width</Text>
                    <Text style={styles.tableCell}>Length</Text>
                    <Text style={styles.tableCell}>Pcs</Text>
                    <Text style={styles.tableCell}>Quantity</Text>
                  </View>
                  {invoice.all_stocks.map((all_stock, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{all_stock.products_shadeNo}</Text>
                      <Text style={styles.tableCell}>{all_stock.products_purchase_shade_no}</Text>
                      <Text style={styles.tableCell}>{all_stock.stockin_code}</Text>
                      <Text style={styles.tableCell}>{all_stock.stock_code}</Text>
                      <Text style={styles.tableCell}>{all_stock.lot_no}</Text>
                      <Text style={styles.tableCell}>
                        {all_stock.width} {all_stock.width_unit}
                      </Text>
                      <Text style={styles.tableCell}>
                        {all_stock.length} {all_stock.length_unit}
                      </Text>
                      <Text style={styles.tableCell}>{all_stock.pcs ?? 1}</Text>
                      <Text style={styles.tableCell}>{all_stock.quantity}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Total Section */}
              <View style={styles.totalSection}>
                <View style={styles.row}>
                  <Text style={styles.label}>Total Quantity:</Text>
                  <Text style={styles.value}>{invoice.all_stocks.reduce((total, all_stock) => total + all_stock.quantity, 0)}</Text>
                </View>
              </View>
              <View style={styles.footerColumns}>
                <View style={styles.footerColumn}>
                  <Text style={styles.sectionTitle}>Terms & Conditions</Text>
                  <Text style={styles.termsText}>1. Goods once sold will not be taken back</Text>
                  <Text style={styles.termsText}>2. Interest @18% p.a. will be charged if payment is delayed</Text>
                  <Text style={styles.termsText}>3. Subject to local jurisdiction</Text>
                  <Text style={styles.termsText}>4. E.&O.E.</Text>
                </View>
                <View style={styles.footerColumn}>
                  <View style={styles.signatureBox} />
                  <Text style={styles.signatureText}>Supplier's Signature</Text>
                  <Text style={styles.signatureText}>With Stamp</Text>
                </View>
                <View style={styles.footerColumn}>
                  <View style={styles.signatureBox} />
                  <Text style={styles.signatureText}>Receiver's Signature</Text>
                  <Text style={styles.signatureText}>With Stamp</Text>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </Modal.Body>
    </Modal>
  );
};

export default PdfPreview;
