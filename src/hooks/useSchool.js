import { useContext } from 'react';
import { SchoolContext } from '../contexts/SchoolContext';

export const useSchool = () => {
  return useContext(SchoolContext);
};

export default useSchool;
