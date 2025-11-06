"use client";

import FileUploadSection from "@/components/FileUploadSection";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { processExcelFile } from "@/lib/dataProcessor";
import { Filters, Product } from "@/types/products";
import { AlertCircle } from "lucide-react";
import React, {
  JSX,
  useMemo,
  useState,
  useCallback,
  useTransition,
} from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export default function ProductFilterApp(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    brand: "",
    warranty: "",
    minDpPrice: "",
    maxDpPrice: "",
    minRpPrice: "",
    maxRpPrice: "",
    sortBy: "product_no",
    sortOrder: "asc",
  });

  const [page, setPage] = useState<number>(1);
  const pageSize = 6;

  const filterOptions = useMemo(() => {
    if (products.length === 0) {
      return { categories: [], brands: [], warranties: [] };
    }

    const categories = new Set<string>();
    const brands = new Set<string>();
    const warranties = new Set<string>();

    for (const p of products) {
      if (p.category) categories.add(p.category);
      if (p.brand) brands.add(p.brand);
      if (p.warranty) warranties.add(p.warranty);
    }

    return {
      categories: Array.from(categories).sort(),
      brands: Array.from(brands).sort(),
      warranties: Array.from(warranties).sort(),
    };
  }, [products]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      setError("");

      try {
        const processedData = await processExcelFile(file);
        setProducts(processedData);
      } catch (err) {
        setError(
          "Failed to process file. Please ensure it has the correct format."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const filteredProducts = useMemo(() => {
    if (products.length === 0) return [];

    let result = products;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.product_no.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category)
      result = result.filter((p) => p.category === filters.category);
    if (filters.brand) result = result.filter((p) => p.brand === filters.brand);
    if (filters.warranty)
      result = result.filter((p) => p.warranty === filters.warranty);

    const minDp = filters.minDpPrice ? parseFloat(filters.minDpPrice) : null;
    const maxDp = filters.maxDpPrice ? parseFloat(filters.maxDpPrice) : null;
    const minRp = filters.minRpPrice ? parseFloat(filters.minRpPrice) : null;
    const maxRp = filters.maxRpPrice ? parseFloat(filters.maxRpPrice) : null;

    if (minDp !== null || maxDp !== null || minRp !== null || maxRp !== null) {
      result = result.filter((p) => {
        if (minDp !== null && p.dp_price < minDp) return false;
        if (maxDp !== null && p.dp_price > maxDp) return false;
        if (minRp !== null && p.rp_price < minRp) return false;
        if (maxRp !== null && p.rp_price > maxRp) return false;
        return true;
      });
    }

    if (result.length > 0) {
      result = [...result];
      const { sortBy, sortOrder } = filters;

      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        let comparison: number;
        if (typeof aVal === "number" && typeof bVal === "number") {
          comparison = aVal - bVal;
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [products, filters]);

  const clearFilters = useCallback(() => {
    startTransition(() => {
      setFilters({
        search: "",
        category: "",
        brand: "",
        warranty: "",
        minDpPrice: "",
        maxDpPrice: "",
        minRpPrice: "",
        maxRpPrice: "",
        sortBy: "product_no",
        sortOrder: "asc",
      });
      setPage(1);
    });
  }, []);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const showLoading = loading || isPending;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {" "}
      <div className="max-w-7xl mx-auto">
        {!products.length && (
          <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 mb-6">
            {" "}
            <FileUploadSection
              onFileUpload={handleFileUpload}
              loading={loading}
            />
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-start gap-2">
                {" "}
                <AlertCircle size={18} className="mt-0.5 shrink-0" />{" "}
                <span>{error}</span>{" "}
              </div>
            )}{" "}
          </div>
        )}

        {products.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="hidden lg:block lg:w-72 shrink-0">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
                clearFilters={clearFilters}
                productCount={products.length}
                filteredCount={filteredProducts.length}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 py-2 px-2 flex justify-end">
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  filterOptions={filterOptions}
                  clearFilters={clearFilters}
                  productCount={products.length}
                  filteredCount={filteredProducts.length}
                />
              </div>

              {showLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent mb-3"></div>
                  <p className="text-gray-600">Loading your catalog...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id || product.product_no}
                        product={product}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              className={
                                page === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>

                          {Array.from({ length: totalPages }).map((_, idx) => {
                            const pageNumber = idx + 1;
                            if (
                              pageNumber === 1 ||
                              pageNumber === totalPages ||
                              Math.abs(page - pageNumber) <= 1
                            ) {
                              return (
                                <PaginationItem key={pageNumber}>
                                  <PaginationLink
                                    isActive={page === pageNumber}
                                    onClick={() => setPage(pageNumber)}
                                  >
                                    {pageNumber}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            } else if (
                              (pageNumber === page - 2 && page > 3) ||
                              (pageNumber === page + 2 && page < totalPages - 2)
                            ) {
                              return (
                                <PaginationItem key={pageNumber}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            }
                            return null;
                          })}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                              }
                              className={
                                page === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                  <p className="text-gray-600 mb-4">
                    No products match your filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : showLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent mb-3"></div>
            <p className="text-gray-600">Loading your catalog...</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
