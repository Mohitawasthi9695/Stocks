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
    width: '40%',
    marginTop: 10
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
  qrCode: {
    width: 100,
    height: 100,
    border: '1pt solid black',
    alignSelf: 'center'
  },
  signatureBox: {
    height: 60,
    borderBottom: '1pt solid black',
    marginBottom: 5
  },
  signatureText: {
    fontSize: 8,
    textAlign: 'center'
  },

});

const PdfPreview = ({ show, onHide, invoiceData, id }) => {
  const invoice = invoiceData.find((invoice) => invoice.id === id);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Invoice PDF</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: '80vh' }}>
        <PDFViewer width="100%" height="100%">
          <Document>
            <Page size="A4" style={styles.page}>
              <Text style={styles.header}>STOCK IN INVOICE</Text>

              <View style={styles.flexContainer}>
                <View style={[styles.borderBox, styles.column]}>
                  <Text style={styles.sectionTitle}>Supplier Details:</Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{invoice.supplier.name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>GST No:</Text>
                    <Text style={styles.value}>{invoice.supplier.gst_no}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>CIN No:</Text>
                    <Text style={styles.value}>{invoice.supplier.cin_no}</Text>
                  </View>
                </View>

                <View style={[styles.borderBox, styles.column]}>
                  <Text style={styles.sectionTitle}>Invoice Details:</Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Invoice No:</Text>
                    <Text style={styles.value}>{invoice.invoice_no}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{invoice.date}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Ack No:</Text>
                    <Text style={styles.value}>{invoice.ack_no}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.borderBox, styles]}>
                <View style={styles.flexContainer}>
                  <View style={styles.column}>
                    <Text style={styles.sectionTitle}>Transport Details:</Text>
                    <View style={styles.row}>
                      <Text style={styles.label}>E-way Bill:</Text>
                      <Text style={styles.value}>{invoice.ewaybill}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Transport:</Text>
                      <Text style={styles.value}>{invoice.transport}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Vehicle No:</Text>
                      <Text style={styles.value}>{invoice.vehicle_no}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Agent Name</Text>
                      <Text style={styles.value}>{invoice.agent}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>WareHouse</Text>
                      <Text style={styles.value}>{invoice.warehouse}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Place:</Text>
                      <Text style={styles.value}>{invoice.place_of_supply}</Text>
                    </View>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.sectionTitle}>WareHouse Supervisor:</Text>
                    <View style={styles.row}>
                      <Text style={styles.label}>UserName:</Text>
                      <Text style={styles.value}>{invoice.user.name}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Number:</Text>
                      <Text style={styles.value}>{invoice.user.phone}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.borderBox}>
                <Text style={styles.sectionTitle}>Products:</Text>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>ShadeNo</Text>
                    <Text style={styles.tableCell}>Purchase ShadeNo</Text>
                    <Text style={styles.tableCell}>Total Products</Text>
                    <Text style={styles.tableCell}>Product Type</Text>
                    <Text style={styles.tableCell}>HSN/SAC</Text>
                    <Text style={styles.tableCell}>Quantity</Text>
                    <Text style={styles.tableCell}>Unit</Text>
                    <Text style={styles.tableCell}>Rate</Text>
                    <Text style={styles.tableCell}>Amount</Text>
                  </View>
                  {/* {invoice.products.map((product, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{product.product.shadeNo ?? '-'}</Text>
                      <Text style={styles.tableCell}>{product.product.purchase_shade_no ?? '-'}</Text>
                      <Text style={styles.tableCell}>{product.total_product ?? '-'}</Text>
                      <Text style={styles.tableCell}>{product.product_type ?? '-'}</Text>
                      <Text style={styles.tableCell}>{product.hsn_sac_code ?? '-'}</Text>
                      <Text style={styles.tableCell}>{Number(product.quantity).toFixed(2) ?? '-'}</Text>
                      <Text style={styles.tableCell}>{product.unit ?? '-'}</Text>(2)
                      <Text style={styles.tableCell}>{Number(product.rate).toFixed(2) ?? '-'}</Text>
                      <Text style={styles.tableCell}>{Number(product.amount).toFixed(2) ?? '-'}</Text>
                    </View>
                  ))} */}
                </View>

                <View style={styles.totalSection}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Total Amount:</Text>
                    <Text style={styles.value}>₹{invoice.total_amount}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>CGST ({invoice.cgst_percentage}%):</Text>
                    <Text style={styles.value}>₹{((invoice.total_amount * invoice.cgst_percentage) / 100).toFixed(2)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>SGST ({invoice.sgst_percentage}%):</Text>
                    <Text style={styles.value}>₹{((invoice.total_amount * invoice.sgst_percentage) / 100).toFixed(2)}</Text>
                  </View>
                  <View style={[styles.row, { borderTop: '1pt solid black', marginTop: 5, paddingTop: 5 }]}>
                    <Text style={styles.label}>Grand Total:</Text>
                    <Text style={styles.value}>
                      ₹ {
                        (() => {
                          // Parse the values to make sure they are numbers
                          const totalAmount = parseFloat(invoice.total_amount);
                          const cgstPercentage = parseFloat(invoice.cgst_percentage);
                          const sgstPercentage = parseFloat(invoice.sgst_percentage);

                          // Check if the values are valid numbers
                          if (isNaN(totalAmount) || isNaN(cgstPercentage) || isNaN(sgstPercentage)) {
                            console.error('Invalid data:', { totalAmount, cgstPercentage, sgstPercentage });
                            return 'Invalid Data';
                          }

                          // Calculate Grand Total
                          const grandTotal = totalAmount * (1 + (cgstPercentage + sgstPercentage) / 100);
                          return `₹${grandTotal.toFixed(2)}`;
                        })()
                      }
                    </Text>
                  </View>
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

                {/* <View style={styles.footerColumn}>
                  <View style={styles.qrCode} />
                  <Text style={styles.signatureText}>Invoice QR Code</Text>
                </View> */}
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
