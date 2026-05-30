"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Star, StarOff, Award } from "lucide-react";

interface FeaturedItem {
  id: string;
  title: string;
  subtitle?: string;
  type: "post" | "job" | "company" | "mentor";
  isFeatured: boolean;
}

interface FeaturedManagerProps {
  items: FeaturedItem[];
  onToggleFeatured: (id: string, featured: boolean) => void;
}

const typeColors: Record<string, "default" | "accent" | "success" | "warning"> = {
  post: "default",
  job: "accent",
  company: "success",
  mentor: "warning",
};

export function FeaturedManager({ items, onToggleFeatured }: FeaturedManagerProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Award className="w-12 h-12" />}
        title="No items available"
        description="There are no items to manage in this category."
      />
    );
  }

  const featuredItems = items.filter((item) => item.isFeatured);
  const regularItems = items.filter((item) => !item.isFeatured);

  return (
    <div className="space-y-6">
      {featuredItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Currently Featured ({featuredItems.length})
          </h3>
          <div className="space-y-2">
            {featuredItems.map((item) => (
              <Card key={item.id} className="border-accent/50 bg-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-accent-warm fill-accent-warm" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className="text-xs text-text-secondary">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      <Badge variant={typeColors[item.type]}>{item.type}</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onToggleFeatured(item.id, false)}
                    >
                      <StarOff className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {regularItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Available ({regularItems.length})
          </h3>
          <div className="space-y-2">
            {regularItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className="text-xs text-text-secondary">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      <Badge variant={typeColors[item.type]}>{item.type}</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleFeatured(item.id, true)}
                    >
                      <Star className="w-3.5 h-3.5" />
                      Feature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
