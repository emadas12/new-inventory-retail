
import React from "react";
import { BellIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLowStockProducts } from "@/hooks/useLowStockProducts";

const Header: React.FC = () => {
  const { data: lowStockProducts } = useLowStockProducts();
  const notificationCount = lowStockProducts?.length || 0;
  
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Inventory Management</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <BellIcon size={20} />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-inventory-red text-white">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-inventory-blue text-white flex items-center justify-center mr-2">
              SM
            </div>
            <span className="text-sm">Store Manager - DevSecOps</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
