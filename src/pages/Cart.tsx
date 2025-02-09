import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart } = useCart();

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    const handleCheckout = () => {
        console.log("Proceeding to checkout")
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
            {cart.length === 0 ? (
                <p className="text-xl text-center py-8">Your cart is empty</p>
            ) : (
                <Card>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Subtotal</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.map((item) => (
                                    <TableRow key={item.product.id}>
                                        <TableCell>
                                            <img
                                                src={item.product.imageURL}
                                                alt={item.product.name}
                                                width={80}
                                                height={80}
                                                className="rounded-md"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{item.product.name}</TableCell>
                                        <TableCell>${item.product.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={item.product.stock}
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.product.id, Number.parseInt(e.target.value))}
                                                className="w-20"
                                            />
                                        </TableCell>
                                        <TableCell>${(item.product.price * item.quantity).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)} className="cursor-pointer">
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Remove</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-6 flex flex-col items-end space-y-4">
                            <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
                            <Button onClick={handleCheckout} size="lg" className="cursor-pointer">
                                Proceed to Checkout
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default CartPage;
