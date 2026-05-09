import type { StampType } from '@worlddex/shared-types';

export interface StampDefinition {
  type: StampType;
  label: string;
  description: string;
  isUnique: boolean;
}

export const STAMP_DEFINITIONS: Record<StampType, StampDefinition> = {
  physical: {
    type: 'physical',
    label: 'Sello Físico',
    description: 'Visitaste este país en persona',
    isUnique: false,
  },
  cultural: {
    type: 'cultural',
    label: 'Sello Cultural',
    description: 'Dominaste la trivia, idioma y juego de este país',
    isUnique: false,
  },
  expedition: {
    type: 'expedition',
    label: 'Sello de Expedición',
    description: 'Participaste en una Expedición Global única',
    isUnique: true,
  },
  seasonal: {
    type: 'seasonal',
    label: 'Sello Estacional',
    description: 'Conseguido durante un evento especial',
    isUnique: false,
  },
};
