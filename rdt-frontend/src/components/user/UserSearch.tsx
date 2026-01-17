import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Search } from 'lucide-react';

interface UserSearchProps {
  onSearch: (value: string) => void;
}

export const UserSearch = ({ onSearch }: Readonly<UserSearchProps>) => {
  const { t } = useTranslation();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
        <Search className="h-4 w-4" />
      </div>
      <input
        className="focus:ring-primary focus:border-primary w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-500 focus:ring-1 focus:outline-none"
        placeholder={t('user.searchPlaceholder', 'Search by name or email...')}
        type="text"
        onChange={handleChange}
      />
    </div>
  );
};
