import { useQuery } from '@tanstack/react-query';
import { getAllCountries, getCountryByIso } from '@/services/countries';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: getAllCountries,
    staleTime: 1000 * 60 * 60, // 1 hora (datos estáticos)
  });
}

export function useCountry(isoCode: string) {
  return useQuery({
    queryKey: ['country', isoCode],
    queryFn: () => getCountryByIso(isoCode),
    enabled: !!isoCode,
    staleTime: 1000 * 60 * 60,
  });
}
