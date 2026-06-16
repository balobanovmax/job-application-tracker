import styles from './SearchBar.module.css';

function SearchBar({ value, onChange, onClear, placeholder = 'Search company, role, or notes...' }) {
  return (
    <div className={styles.searchBar}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
        placeholder={placeholder}
        aria-label="Search job applications"
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;
