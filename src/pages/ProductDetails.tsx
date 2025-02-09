import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router";
import { Product } from "@/types/product";
import { fetchProductById } from "@/services/productService";
import { useCart } from "@/context/CartContext";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);

    const { addToCart } = useCart();

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value)
        setQuantity(isNaN(value) || value < 1 ? 1 : value)
    }

    useEffect(() => {
        const fetchSingleProduct = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const foundProduct = await fetchProductById(id);
                console.log(foundProduct);
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    console.error("Product not found.");
                }
            } catch (error) {
                console.error("Error obteniendo los datos del producto:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSingleProduct();
    }, [id]);

    const handleBuy = () => {
        if (!product) return;
        addToCart(product, quantity);
        console.log(`Added ${quantity} of ${product.name} to cart`);
    }

    if (loading) return "Loading...";

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardContent className="grid md:grid-cols-2 gap-6 p-6">
                    <div className="relative aspect-square">
                        <img
                            src={product?.imageURL || "/placeholder.svg"}
                            alt={product?.name}
                            className="rounded-md"
                        />
                    </div>
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
                            <p className="text-2xl font-semibold mb-4">${product?.price.toFixed(2)}</p>
                            <p className="text-gray-600 mb-4">{product?.description}</p>
                            <p className="mb-4">
                                <span className="font-semibold">Category:</span> {product?.category}
                            </p>
                            <p className="mb-4">
                                <span className="font-semibold">In Stock:</span> {product?.stock}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="quantity">Quantity:</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    max={product?.stock}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="w-20"
                                />
                            </div>
                            <Button onClick={handleBuy} className="w-full cursor-pointer">
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ProductDetails;

