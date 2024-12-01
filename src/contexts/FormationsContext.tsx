import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Formation } from '@/types/formation';

interface FormationsContextType {
  formations: Formation[];
  loading: boolean;
  error: string | null;
  refreshFormations: () => Promise<void>;
}

const FormationsContext = createContext<FormationsContextType | undefined>(undefined);

export function FormationsProvider({ children }: { children: ReactNode }) {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let isFetching = false;

  const fetchFormations = async () => {
    if (isFetching) return;
    isFetching = true;

    try {
      setLoading(true);
      const response = await fetch('/api/user-formations');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des formations');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setFormations(data);
      } else {
        throw new Error('Format de données invalide');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
      isFetching = false;
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  return (
    <FormationsContext.Provider
      value={{
        formations,
        loading,
        error,
        refreshFormations: fetchFormations,
      }}
    >
      {children}
    </FormationsContext.Provider>
  );
}

export function useFormations() {
  const context = useContext(FormationsContext);
  if (context === undefined) {
    throw new Error('useFormations must be used within a FormationsProvider');
  }
  return context;
}
