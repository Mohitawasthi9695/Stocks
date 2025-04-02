import React from 'react';
import { Modal } from 'react-bootstrap';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const PdfPreview = ({ show, onHide, invoiceData, id }) => {
  const invoice = invoiceData.find((invoice) => invoice.id === id);
  const [printMode, setPrintMode] = React.useState('normal');

  const uniqueShadeNumbers = [...new Set(invoice.stock_in.map((item) => item.products.shadeNo))];
  const totalQuantity = invoice.stock_in.reduce((sum, item) => sum + item.quantity, 0);

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

  const printThermalReceipt = () => {
    let receiptContent = `
==================================
           VISHAL HiTech
      GSTIN: ${invoice.supplier.gst_no}
      CIN No: ${invoice.supplier.cin_no}
==================================

INVOICE DETAILS
----------------------------------
Invoice No:  ${invoice.invoice_no}
Date:        ${invoice.date}
ACK No:      ${invoice.ack_no}

SUPPLIER DETAILS
----------------------------------
Name:        ${invoice.supplier.name}
GSTIN:       ${invoice.supplier.gst_no}
CIN No:      ${invoice.supplier.cin_no}

WAREHOUSE SUPERVISOR
----------------------------------
Name:        ${invoice.user.name}
Number:      ${invoice.user.phone}

TRANSPORT DETAILS
----------------------------------
E-way Bill:  ${invoice.ewaybill}
Transport:   ${invoice.transport.transport}
Vehicle No:  ${invoice.transport.vehicle_no}
Agent:       ${invoice.agent}
Warehouse:   ${invoice.warehouse}
Place:       ${invoice.place_of_supply}

----------------------------------
PRODUCTS
----------------------------------
| No | Category | Shade  | Qty | PCS |
----------------------------------
`;

    invoice.stock_in.forEach((item, index) => {
        receiptContent += `| ${index + 1}  | ${item.products.product_category.product_category.padEnd(8)} | ${item.products.shadeNo.padEnd(6)} | ${item.quantity.toString().padEnd(3)} | ${item.pcs.toString().padEnd(3)} |\n`;
    });

    receiptContent += `
----------------------------------
TOTAL QUANTITY:  ${totalQuantity}
SUBTOTAL:       ₹${invoice.subtotal}
GST (${invoice.gst_rate}%):  ₹${invoice.gst_amount}
GRAND TOTAL:    ₹${invoice.total_amount}
----------------------------------

SUPPLIER'S SIGNATURE: ____________

RECEIVER'S SIGNATURE: ____________
----------------------------------

       TERMS & CONDITIONS
----------------------------------
1. Goods once sold will not be taken back.
2. Interest @18% p.a. will be charged if payment is delayed.
3. Subject to local jurisdiction.
4. E.&O.E.
----------------------------------
   Thank You for Your Business!
==================================
`;

    const printWindow = window.open('', '', 'width=150,height=600');
    printWindow.document.write(`<pre>${receiptContent}</pre>`);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

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

              <View style={styles.section}>
                <Text style={styles.bold}>Supplier Details:</Text>
                <Text>Name: {invoice.supplier.name}</Text>
                <Text>GST No: {invoice.supplier.gst_no}</Text>
                <Text>CIN No: {invoice.supplier.cin_no}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.bold}>Invoice Details:</Text>
                <Text>Invoice No: {invoice.invoice_no}</Text>
                <Text>Date: {invoice.date}</Text>
                <Text>Ack No: {invoice.ack_no}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.bold}>Transport Details:</Text>
                <Text>E-way Bill: {invoice.ewaybill}</Text>
                <Text>Transport: {invoice.transport}</Text>
                <Text>Vehicle No: {invoice.vehicle_no}</Text>
                <Text>Agent: {invoice.agent}</Text>
              </View>

              <Text style={styles.bold}>Products:</Text>
              {invoice.stock_in.map((item, index) => (
                <Text key={index}>
                  {index + 1}. {item.products.product_category.product_category} - {item.products.shadeNo} - {item.quantity} pcs
                </Text>
              ))}

              <Text>Total Quantity: {totalQuantity}</Text>
              <Text>Total Amount: ₹{invoice.total_amount}</Text>

              <Text style={styles.footer}>Thank You for Your Business!</Text>
            </Page>
          </Document>
        </PDFViewer>
      </Modal.Body>
    </Modal>
  );
};

export default PdfPreview;
