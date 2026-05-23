import { HiOutlineSearch } from 'react-icons/hi';

const SearchFilter = ({ search, onSearchChange, filters = [], className = '' }) => (
  <div className={`card p-4 flex flex-col md:flex-row gap-3 ${className}`}>
    <div className="relative flex-1">
      <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input pl-10"
        placeholder="Search..."
        aria-label="Search"
      />
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map(({ value, onChange, options, label }) => (
        <select
          key={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm bg-surface-800/40 border border-surface-600/30 rounded-xl px-3 py-2.5 text-surface-200 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 outline-none transition-all duration-300 backdrop-blur-sm"
          aria-label={label}
        >
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ))}
    </div>
  </div>
);

export default SearchFilter;
