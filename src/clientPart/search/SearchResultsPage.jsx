import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Filter, Grid3X3, LayoutGrid, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import searchProductsApi from "@/services/clientPart/search/searchProductsApi";
import ProductCard from "@/components/clientPart/productList/ProductCard";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState("relevance");
  const [gridCols, setGridCols] = useState(3);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(query);

  const { data: searchData, isLoading, isError } = useQuery({
    queryKey: ['search', query, page, sortBy],
    queryFn: () => searchProductsApi({
      query: query,
      page: page,
      limit: 5,
      sortBy: sortBy
    }),
    enabled: !!query,
    cacheTime: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
      setPage(1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const products = searchData?.data?.products || [];
  const totalResults = searchData?.data?.totalCount || 0;
  const totalPages = searchData?.data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mb-8">
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/20 rounded-full mb-4">
            <Package className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Search Error</h3>
          <p className="text-gray-400 mb-4">Failed to load search results</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-12 pr-4 h-12 bg-gray-900 border-gray-700 text-white text-lg focus:border-gray-600"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Search Info */}
          <div className="text-center">
            {query ? (
              <>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Search Results for "{query}"
                </h1>
                <p className="text-gray-400">
                  Found {totalResults} product{totalResults !== 1 ? 's' : ''}
                </p>
              </>
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Search Products
              </h1>
            )}
          </div>
        </div>

        {/* Results Section */}
        {query && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="text-sm text-gray-400">
                Showing {products.length} of {totalResults} results
              </div>

              <div className="flex items-center gap-3">
                {/* Grid Toggle */}
                <div className="hidden sm:flex items-center border border-gray-700 rounded-lg bg-gray-900">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-3 py-2 rounded-l-lg ${gridCols === 2 ? "bg-gray-800" : ""}`}
                    onClick={() => setGridCols(2)}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    2 Columns
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-3 py-2 rounded-r-lg ${gridCols === 3 ? "bg-gray-800" : ""}`}
                    onClick={() => setGridCols(3)}
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    3 Columns
                  </Button>
                </div>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-gray-900 border-gray-700">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-700">
                    <SelectItem value="relevance">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        <span>Relevance</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="newest">
                      <div className="flex items-center gap-2">
                        <span>🆕</span>
                        <span>Newest First</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="price-low">
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span>Price: Low to High</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="price-high">
                      <div className="flex items-center gap-2">
                        <span>💎</span>
                        <span>Price: High to Low</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="rating-high">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span>Highest Rated</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <>
                <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 ${gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      productDetails={product}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="border-gray-700 text-white hover:bg-gray-800"
                      >
                        Previous
                      </Button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            onClick={() => setPage(pageNum)}
                            className={`min-w-[40px] ${page === pageNum ? 'bg-white text-black' : 'border-gray-700 text-white hover:bg-gray-800'}`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      {totalPages > 5 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <Button
                            variant={page === totalPages ? "default" : "outline"}
                            onClick={() => setPage(totalPages)}
                            className={`min-w-[40px] ${page === totalPages ? 'bg-white text-black' : 'border-gray-700 text-white hover:bg-gray-800'}`}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={page === totalPages}
                        className="border-gray-700 text-white hover:bg-gray-800"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full mb-6">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-400 mb-4">
                  We couldn't find any products matching "{query}"
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Suggestions:</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Check your spelling</li>
                    <li>• Try more general keywords</li>
                    <li>• Try different keywords</li>
                    <li>• Browse our categories</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Tips */}
        {!query && (
          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Search Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Use Specific Keywords</h4>
                  <p className="text-sm text-gray-400">
                    Try searching with specific product names or model numbers for better results.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Check Spelling</h4>
                  <p className="text-sm text-gray-400">
                    Make sure your search terms are spelled correctly.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Use Filters</h4>
                  <p className="text-sm text-gray-400">
                    After searching, use sort options to refine your results.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Browse Categories</h4>
                  <p className="text-sm text-gray-400">
                    Explore specific categories to discover related products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultsPage;