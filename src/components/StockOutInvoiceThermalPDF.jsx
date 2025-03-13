import React from 'react';
import { Modal } from 'react-bootstrap';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 10,
        fontFamily: 'Courier',
        fontSize: 10,
    },
    centerText: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    section: {
        marginBottom: 5,
    },
    separator: {
        borderBottom: '1pt dashed black',
        marginVertical: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        fontWeight: 'bold',
        padding: 2,
        backgroundColor: '#e0e0e0',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '0.5pt dashed black',
        padding: 2,
    },
    cell: {
        flex: 1,
        textAlign: 'left',
    },
});

const ThermalInvoice = ({ show, onHide, invoiceData, id }) => {
    const invoice = invoiceData.find((invoice) => invoice.id === id);
    if (!invoice) return null;

    // Calculate totals
    const totalAmount = invoice.stock_out_details.reduce((sum, detail) => sum + parseFloat(detail.amount || 0), 0);
    const calculateGST = (percentage) => ((totalAmount * percentage) / 100).toFixed(2);
    const cgstAmount = calculateGST(invoice.cgst_percentage);
    const sgstAmount = calculateGST(invoice.sgst_percentage);
    const grandTotal = (parseFloat(totalAmount) + parseFloat(cgstAmount) + parseFloat(sgstAmount)).toFixed(2);

    return (
        <Modal show={show} onHide={onHide} size="sm" backdrop="static" keyboard={true}>
            <Modal.Header>
    <Modal.Title>Print Invoice</Modal.Title>
    <button type="button" className="btn-close" onClick={onHide}></button>
</Modal.Header>

            <Modal.Body style={{ height: '80vh' }}>
                <PDFViewer width="100%" height="100%">
                    <Document>
                        <Page size={{ width: 226, height: 'auto' }} style={styles.page}>
                            <Text style={styles.centerText}>STOCK OUT INVOICE</Text>
                            <View style={styles.separator} />

                            {/* Invoice Details */}
                            <View style={styles.section}>
                                <Text>Invoice No: {invoice.invoice_no}</Text>
                                <Text>Date: {invoice.date}</Text>
                                <Text>Customer: {invoice.customer}</Text>
                                <Text>Company: {invoice.company}</Text>
                            </View>
                            <View style={styles.separator} />

                            {/* Transport Details */}
                            <View style={styles.section}>
                                <Text>Vehicle: {invoice.vehicle_no}</Text>
                                <Text>Transport: {invoice.transport || '-'}</Text>
                                <Text>Station: {invoice.station}</Text>
                            </View>
                            <View style={styles.separator} />

                            {/* Table Header */}
                            <Text style={styles.centerText}>Items</Text>
                            <View style={styles.tableHeader}>
                                <Text style={styles.cell}>Name</Text>
                                <Text style={styles.cell}>Qty</Text>
                                <Text style={styles.cell}>Rate</Text>
                                <Text style={styles.cell}>Total</Text>
                            </View>

                            {/* Table Rows */}
                            {invoice.stock_out_details.map((detail, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.cell}>{detail.product_name}</Text>
                                    <Text style={styles.cell}>{detail.out_pcs}</Text>
                                    <Text style={styles.cell}>{detail.rate}</Text>
                                    <Text style={styles.cell}>{detail.amount}</Text>
                                </View>
                            ))}
                            <View style={styles.separator} />

                            {/* Totals */}
                            <View style={styles.section}>
                                <Text>Total: ₹ {totalAmount.toFixed(2)}</Text>
                                <Text>CGST ({invoice.cgst_percentage}%): ₹ {cgstAmount}</Text>
                                <Text>SGST ({invoice.sgst_percentage}%): ₹ {sgstAmount}</Text>
                                <Text>Grand Total: ₹ {grandTotal}</Text>
                            </View>
                            <View style={styles.separator} />

                            <Text style={styles.centerText}>Thank You!</Text>
                        </Page>
                    </Document>
                </PDFViewer>
            </Modal.Body>
        </Modal>
    );
};

export default ThermalInvoice;
