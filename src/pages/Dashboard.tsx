import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { fetchProducts } from "@/services/productService";
import { Product } from "@/types/product";

const Dashboard = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newProduct, setNewProduct] = useState<Partial<Product>>({})
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const db = getFirestore();

    useEffect(() => {
        const fetchCategories = async () => {
            const products = await fetchProducts();
            const uniqueCategories = [...new Set(products.map((p) => p.category))];
            setSelectedCategories(uniqueCategories);
        };
        fetchCategories();
    }, []);

    const callProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => {
            const data = doc.data() as Omit<Product, "id">;
            return {
                id: doc.id,
                ...data,
            }
        });
        setProducts(productsData);
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await addDoc(collection(db, "products"), newProduct);
            callProducts();
            setNewProduct({});
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }

    const handleDeleteProduct = async (id: string) => {
        try {
            await deleteDoc(doc(db, "products", id));
            callProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }

    useEffect(() => {
        callProducts();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="mb-5 cursor-pointer">Create Product</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Product</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateProduct} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                value={newProduct.name || ""}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                value={newProduct.price || ""}
                                onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                value={newProduct.imageURL || ""}
                                onChange={(e) => setNewProduct({ ...newProduct, imageURL: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={newProduct.description || ""}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={newProduct.stock || ""}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={(value) => setNewProduct({ ...newProduct, category: value })} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedCategories.map((category) => {
                                        return (
                                            <SelectItem key={category} value={category}>{category}</SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="cursor-pointer">
                                Cancel
                            </Button>
                            <Button type="submit" className="cursor-pointer">Confirm</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                                <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)} className="cursor-pointer">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default Dashboard;

