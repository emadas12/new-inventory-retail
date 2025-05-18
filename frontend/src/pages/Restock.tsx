import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Package } from "lucide-react";
import RestockForm from "@/components/RestockForm";
import { useRecentRestocks } from "@/hooks/useRecentRestocks";
import { formatDistanceToNow } from "date-fns";

const RestockPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: restockLogs, isLoading, isError } = useRecentRestocks();

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Restock Inventory</h1>
        <p className="text-muted-foreground">
          Add inventory to low stock products
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* טופס Restock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 text-inventory-blue mr-2" />
              Restock Product
            </CardTitle>
            <CardDescription>
              Add inventory to products that are running low
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RestockForm />
          </CardContent>
        </Card>

        {/* מידע על מוצרים נמוכים */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 text-inventory-blue mr-2" />
                Low Stock Products
              </CardTitle>
              <CardDescription>
                View and manage products that need restocking
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/products")}>
              View All Products
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Select a product from the dropdown to restock it.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* טבלת Restock History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Restock History</CardTitle>
          <CardDescription>Latest inventory updates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <p>Loading restock history...</p>
            </div>
          ) : isError ? (
            <div className="flex justify-center py-4 text-red-500">
              <p>Failed to load restocks. Please try again.</p>
            </div>
          ) : restockLogs && restockLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restockLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.product_name}</TableCell>
                    <TableCell className="text-right text-inventory-green">
                      +{log.quantity}
                    </TableCell>
                    <TableCell>
                      {log.timestamp
                        ? formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })
                        : "Just now"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex justify-center py-4">
              <p>No recent restocks available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RestockPage;
