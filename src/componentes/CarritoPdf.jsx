import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { styles } from './CarritoPDFStyles'; // Asegúrate de que este archivo está en la misma carpeta

const CarritoPDF = ({ productosGenerales, productosRebajados, total }) => {
  
  // --- PROTECCIÓN CONTRA ERRORES ---
  // Si los datos llegan vacíos o undefined, usamos arrays vacíos para que no explote.
  const listaGenerales = productosGenerales || [];
  const listaRebajados = productosRebajados || [];
  const totalFinal = total || 0;

  // Fecha y hora actual para aspecto técnico
  const fecha = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', month: '2-digit', day: '2-digit' 
  });
  const hora = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', minute: '2-digit' 
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>SYNAPSES</Text>
            <Text style={{ fontSize: 8, marginTop: 2 }}>RESUMEN DE PEDIDO // CONFIGURACIÓN</Text>
          </View>
          <View style={styles.headerDetails}>
            <Text style={styles.date}>FECHA: {fecha}</Text>
            <Text style={styles.date}>HORA: {hora}</Text>
          </View>
        </View>
        <View style={styles.headerLine} /> {/* Línea divisoria negra */}<View style={styles.header}>
          <View>
            <Text style={styles.title}>SYNAPSES</Text>
            <Text style={{ fontSize: 10, marginTop: 4, fontFamily: 'Helvetica' }}>
              RESUMEN DE PEDIDO // CONFIGURACIÓN
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.date}>FECHA: {fecha}</Text>
            <Text style={[styles.date, { marginTop: 2 }]}>HORA: {hora}</Text>
          </View>
        </View>

        {/* --- SECCIÓN PRODUCTOS ESTÁNDAR --- */}
        {listaGenerales.length > 0 && (
          <View style={styles.sectionGenerales}>
            <Text style={styles.sectionTitle}>MODELOS ESTÁNDAR</Text>
            {listaGenerales.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.columnName}>{item.nombre}</Text>
                <Text style={styles.columnQty}>x{item.cantidad || 1}</Text>
                <Text style={styles.columnPrice}>
                  {(Number(item.precio) * (item.cantidad || 1)).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* --- SECCIÓN OFERTAS (ROJA) --- */}
        {listaRebajados.length > 0 && (
          <View style={styles.sectionRebajas}>
            <Text style={[styles.sectionTitle, { color: '#ff4757' }]}>OFERTAS APLICADAS</Text>
            {listaRebajados.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.columnName}>{item.nombre}</Text>
                <Text style={styles.columnQty}>x{item.cantidad || 1}</Text>
                <Text style={[styles.columnPrice, { color: '#ff4757' }]}>
                  {(Number(item.precio) * (item.cantidad || 1)).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* --- TOTAL --- */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>TOTAL ESTIMADO (IMPUESTOS INCL.)</Text>
          <Text style={styles.totalAmount}>
             {Number(totalFinal).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
          </Text>
        </View>

        {/* --- FOOTER --- */}
        <View style={styles.footerNoteContainer}>
          <Text style={styles.footerNoteText}>
            DOCUMENTO INFORMATIVO GENERADO AUTOMÁTICAMENTE POR SYNAPSES.
          </Text>
          <Text style={[styles.footerNoteText, { marginTop: 4 }]}>
            LOS PRECIOS Y LA DISPONIBILIDAD ESTÁN SUJETOS A CAMBIOS. NO VÁLIDO COMO FACTURA FINAL.
          </Text>
          
          <Text 
            style={{ fontSize: 8, color: '#bdc3c7', marginTop: 15, textAlign: 'center', fontFamily: 'Helvetica' }}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
            fixed 
          />
        </View>

      </Page>
    </Document>
  );
};

export default CarritoPDF;