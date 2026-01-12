import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  onClear,
  placeholder = "Search for products...",
  className = "",
  autoFocus = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
        isFocused ? 'text-white' : 'text-gray-400'
      }`} />
      <Input
        type="search"
        placeholder={placeholder}
        className={`pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 transition-all ${
          isFocused ? 'border-gray-600' : ''
        }`}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={autoFocus}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;