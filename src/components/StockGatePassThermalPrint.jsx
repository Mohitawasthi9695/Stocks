import React from 'react';
import { Modal } from 'react-bootstrap';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 5,
        fontFamily: 'Courier',
        fontSize: 8, // Optimized for thermal printing
    },
    centerText: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 10,
    },
    separator: {
        borderBottom: '1pt dashed black',
        marginVertical: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    tableHeader: {
        flexDirection: 'row',
        fontWeight: 'bold',
        paddingVertical: 2,
        borderBottom: '1pt solid black',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '0.5pt dashed black',
        paddingVertical: 2,
    },
    cell: {
        flex: 1,
        textAlign: 'left',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 7,
        marginTop: 5,
    },
});

const StockGatePassThermalPrint = ({ show, onHide, invoiceData, id }) => {
    const invoice = invoiceData.find((invoice) => invoice.id === id);
    if (!invoice) return null;

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
                            {/* Header */}
                            <Text style={styles.centerText}>STOCK IN GATE PASS</Text>
                            <View style={styles.separator} />

                            {/* Gate Pass Details */}
                            <View>
                                <View style={styles.row}>
                                    <Text>Gate Pass No:</Text>
                                    <Text>{invoice.gate_pass_no}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text>Date:</Text>
                                    <Text>{invoice.gate_pass_date}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text>Status:</Text>
                                    <Text>{invoice.status === 0 ? 'Pending' : 'Completed'}</Text>
                                </View>
                            </View>
                            <View style={styles.separator} />

                            {/* Transport Information */}
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>Transport Details</Text>
                                <View style={styles.row}>
                                    <Text>Driver:</Text>
                                    <Text>{invoice.driver_name}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text>Phone:</Text>
                                    <Text>{invoice.driver_phone}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text>Vehicle No:</Text>
                                    <Text>{invoice.vehicle_no}</Text>
                                </View>
                            </View>
                            <View style={styles.separator} />

                            {/* Authority Information */}
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>Authority</Text>
                                <View style={styles.row}>
                                    <Text>Warehouse Sup:</Text>
                                    <Text>{invoice.warehouse_supervisor.name}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text>Godown Sup:</Text>
                                    <Text>{invoice.godown_supervisor.name}</Text>
                                </View>
                            </View>
                            <View style={styles.separator} />

                            {/* Stock Table */}
                            <Text style={{ fontWeight: 'bold' }}>Stock Details</Text>
                            <View style={styles.tableHeader}>
                                <Text style={styles.cell}>Shade</Text>
                                <Text style={styles.cell}>Lot</Text>
                                <Text style={styles.cell}>Qty</Text>
                            </View>

                            {invoice.all_stocks.map((all_stock, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.cell}>{all_stock.products_shadeNo}</Text>
                                    <Text style={styles.cell}>{all_stock.lot_no}</Text>
                                    <Text style={styles.cell}>{all_stock.quantity}</Text>
                                </View>
                            ))}
                            <View style={styles.separator} />

                            {/* Total Quantity */}
                            <View style={styles.row}>
                                <Text style={{ fontWeight: 'bold' }}>Total Quantity:</Text>
                                <Text>{invoice.all_stocks.reduce((total, all_stock) => total + all_stock.quantity, 0)}</Text>
                            </View>

                            {/* Footer */}
                            <View>
                                
                                <Text style={styles.footerText}>Thank you.</Text>
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            </Modal.Body>
        </Modal>
    );
};

export default StockGatePassThermalPrint;
