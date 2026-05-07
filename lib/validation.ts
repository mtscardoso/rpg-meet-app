/**
 * Validação com Zod
 * Versão: 1.0
 */

import { z } from 'zod';

export const ConferenceConfigSchema = z.object({
  roomName: z.string()
    .min(3, 'Nome da sala deve ter pelo menos 3 caracteres')
    .max(100, 'Nome da sala não pode exceder 100 caracteres')
    .regex(/^[a-zA-Z0-9-]+$/, 'Nome da sala pode conter apenas letras, números e hífens'),

  displayName: z.string()
    .min(1, 'Nome do jogador é obrigatório')
    .max(50, 'Nome do jogador não pode exceder 50 caracteres')
    .trim(),

  characterClass: z.enum(['Guerreiro', 'Mago', 'Clérigo', 'Ladino', 'Paladino', 'Bardo']),

  jwt: z.string().optional(),

  serverUrl: z.string().url('URL do servidor inválida').optional(),
});

export type ConferenceConfig = z.infer<typeof ConferenceConfigSchema>;

export const CharacterInfoSchema = z.object({
  name: z.string().min(1).max(50),
  class: z.enum(['Guerreiro', 'Mago', 'Clérigo', 'Ladino', 'Paladino', 'Bardo']),
  hp: z.number().min(0),
  maxHp: z.number().min(1),
  mana: z.number().min(0),
  maxMana: z.number().min(0),
  level: z.number().min(1).max(20).optional(),
  experience: z.number().min(0).optional(),
});

export type CharacterInfo = z.infer<typeof CharacterInfoSchema>;

export function validateConferenceConfig(data: unknown): ConferenceConfig {
  return ConferenceConfigSchema.parse(data);
}

export function validateCharacterInfo(data: unknown): CharacterInfo {
  return CharacterInfoSchema.parse(data);
}

export function safeValidateConferenceConfig(data: unknown): ConferenceConfig | null {
  try {
    return ConferenceConfigSchema.parse(data);
  } catch (error) {
    console.error('Validação de configuração falhou:', error);
    return null;
  }
}
