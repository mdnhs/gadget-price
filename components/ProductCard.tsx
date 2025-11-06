"use client";

import { Product } from "@/types/products";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <p className="text-xs text-muted-foreground mb-1">
          #{product.product_no}
        </p>
        <CardTitle className="text-base font-semibold line-clamp-3">
          {product.name || "Unnamed Product"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.category && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {product.category}
            </Badge>
          )}
          {product.brand && (
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              {product.brand}
            </Badge>
          )}
          {product.warranty && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              {product.warranty}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <p className="text-muted-foreground">DP Price</p>
            <p className="font-semibold text-blue-600">
              ৳{product.dp_price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">RP Price</p>
            <p className="font-semibold text-green-600">
              ৳{product.rp_price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">MAP</p>
            <p className="font-medium text-foreground">
              ৳{product.map_price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">MRP</p>
            <p className="font-medium text-foreground">
              ৳{product.mrp_price.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>

      {product.url && (
        <CardFooter>
          <Button asChild className="w-full text-white">
            <a href={product.url} target="_blank" rel="noopener noreferrer">
              View Product
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
