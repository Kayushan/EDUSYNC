import { useMemo } from 'react';
import { useSchool } from '../../hooks/useSchool';

const Header = () => {
  const { school, loading } = useSchool() || {};

  const title = useMemo(() => {
    if (loading) return 'Loading school...';
    return school?.name ?? 'EduSync';
  }, [school, loading]);

  return (
    <header className="w-full p-4 bg-white/6 backdrop-blur-sm border-b border-white/6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">EduSync</h1>
        <span className="text-sm text-white/80">•</span>
        <div className="text-sm text-white/90">{title}</div>
      </div>
    </header>
  );
};

export default Header;