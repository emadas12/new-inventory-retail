
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ProductForm from "@/components/ProductForm";
import { 
  useProduct, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct 
} from "@/hooks/useProducts";
import { toast } from "@/hooks/use-toast";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewProduct = id === "new";
  
  const { data: product, isLoading } = useProduct(id || "");
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  
  const handleSubmit = async (data: any) => {
    try {
      if (isNewProduct) {
        await createProduct(data);
        toast({
          title: "Product created",
          description: "The product has been successfully added to inventory.",
        });
        navigate("/products");
      } else if (id) {
        await updateProduct({ id, data });
        toast({
          title: "Product updated",
          description: "The product details have been updated.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving product:", error);
    }
  };
  
  const handleDelete = async () => {
    try {
      if (id) {
        await deleteProduct(id);
        toast({
          title: "Product deleted",
          description: "The product has been removed from inventory.",
        });
        navigate("/products");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewProduct ? "Add New Product" : "Edit Product"}
          </h1>
          <p className="text-muted-foreground">
            {isNewProduct
              ? "Add a new product to your inventory"
              : "Update product details and stock information"}
          </p>
        </div>
        {!isNewProduct && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Product
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this
                  product from your inventory.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {isLoading && !isNewProduct ? (
        <div className="flex justify-center py-8">
          <p>Loading product details...</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Enter the details for this product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={isNewProduct ? undefined : product}
              onSubmit={handleSubmit}
              isSubmitting={isCreating || isUpdating}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductDetailPage;
