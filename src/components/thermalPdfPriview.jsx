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
      window.print(); // Print using normal printer
    } else {
      printThermalReceipt(); // Print using a thermal printer
    }
  };
  //   const printThermalReceipt = () => {
  //     let receiptContent = `
  //       ==================================
  //                VISHAL HiTech
  //           GSTIN: ${invoice.supplier.gst_no}
  //           CIN No: ${invoice.supplier.cin_no}
  //       ==================================
  //       INVOICE DETAILS
  //       ----------------------------------
  //       Invoice No: ${invoice.invoice_no}
  //       Date: ${invoice.date}
  //       ACK No:${invoice.ack_no}

  //       SUPPLIER DETAILS
  //       ----------------------------------
  //       Name: ${invoice.supplier.name}
  //       GSTIN: ${invoice.supplier.gst_no}
  //       CIN No: ${invoice.supplier.cin_no}

  //       WAREHOUSE SUPERVISOR
  //       ----------------------------------
  //       Name: ${invoice.user.name}
  //       Number:${invoice.user.phone}

  //       TRANSPORT DETAILS
  //       ----------------------------------
  //       E-way Bill:${invoice.ewaybill}
  //       Transport Name: ${invoice.transport.transport}
  //       Vehicle No: ${invoice.transport.vehicle_no}
  //       Agent Name: ${invoice.agent}
  //       Warehouse:${invoice.warehouse}
  //       Place:${invoice.place_of_supply}

  //       ----------------------------------

  //       PRODUCTS
  //       ----------------------------------
  //       | No | Category  | Shade  | Qty | PCS | Unique Shade No | Quantity |
  //     `;

  //     const shadeQuantityMap = invoice.stock_in.reduce((acc, item) => {
  //       const shadeNo = item.products.shadeNo;
  //       acc[shadeNo] = (acc[shadeNo] || 0) + item.quantity;
  //       return acc;
  //     }, {});

  //     invoice.stock_in.forEach((item, index) => {
  //       receiptContent += `
  //         | ${index + 1} | ${item.products.product_category.product_category} | ${item.products.shadeNo} | ${item.quantity} | ${item.pcs} | ${item.products.shadeNo} | ${shadeQuantityMap[item.products.shadeNo]} |`;
  //     });

  //     receiptContent += `
  //       ----------------------------------
  //       TOTAL QUANTITY: ${totalQuantity}
  //       SUBTOTAL: ₹${invoice.subtotal}
  //       GST (${invoice.gst_rate}%): ₹${invoice.gst_amount}
  //       GRAND TOTAL: ₹${invoice.total_amount}
  //    ----------------------------------
  //       SUPPLIER'S SIGNATURE: ____________

  //       RECEIVER'S SIGNATURE: ____________
  //       ----------------------------------

  //               TERMS & CONDITIONS
  //       ----------------------------------
  //       1. Goods once sold will not be taken back.
  //       2. Interest @18% p.a. will be charged if payment is delayed.
  //       3. Subject to local jurisdiction.
  //       4. E.&O.E.

  //       ----------------------------------
  //         Thank You for Your Business!
  //       ==================================
  //     `;
  //     const printWindow = window.open('', '', 'width=300,height=600');
  //     printWindow.document.write(`<pre>${receiptContent}</pre>`);
  //     printWindow.document.close();
  //     printWindow.print();
  //     printWindow.close();
  //   };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Invoice PDF</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: '80vh' }}>
        <PDFViewer width="100%" height="100%">
          <Document>
            <Page size="A4" style={styles.page}>
              <Text style={styles.watermark}>VISHAL HiTech</Text>
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
                      <Text style={styles.label}>Agent Name:</Text>
                      <Text style={styles.value}>{invoice.agent}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Warehouse:</Text>
                      <Text style={styles.value}>{invoice.warehouse}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Place:</Text>
                      <Text style={styles.value}>{invoice.place_of_supply}</Text>
                    </View>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.sectionTitle}>Warehouse Supervisor:</Text>
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

              <View style={[styles.borderBox, { marginTop: 10 }]}>
                <Text style={styles.sectionTitle}>Products:</Text>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>Sr.no</Text>
                    <Text style={styles.tableCell}>Category</Text>
                    <Text style={styles.tableCell}>ShadeNo</Text>
                    <Text style={styles.tableCell}>Lot No</Text>
                    <Text style={styles.tableCell}>Length</Text>
                    <Text style={styles.tableCell}>Width</Text>
                    <Text style={styles.tableCell}>Quantity</Text>
                    <Text style={styles.tableCell}>PCS</Text>
                    <Text style={[styles.tableCell, { backgroundColor: '#7fc9b2', paddingTop: '5px' }]}>
                      Unique <br /> Shade No.
                    </Text>
                    <Text style={[styles.tableCell, { backgroundColor: '#7fc9b2', paddingTop: '5px' }]}>
                      Total <br /> Qty
                    </Text>
                  </View>
                  {invoice.stock_in.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{index + 1}</Text>
                      <Text style={styles.tableCell}>{item.products.product_category.product_category}</Text>
                      <Text style={styles.tableCell}>{item.products.shadeNo}</Text>
                      <Text style={styles.tableCell}>{item.lot_no}</Text>
                      <Text style={styles.tableCell}>{`${item.length}\n${item.length_unit}`}</Text>
                      <Text style={styles.tableCell}>{`${item.width}\n${item.width_unit}`}</Text>
                      <Text style={styles.tableCell}>{item.quantity}</Text>
                      <Text style={styles.tableCell}>{item.pcs}</Text>
                      <Text style={[styles.tableCell, { backgroundColor: '#7fc9b2', paddingTop: '5px' }]}>
                        {uniqueShadeNumbers[index] || ''}
                      </Text>
                      <Text style={[styles.tableCell, { backgroundColor: '#7fc9b2', paddingTop: '5px' }]}>
                        {totalQuantityByShadeArray[index] !== undefined ? totalQuantityByShadeArray[index] : ''}
                      </Text>
                    </View>
                  ))}
                </View>

                <view
                  style={{
                    paddingTop: '10px'
                  }}
                >
                  <View style={styles.row}>
                    <Text
                      style={{
                        paddingRight: '20px'
                      }}
                    >
                      Total Quantity:
                    </Text>
                    <Text>{totalQuantity}</Text>
                  </View>
                </view>

                <View style={styles.totalSection}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Total Amount:</Text>
                    <Text style={styles.value}>₹{invoice.total_amount}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>CGST ({invoice.cgst_percentage}%):</Text>
                    <Text style={styles.value}>
                      ₹{((parseFloat(invoice.total_amount) * parseFloat(invoice.cgst_percentage)) / 100).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>SGST ({invoice.sgst_percentage}%):</Text>
                    <Text style={styles.value}>
                      ₹{((parseFloat(invoice.total_amount) * parseFloat(invoice.sgst_percentage)) / 100).toFixed(2)}
                    </Text>
                  </View>
                  <View style={[styles.row, { borderTop: '1pt solid black', marginTop: 5, paddingTop: 5 }]}>
                    <Text style={styles.label}>Grand Total:</Text>
                    <Text style={styles.value}>
                      ₹
                      {(
                        parseFloat(invoice.total_amount) *
                        (1 + (parseFloat(invoice.cgst_percentage) + parseFloat(invoice.sgst_percentage)) / 100)
                      ).toFixed(2)}
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
