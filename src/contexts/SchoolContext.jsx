import { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  const { user } = useAuth();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now we use placeholder static data. Replace with API call when ready.
    const fetchSchool = async () => {
      setLoading(true);
      // Simulated placeholder data (would be fetched using user info)
      const placeholder = {
        id: '0000-0000-0000-0000',
        name: 'Sunrise Primary School',
        address: '123 Example St, Example City',
        logo_url: '',
        unhcr_status: false,
      };
      // small async delay to simulate fetch
      await new Promise((r) => setTimeout(r, 50));
      setSchool(placeholder);
      setLoading(false);
    };

    fetchSchool();
  }, [user]);

  const refetch = async () => {
    setLoading(true);
    // Placeholder refetch - in future call API
    await new Promise((r) => setTimeout(r, 50));
    setLoading(false);
  };

  return (
    <SchoolContext.Provider value={{ school, setSchool, refetch, loading }}>
      {children}
    </SchoolContext.Provider>
  );
};

export default SchoolProvider;
