import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Package, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { debounce } from "lodash";
import searchProductsApi from "@/services/clientPart/search/searchProductsApi";

const SearchDialog = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save recent search to localStorage
  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(s => s !== query).slice(0, 4)
    ];
    
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim() || query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await searchProductsApi({ query });
        setSearchResults(response.data?.products || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      onOpenChange(false);
      setSearchResults([]);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Remove specific recent search
  const removeRecentSearch = (searchToRemove) => {
    const updatedSearches = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  // Navigate to product detail
  const navigateToProduct = (product) => {
    navigate(`/product/${product._id}`);
    setSearchQuery("");
    onOpenChange(false);
    setSearchResults([]);
    saveRecentSearch(product.title);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Reset when dialog closes
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-black border-gray-800 max-h-[80vh] overflow-hidden">
        <DialogHeader className="p-4 border-b border-gray-800">
          <DialogTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Products
          </DialogTitle>
        </DialogHeader>
        
        {/* Search Input */}
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for products, brands, categories..."
              className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-gray-400 px-3 py-2">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </div>
              {searchResults.map((product) => (
                <button
                  key={product._id}
                  onClick={() => navigateToProduct(product)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-800/50 transition-colors text-left"
                >
                  <Avatar className="h-12 w-12 rounded-md border border-gray-700">
                    <AvatarImage 
                      src={product.bannerImage || product.images?.[0]} 
                      alt={product.title}
                    />
                    <AvatarFallback className="bg-gray-800 text-gray-400">
                      {product.title?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {product.subTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-white">
                        {formatPrice(product.finalPrice || product.mainPrice || 0)}
                      </span>
                      {product.discountAmount > 0 && (
                        <>
                          <span className="text-xs text-red-400 line-through">
                            {formatPrice(product.mainPrice || 0)}
                          </span>
                          <Badge className="ml-1 bg-red-500 text-xs">
                            -{product.discountPercentage || 0}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="p-4 text-center">
              <Package className="h-12 w-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">No products found for "{searchQuery}"</p>
              <p className="text-sm text-gray-500 mt-1">Try different keywords</p>
            </div>
          ) : recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Recent Searches</h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <button
                      onClick={() => {
                        setSearchQuery(search);
                        debouncedSearch(search);
                      }}
                      className="flex-1 text-left px-3 py-2 text-sm rounded-md text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors flex items-center gap-2"
                    >
                      <Search className="h-3 w-3 text-gray-500" />
                      {search}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(search)}
                      className="p-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Popular Searches */}
        {!searchQuery && recentSearches.length === 0 && (
          <div className="p-4 border-t border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {["Keyboard", "Mouse", "Headphones", "Monitor", "Laptop"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    debouncedSearch(term);
                  }}
                  className="px-3 py-1.5 text-sm rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <button
              onClick={handleSearchSubmit}
              className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors"
              disabled={!searchQuery.trim()}
            >
              View All Results
            </button>
            <span className="text-gray-400 text-xs">
              Press Enter to search
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;