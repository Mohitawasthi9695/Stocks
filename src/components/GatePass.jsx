import React from 'react';
import { Modal } from 'react-bootstrap';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  borderBox: {
    border: '1pt solid black',
    marginBottom: 10,
    padding: 8
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    flex: 1,
    padding: 5
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    padding: 4
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4
  },
  label: {
    width: 100,
    fontWeight: 'bold'
  },
  value: {
    flex: 1
  },
  table: {
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottom: '1pt solid black',
    borderTop: '1pt solid black',
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #ccc',
    minHeight: 20
  },
  tableCell: {
    padding: 4,
    textAlign: 'center',
    flex: 1,
    borderLeft: '0.5pt solid #ccc',
    borderRight: '0.5pt solid #ccc'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30
  },
  totalSection: {
    marginLeft: 'auto',
    width: '40%'
  },
  footerColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderTop: '1pt solid black',
    paddingTop: 10
  },
  footerColumn: {
    width: '30%',
    padding: 5
  },
  termsText: {
    fontSize: 8,
    marginBottom: 3
  },
  signatureBox: {
    height: 60,
    borderBottom: '1pt solid black',
    marginBottom: 5
  },
  signatureText: {
    fontSize: 8,
    textAlign: 'center'
  }
});

const GatePass = ({ show, onHide, invoiceData, id }) => {
  const invoice = invoiceData.find((invoice) => invoice.id === id);
  console.log(invoice.godown_accessories);

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
                    <Text style={styles.value}>{invoice.status == 0 ? 'Pending' : 'Approved'}</Text>
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
                    <Text style={styles.value}>{invoice.warehouse_supervisors.name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Godown Supervisor:</Text>
                    <Text style={styles.value}>{invoice.godown_supervisors.name}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.borderBox}>
                <Text style={styles.sectionTitle}>Godown Accessories:</Text>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>Lot No</Text>
                    <Text style={styles.tableCell}>Accessory Name</Text>
                    <Text style={styles.tableCell}>Warehouse Acc. Code</Text>
                    <Text style={styles.tableCell}>Godown Acc. Code</Text>
                    <Text style={styles.tableCell}>Length</Text>
                    <Text style={styles.tableCell}>Items</Text>
                    <Text style={styles.tableCell}>Box Bundle</Text>
                    <Text style={styles.tableCell}>Quantity</Text>
                  </View>
                  {invoice.godown_accessories.map((accessory, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{accessory.lot_no}</Text>
                      <Text style={styles.tableCell}>{accessory.accessory?.accessory_name}</Text>
                      <Text style={styles.tableCell}>{accessory.warehouse_accessory.stock_code}</Text>
                      <Text style={styles.tableCell}>{accessory.stock_code}</Text>
                      <Text style={styles.tableCell}>
                        {accessory.length}
                        {accessory.length_unit}
                      </Text>
                      <Text style={styles.tableCell}>{accessory.items}</Text>
                      <Text style={styles.tableCell}>{accessory.box_bundle}</Text>
                      <Text style={styles.tableCell}>{accessory.quantity}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </Modal.Body>
    </Modal>
  );
};

export default GatePass;
