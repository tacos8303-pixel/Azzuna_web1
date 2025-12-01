export interface Arrangement {
  id?: number;
  name: string;
  style: string;
  size: 'small' | 'medium' | 'large';
  color_palette: string;
  extras?: string[]; // Array de strings para los extras seleccionados
  dedication?: string;
  price: number;
}
