
import { LinePath, Station } from './types';

export const LINE_COLORS: Record<string | number, string> = {
  1: '#E11D48',    // Rojo (L1 según imagen)
  2: '#16A34A',    // Verde (L2 según imagen)
  3: '#D946EF',    // Rosa/Fucsia (L3 según imagen)
  4: '#F59E0B',    // Naranja (L4 según imagen)
  5: '#0D9488',    // Turquesa (Macro Aeropuerto - L5)
  'mc': '#0891B2', // Azul/Cian (Macro Calzada - L6)
  'mp': '#7E22CE', // Morado (Macro Periférico - L7)
};

export const STATIONS: Station[] = [
  // Línea 1 (Roja)
  { id: 'l1-audi', name: 'Auditorio', lat: 20.73524, lng: -103.35079, line: 1 },
  { id: 'l1-pnor', name: 'Periférico Norte', lat: 20.7312, lng: -103.3521, line: 1, isTransfer: true, transferLines: ['mp'] },
  { id: 'l1-derm', name: 'Dermatológico', lat: 20.72068, lng: -103.35338, line: 1 },
  { id: 'l1-aten', name: 'Atemajac', lat: 20.71619, lng: -103.35437, line: 1 },
  { id: 'l1-divn', name: 'División del Norte', lat: 20.70805, lng: -103.3556, line: 1 },
  { id: 'l1-avca', name: 'Ávila Camacho', lat: 20.6992, lng: -103.35476, line: 1, isTransfer: true, transferLines: [3] },
  { id: 'l1-mezq', name: 'Mezquitán', lat: 20.69153, lng: -103.35397, line: 1 },
  { id: 'l1-refu', name: 'Refugio', lat: 20.68244, lng: -103.35401, line: 1 },
  { id: 'l1-juar', name: 'Juárez', lat: 20.67473, lng: -103.35473, line: 1, isTransfer: true, transferLines: [2] },
  { id: 'l1-mexi', name: 'Mexicaltzingo', lat: 20.66689, lng: -103.35537, line: 1 },
  { id: 'l1-wash', name: 'Washington', lat: 20.66114, lng: -103.35745, line: 1 },
  { id: 'l1-safi', name: 'Santa Filomena', lat: 20.65441, lng: -103.36364, line: 1 },
  { id: 'l1-udep', name: 'Unidad Deportiva', lat: 20.6472, lng: -103.36927, line: 1 },
  { id: 'l1-urda', name: 'Urdaneta', lat: 20.64325, lng: -103.37268, line: 1 },
  { id: 'l1-18mz', name: '18 de Marzo', lat: 20.63821, lng: -103.37699, line: 1 },
  { id: 'l1-isra', name: 'Isla Raza', lat: 20.63272, lng: -103.38064, line: 1 },
  { id: 'l1-patr', name: 'Patria', lat: 20.62684, lng: -103.385, line: 1 },
  { id: 'l1-espa', name: 'España', lat: 20.6217, lng: -103.38933, line: 1 },
  { id: 'l1-mart', name: 'Santuario Mártires', lat: 20.61395, lng: -103.39547, line: 1 },
  { id: 'l1-psur', name: 'Periférico Sur', lat: 20.60756, lng: -103.40079, line: 1, isTransfer: true, transferLines: ['mp'] },

  // Línea 2 (Verde)
  { id: 'l2-juar', name: 'Juárez', lat: 20.6747, lng: -103.35474, line: 2, isTransfer: true, transferLines: [1] },
  { id: 'l2-plun', name: 'Plaza Universidad', lat: 20.67513, lng: -103.34814, line: 2, isTransfer: true, transferLines: [3] },
  { id: 'l2-sjud', name: 'San Juan de Dios', lat: 20.67514, lng: -103.34045, line: 2, isTransfer: true, transferLines: ['mc'] },
  { id: 'l2-bdom', name: 'Belisario Domínguez', lat: 20.67275, lng: -103.33146, line: 2 },
  { id: 'l2-obla', name: 'Oblatos', lat: 20.67041, lng: -103.3224, line: 2 },
  { id: 'l2-conate', name: 'Cristóbal de Oñate', lat: 20.66754, lng: -103.3135, line: 2 },
  { id: 'l2-sand', name: 'San Andrés', lat: 20.66529, lng: -103.30603, line: 2 },
  { id: 'l2-sjac', name: 'San Jacinto', lat: 20.66393, lng: -103.29726, line: 2 },
  { id: 'l2-aurr', name: 'La Aurora', lat: 20.66252, lng: -103.28567, line: 2 },
  { id: 'l2-tetl', name: 'Tetlán', lat: 20.65989, lng: -103.27603, line: 2 },

  // Línea 3 (Rosa)
  { id: 'l3-arcos', name: 'Arcos de Zapopan', lat: 20.74126, lng: -103.40742, line: 3 },
  { id: 'l3-belen', name: 'Periférico Belenes', lat: 20.73819, lng: -103.403, line: 3, isTransfer: true, transferLines: ['mp'] },
  { id: 'l3-mmar', name: 'Mercado del Mar', lat: 20.72914, lng: -103.38927, line: 3 },
  { id: 'l3-zcen', name: 'Zapopan Centro', lat: 20.71982, lng: -103.38155, line: 3 },
  { id: 'l3-ppat', name: 'Plaza Patria', lat: 20.71243, lng: -103.37519, line: 3 },
  { id: 'l3-ccou', name: 'Circunvalación Country', lat: 20.70647, lng: -103.36605, line: 3 },
  { id: 'l3-avca', name: 'Ávila Camacho', lat: 20.69926, lng: -103.35472, line: 3, isTransfer: true, transferLines: [1] },
  { id: 'l3-norm', name: 'La Normal', lat: 20.69332, lng: -103.3482, line: 3 },
  { id: 'l3-sant', name: 'Santuario', lat: 20.68408, lng: -103.34784, line: 3 },
  { id: 'l3-gcen', name: 'Guadalajara Centro', lat: 20.6756, lng: -103.34735, line: 3, isTransfer: true, transferLines: [2] },
  { id: 'l3-inde', name: 'Independencia', lat: 20.67097, lng: -103.34468, line: 3, isTransfer: true, transferLines: ['mc'] },
  { id: 'l3-pban', name: 'Plaza de la Bandera', lat: 20.66502, lng: -103.33257, line: 3 },
  { id: 'l3-cucei', name: 'CUCEI', lat: 20.65969, lng: -103.32397, line: 3 },
  { id: 'l3-revo', name: 'Revolución', lat: 20.651, lng: -103.31017, line: 3 },
  { id: 'l3-rnilo', name: 'Río Nilo', lat: 20.64495, lng: -103.30416, line: 3 },
  { id: 'l3-tlaq', name: 'Tlaquepaque Centro', lat: 20.63774, lng: -103.29998, line: 3 },
  { id: 'l3-lcrd', name: 'Lázaro Cárdenas', lat: 20.63222, lng: -103.29624, line: 3 },
  { id: 'l3-caut', name: 'Central de Autobuses', lat: 20.62331, lng: -103.28513, line: 3 },

  // Línea 4 (Naranja)
  { id: 'l4-ljun', name: 'Las Juntas', lat: 20.60764, lng: -103.3409, line: 4, isTransfer: true, transferLines: ['mc'] },
  { id: 'l4-acue', name: 'Acueducto', lat: 20.5884, lng: -103.34659, line: 4 },
  { id: 'l4-jali', name: 'Jalisco 200 Años', lat: 20.57518, lng: -103.35598, line: 4, isTransfer: true, transferLines: ['mp'] },
  { id: 'l4-real', name: 'Real del Valle', lat: 20.55943, lng: -103.36551, line: 4 },
  { id: 'l4-conc', name: 'Concepción del Valle', lat: 20.52929, lng: -103.38401, line: 4 },
  { id: 'l4-cuer', name: 'El Cuervo', lat: 20.5071, lng: -103.39354, line: 4 },
  { id: 'l4-loma', name: 'Lomas del Sur', lat: 20.48716, lng: -103.40452, line: 4 },
  { id: 'l4-cut', name: 'CUTlajo', lat: 20.46955, lng: -103.41491, line: 4 },
  { id: 'l4-tlaj', name: 'Tlajomulco Centro', lat: 20.46859, lng: -103.43645, line: 4 },

  // Línea 6 (Macro Calzada - Azul)
  { id: 'mc-01', name: 'Mirador', lat: 20.73711, lng: -103.31217, line: 'mc' },
  { id: 'mc-02', name: 'Huentitán', lat: 20.73205, lng: -103.31373, line: 'mc' },
  { id: 'mc-03', name: 'Zoológico', lat: 20.72692, lng: -103.31515, line: 'mc' },
  { id: 'mc-04', name: 'Independencia Norte', lat: 20.72035, lng: -103.31738, line: 'mc', isTransfer: true, transferLines: ['mp'] },
  { id: 'mc-13', name: 'San Juan de Dios', lat: 20.67576, lng: -103.34129, line: 'mc', isTransfer: true, transferLines: [2] },
  { id: 'mc-14', name: 'Independencia Bicentenario', lat: 20.66984, lng: -103.34472, line: 'mc', isTransfer: true, transferLines: [3] },
  { id: 'mc-27', name: 'Fray Angélico', lat: 20.6086, lng: -103.34271, line: 'mc' },

  // Línea 7 (Macro Periférico - Morado)
  { id: 'mp-huen', name: 'Barranca de Huentitán', lat: 20.7428, lng: -103.2952, line: 'mp' },
  { id: 'mp-zoo', name: 'Zoológico Guadalajara', lat: 20.7425, lng: -103.3050, line: 'mp' },
  { id: 'mp-inde', name: 'Independencia Norte', lat: 20.7420, lng: -103.3173, line: 'mp', isTransfer: true, transferLines: ['mc'] },
  { id: 'mp-lomas', name: 'Lomas del Paraíso', lat: 20.7410, lng: -103.3280, line: 'mp' },
  { id: 'mp-rancho', name: 'Rancho Nuevo', lat: 20.7390, lng: -103.3380, line: 'mp' },
  { id: 'mp-pnor', name: 'Periférico Norte', lat: 20.7312, lng: -103.3521, line: 'mp', isTransfer: true, transferLines: [1] },
  { id: 'mp-ccu', name: 'Centros Cultural Universitario', lat: 20.7340, lng: -103.3750, line: 'mp' },
  { id: 'mp-const', name: 'Constitución', lat: 20.7360, lng: -103.3850, line: 'mp' },
  { id: 'mp-taba', name: 'Tabachines', lat: 20.7370, lng: -103.3950, line: 'mp' },
  { id: 'mp-belen', name: 'Belenes', lat: 20.7382, lng: -103.403, line: 'mp', isTransfer: true, transferLines: [3] },
  { id: 'mp-isidro', name: 'San Isidro', lat: 20.7350, lng: -103.4150, line: 'mp' },
  { id: 'mp-pino', name: 'Pino Suárez', lat: 20.7280, lng: -103.4250, line: 'mp' },
  { id: 'mp-sjoc', name: 'San Juan de Ocotán', lat: 20.7080, lng: -103.4380, line: 'mp' },
  { id: 'mp-vall', name: 'Vallarta', lat: 20.6788, lng: -103.4352, line: 'mp' },
  { id: 'mp-stadium', name: 'Estadio Chivas', lat: 20.6650, lng: -103.4340, line: 'mp' },
  { id: 'mp-cjud', name: 'Ciudad Judicial', lat: 20.6550, lng: -103.4320, line: 'mp' },
  { id: 'mp-guad', name: 'Guadalupe', lat: 20.6450, lng: -103.4255, line: 'mp' },
  { id: 'mp-mote', name: 'Mariano Otero', lat: 20.6300, lng: -103.4200, line: 'mp' },
  { id: 'mp-ites', name: 'ITESO', lat: 20.6085, lng: -103.4145, line: 'mp' },
  { id: 'mp-psur', name: 'Periférico Sur', lat: 20.6076, lng: -103.4008, line: 'mp', isTransfer: true, transferLines: [1] },
  { id: 'mp-sseb', name: 'San Sebastianito', lat: 20.5950, lng: -103.3850, line: 'mp' },
  { id: 'mp-8jul', name: '8 de Julio', lat: 20.5850, lng: -103.3750, line: 'mp' },
  { id: 'mp-adolf', name: 'Adolf Horn', lat: 20.5750, lng: -103.3560, line: 'mp', isTransfer: true, transferLines: [4] },
  { id: 'mp-chapala', name: 'Carretera a Chapala', lat: 20.5740, lng: -103.3250, line: 'mp' },
];

