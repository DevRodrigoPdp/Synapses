import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  // --- CONFIGURACIÓN DE PÁGINA ---
  page: { 
    padding: 40, 
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    color: '#000000'
  },

  // --- CABECERA ESTILO SYNAPSES ---
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  title: { 
    fontSize: 24, 
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -1
  },
  headerDetails: {
    textAlign: 'right',
  },
  date: { 
    fontSize: 8, 
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  headerLine: {
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    marginTop: 10,
    marginBottom: 30
  },

  // --- SECCIONES CON BARRA LATERAL ---
  // Modelos estándar (Barra negra)
  sectionGenerales: {
    marginTop: 20,
    backgroundColor: '#fbfbfb',
    borderLeftWidth: 4,
    borderLeftColor: '#000000',
    padding: 15,
    paddingLeft: 20,
  },
  // Ofertas (Barra roja/rosada)
  sectionRebajas: {
    marginTop: 20,
    backgroundColor: '#fff9f9',
    borderLeftWidth: 4,
    borderLeftColor: '#ff4757',
    padding: 15,
    paddingLeft: 20,
  },

  sectionTitle: { 
    fontSize: 9, 
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase', 
    letterSpacing: 1.5, 
    marginBottom: 15,
    color: '#000000'
  },

  // --- FILAS DE PRODUCTOS ---
  tableRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  columnName: { 
    width: '65%', 
    fontSize: 10,
    fontFamily: 'Helvetica-Bold'
  },
  columnQty: { 
    width: '10%', 
    textAlign: 'center', 
    fontSize: 9,
    color: '#7f8c8d'
  },
  columnPrice: { 
    width: '25%', 
    textAlign: 'right', 
    fontSize: 10, 
    fontFamily: 'Helvetica-Bold' 
  },

  // --- CAJA DE TOTAL (BLOQUE NEGRO) ---
  totalContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { 
    color: '#ffffff', 
    fontSize: 10, 
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  totalAmount: { 
    color: '#ffffff', 
    fontSize: 18, 
    fontFamily: 'Helvetica-Bold' 
  },

  // --- PIE DE PÁGINA ---
  footerNoteContainer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 10,
    textAlign: 'center',
  },
  footerNoteText: {
    fontSize: 7,
    color: '#95a5a6',
    lineHeight: 1.4
  }
});