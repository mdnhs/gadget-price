"use client";

import React, { useState, useCallback, memo } from "react";
import { Filter, Search, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Filters } from "@/types/products";

interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filterOptions: {
    categories: string[];
    brands: string[];
    warranties: string[];
  };
  clearFilters: () => void;
  productCount: number;
  filteredCount: number;
}

function FilterSidebar({
  filters,
  setFilters,
  filterOptions,
  clearFilters,
}: FilterSidebarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilters((prev) => ({ ...prev, search: value }));
    },
    [setFilters]
  );

  const handleSelectChange = useCallback(
    (key: keyof Pick<Filters, "category" | "brand" | "warranty">) =>
      (value: string) => {
        setFilters((prev) => ({
          ...prev,
          [key]: value === "all" ? "" : value,
        }));
      },
    [setFilters]
  );

  const handlePriceChange = useCallback(
    (
        key: keyof Pick<
          Filters,
          "minDpPrice" | "maxDpPrice" | "minRpPrice" | "maxRpPrice"
        >
      ) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilters((prev) => ({ ...prev, [key]: value }));
      },
    [setFilters]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, sortBy: value as Filters["sortBy"] }));
    },
    [setFilters]
  );

  const handleSortOrderChange = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, sortOrder: value as "asc" | "desc" }));
    },
    [setFilters]
  );

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.brand ||
    filters.warranty ||
    filters.minDpPrice ||
    filters.maxDpPrice ||
    filters.minRpPrice ||
    filters.maxRpPrice;

  const FilterForm = (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">
          Category
        </Label>
        <Select
          value={filters.category || "all"}
          onValueChange={handleSelectChange("category")}
        >
          <SelectTrigger className="text-sm h-10 border-border/50 w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {filterOptions.categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">Brand</Label>
        <Select
          value={filters.brand || "all"}
          onValueChange={handleSelectChange("brand")}
        >
          <SelectTrigger className="text-sm h-10 border-border/50 w-full">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {filterOptions.brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Warranty */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">
          Warranty
        </Label>
        <Select
          value={filters.warranty || "all"}
          onValueChange={handleSelectChange("warranty")}
        >
          <SelectTrigger className="text-sm h-10 border-border/50 w-full">
            <SelectValue placeholder="All Warranties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warranties</SelectItem>
            {filterOptions.warranties.map((warranty) => (
              <SelectItem key={warranty} value={warranty}>
                {warranty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4" />

      {/* Price Filters */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-foreground">
          DP Price Range
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minDpPrice}
            onChange={handlePriceChange("minDpPrice")}
            className="text-sm h-9"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxDpPrice}
            onChange={handlePriceChange("maxDpPrice")}
            className="text-sm h-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-semibold text-foreground">
          RP Price Range
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minRpPrice}
            onChange={handlePriceChange("minRpPrice")}
            className="text-sm h-9"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxRpPrice}
            onChange={handlePriceChange("maxRpPrice")}
            className="text-sm h-9"
          />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Sort Options */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-foreground">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="text-sm h-10 border-border/50 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="product_no">Product No</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="brand">Brand</SelectItem>
            <SelectItem value="dp_price">DP Price</SelectItem>
            <SelectItem value="rp_price">RP Price</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={filters.sortOrder === "asc" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortOrderChange("asc")}
            className="flex-1"
          >
            Asc
          </Button>
          <Button
            variant={filters.sortOrder === "desc" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortOrderChange("desc")}
            className="flex-1"
          >
            Desc
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toolbar */}
      <div className="md:hidden flex items-center gap-3 w-full">
        {/* Search Input (Left Side) */}
        <div className="relative flex-1 group">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary"
          />
          <Input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Filter Drawer Trigger (Right Side) */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1.5 font-medium whitespace-nowrap"
            >
              <Filter size={16} />
              Filter
              {hasActiveFilters &&
                `(${
                  Object.values(filters).filter(
                    (v) => v && v !== "product_no" && v !== "asc"
                  ).length
                })`}
            </Button>
          </DrawerTrigger>

          <DrawerContent className="p-0 max-h-[90vh]">
            <DrawerHeader className="flex flex-row justify-between items-center border-b border-border px-4 py-3">
              <DrawerTitle className="text-lg font-semibold">
                Filters
              </DrawerTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 text-xs"
                >
                  <X size={14} />
                  Clear
                </Button>
              )}
            </DrawerHeader>

            <div className="p-4 overflow-y-auto">{FilterForm}</div>

            <DrawerFooter className="flex-row gap-3 border-t border-border px-4 py-3">
              <DrawerClose asChild>
                <Button variant="secondary" className="flex-1">
                  Close
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button
                  className="flex-1"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Apply
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop Sidebar */}
      <Card className="hidden md:block sticky top-6 h-fit border-border/50 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4 space-y-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2.5">
              <Filter size={18} className="text-primary" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 px-3 h-8 text-xs font-medium flex items-center gap-1.5"
              >
                <X size={14} />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">{FilterForm}</CardContent>
      </Card>
    </>
  );
}

export default memo(FilterSidebar);