export const LINE_PATHS: LinePath[] = [
  { id: 1, name: 'Línea 1', color: LINE_COLORS[1], coordinates: STATIONS.filter(s => s.line === 1).map(s => [s.lat, s.lng]) as [number, number][] },
  { id: 2, name: 'Línea 2', color: LINE_COLORS[2], coordinates: STATIONS.filter(s => s.line === 2).map(s => [s.lat, s.lng]) as [number, number][] },
  { id: 3, name: 'Línea 3', color: LINE_COLORS[3], coordinates: STATIONS.filter(s => s.line === 3).map(s => [s.lat, s.lng]) as [number, number][] },
  { id: 4, name: 'Línea 4', color: LINE_COLORS[4], coordinates: STATIONS.filter(s => s.line === 4).map(s => [s.lat, s.lng]) as [number, number][] },
  { id: 'mc', name: 'Macro Calzada (L6)', color: LINE_COLORS['mc'], coordinates: STATIONS.filter(s => s.line === 'mc').map(s => [s.lat, s.lng]) as [number, number][] },
  { id: 'mp', name: 'Macro Periférico (L7)', color: LINE_COLORS['mp'], coordinates: STATIONS.filter(s => s.line === 'mp').map(s => [s.lat, s.lng]) as [number, number][] },
];
