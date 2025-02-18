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
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        backgroundColor: '#f0f0f0',
        padding: 4
    },
    table: {
        marginTop: 10
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottom: '1pt solid black',
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
    }
});

const StockOutInvoicePDF = ({ show, onHide, invoiceData, id }) => {
    const invoice = invoiceData.find((invoice) => invoice.id === id);
    if (!invoice) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Stock Out Invoice</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '80vh' }}>
                <PDFViewer width="100%" height="100%">
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <Text style={styles.header}>Stock Out Invoice</Text>

                            <View>
                                <Text>Invoice No: {invoice.invoice_no}</Text>
                                <Text>Date: {invoice.date}</Text>
                                <Text>Customer: {invoice.customer}</Text>
                                <Text>Receiver: {invoice.receiver}</Text>
                                <Text>Vehicle No: {invoice.vehicle_no}</Text>
                            </View>

                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.tableCell}>Product Name</Text>
                                    <Text style={styles.tableCell}>Shade No</Text>
                                    <Text style={styles.tableCell}>Stock Code</Text>
                                    <Text style={styles.tableCell}>Category</Text>
                                    <Text style={styles.tableCell}>Width</Text>
                                    <Text style={styles.tableCell}>Length</Text>
                                    <Text style={styles.tableCell}>Pcs</Text>
                                    <Text style={styles.tableCell}>Rate</Text>
                                    <Text style={styles.tableCell}>Amount</Text>
                                </View>
                                {invoice.stock_out_details.map((detail, index) => (
                                    <View key={index} style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{detail.product_name}</Text>
                                        <Text style={styles.tableCell}>{detail.product_shadeNo}</Text>
                                        <Text style={styles.tableCell}>{detail.stock_code}</Text>
                                        <Text style={styles.tableCell}>{detail.product_category}</Text>
                                        <Text style={styles.tableCell}>{detail.out_width} {detail.width_unit}</Text>
                                        <Text style={styles.tableCell}>{detail.out_length} {detail.length_unit}</Text>
                                        <Text style={styles.tableCell}>{detail.rate}</Text>
                                        <Text style={styles.tableCell}>{detail.out_pcs}</Text>
                                        <Text style={styles.tableCell}>{detail.amount}</Text>
                                    </View>
                                ))}
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            </Modal.Body>
        </Modal>
    );
};

export default StockOutInvoicePDF;
