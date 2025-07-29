import React from 'react';
import { ExternalLink, Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    name: string;
    partNumber: string;
    price: string;
    image: string;
    compatibility: string[];
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="max-w-sm animate-slide-up shadow-chat">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Product Image */}
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-14 h-14 object-cover rounded"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-card-foreground truncate">
              {product.name}
            </h4>
            <p className="text-xs text-muted-foreground mb-1">
              Part #{product.partNumber}
            </p>
            <p className="text-lg font-semibold text-primary mb-2">
              {product.price}
            </p>

            {/* Compatibility */}
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Compatible with:</p>
              <div className="flex flex-wrap gap-1">
                {product.compatibility.slice(0, 2).map((model) => (
                  <Badge key={model} variant="secondary" className="text-xs">
                    {model}
                  </Badge>
                ))}
                {product.compatibility.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.compatibility.length - 2} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 text-xs h-8">
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add to Cart
              </Button>
              <Button size="sm" variant="outline" className="h-8 px-2">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Check mark for in stock */}
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
          <Check className="w-3 h-3 text-green-600" />
          <span className="text-xs text-muted-foreground">In Stock - Ships Today</span>
        </div>
      </CardContent>
    </Card>
  );
};