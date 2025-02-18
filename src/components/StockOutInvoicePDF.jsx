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
        justifyContent: 'space-between',
        marginBottom: 15
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
        marginTop: 10,
        marginBottom: 15
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
        minHeight: 24
    },
    tableCell: {
        padding: 4,
        textAlign: 'center',
        flex: 1,
        borderLeft: '0.5pt solid #ccc',
        borderRight: '0.5pt solid #ccc',
        fontSize: 9
    },
    totalSection: {
        marginLeft: 'auto',
        width: '40%',
        marginTop: 15,
        borderTop: '1pt solid black',
        paddingTop: 10
    },
    footerSection: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30
    },
    footerColumns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        borderTop: '1pt solid black',
        paddingTop: 10
    },
    footerColumn: {
        width: '30%'
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
    termsText: {
        fontSize: 8,
        marginBottom: 3
    }
});

const StockOutInvoicePDF = ({ show, onHide, invoiceData, id }) => {
    const invoice = invoiceData.find((invoice) => invoice.id === id);
    if (!invoice) return null;

    const calculateTotal = () => {
        return invoice.stock_out_details.reduce((sum, detail) => sum + parseFloat(detail.amount), 0).toFixed(2);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Stock Out Invoice</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '80vh' }}>
                <PDFViewer width="100%" height="100%">
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <Text style={styles.header}>STOCK OUT INVOICE</Text>

                            <View style={styles.flexContainer}>
                                {/* Invoice Details */}
                                <View style={[styles.borderBox, styles.column]}>
                                    <Text style={styles.sectionTitle}>Invoice Details</Text>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Invoice No:</Text>
                                        <Text style={styles.value}>{invoice.invoice_no}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Date:</Text>
                                        <Text style={styles.value}>{invoice.date}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>E-way Bill:</Text>
                                        <Text style={styles.value}>{invoice.ewaybill}</Text>
                                    </View>
                                </View>

                                {/* Customer Details */}
                                <View style={[styles.borderBox, styles.column]}>
                                    <Text style={styles.sectionTitle}>Customer Details</Text>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Customer:</Text>
                                        <Text style={styles.value}>{invoice.customer}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Company:</Text>
                                        <Text style={styles.value}>{invoice.company}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Place:</Text>
                                        <Text style={styles.value}>{invoice.place_of_supply}</Text>
                                    </View>
                                </View>

                                {/* Transport Details */}
                                <View style={[styles.borderBox, styles.column]}>
                                    <Text style={styles.sectionTitle}>Transport Details</Text>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Vehicle No:</Text>
                                        <Text style={styles.value}>{invoice.vehicle_no}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Transport:</Text>
                                        <Text style={styles.value}>{invoice.transport}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Station:</Text>
                                        <Text style={styles.value}>{invoice.station}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Stock Details Table */}
                            <View style={styles.borderBox}>
                                <Text style={styles.sectionTitle}>Stock Details</Text>
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
                                            <Text style={styles.tableCell}>{detail.stock_code || '-'}</Text>
                                            <Text style={styles.tableCell}>{detail.product_category}</Text>
                                            <Text style={styles.tableCell}>{`${detail.out_width} ${detail.width_unit}`}</Text>
                                            <Text style={styles.tableCell}>{`${detail.out_length} ${detail.length_unit}`}</Text>
                                            <Text style={styles.tableCell}>{detail.out_pcs}</Text>
                                            <Text style={styles.tableCell}>{detail.rate}</Text>
                                            <Text style={styles.tableCell}>{detail.amount}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Totals Section */}
                            <View style={styles.totalSection}>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Total Amount:</Text>
                                    <Text style={styles.value}>₹ {calculateTotal()}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>CGST ({invoice.cgst_percentage}%):</Text>
                                    <Text style={styles.value}>₹ {(calculateTotal() * invoice.cgst_percentage / 100).toFixed(2)}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>SGST ({invoice.sgst_percentage}%):</Text>
                                    <Text style={styles.value}>₹ {(calculateTotal() * invoice.sgst_percentage / 100).toFixed(2)}</Text>
                                </View>
                            </View>

                            {/* Footer Section */}
                            <View style={styles.footerSection}>
                                <View style={styles.footerColumns}>
                                    <View style={styles.footerColumn}>
                                        <Text style={styles.sectionTitle}>Terms & Conditions</Text>
                                        <Text style={styles.termsText}>1. Goods once sold will not be taken back</Text>
                                        <Text style={styles.termsText}>2. Interest @18% p.a. will be charged if payment is delayed</Text>
                                        <Text style={styles.termsText}>3. Subject to local jurisdiction</Text>
                                    </View>
                                    <View style={styles.footerColumn}>
                                        <View style={styles.signatureBox} />
                                        <Text style={styles.signatureText}>Authorized Signature</Text>
                                    </View>
                                    <View style={styles.footerColumn}>
                                        <View style={styles.signatureBox} />
                                        <Text style={styles.signatureText}>Customer Signature</Text>
                                    </View>
                                </View>
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            </Modal.Body>
        </Modal>
    );
};

export default StockOutInvoicePDF;