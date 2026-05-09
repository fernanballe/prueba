import { supabase } from './supabase';
import type { Country } from '@worlddex/shared-types';

export async function getAllCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name_es', { ascending: true });

  if (error) throw error;
  return data as Country[];
}

export async function getCountryByIso(isoCode: string): Promise<Country | null> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('iso_code', isoCode.toUpperCase())
    .single();

  if (error) return null;
  return data as Country;
}
