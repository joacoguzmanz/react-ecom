import { useState, useEffect } from "react";
import { fetchProducts } from '../services/productService';
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Link } from "react-router";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface ProductGridProps {
    category: string
    priceRange: [number, number]
}

const ProductGrid = ({ category, priceRange }: ProductGridProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSeller, setIsSeller] = useState<boolean>(false);
    const auth = getAuth();

    const { addToCart } = useCart();

    useEffect(() => {
        const checkSellerRole = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userDocRef = doc(db, "user", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setIsSeller(userData.role === "seller");
                } else {
                    console.log("User doc does not exist.");
                }
            }
        };

        checkSellerRole();
    }, [auth]);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts();
            const filteredProducts = data.filter(
                (product) =>
                    (category === "Todos" || product.category === category) &&
                    product.price >= priceRange[0] &&
                    product.price <= priceRange[1],
            )
            setProducts(filteredProducts);
            setLoading(false);
        };

        loadProducts();
    }, [category, priceRange]);

    if (loading) return "Loading...";

    if (isSeller) console.log("is seller");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
                <Card key={product.id}>
                    <CardContent className="p-4">
                        <img src={product.imageURL} alt={product.name} className="object-cover" height={200} />
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button className="w-full cursor-pointer" onClick={() => addToCart(product, 1)}>Add to Cart</Button>
                        <Button className="w-full cursor-pointer">
                            <Link to={`/products/${product.id}`}>
                                View product
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default ProductGrid;
