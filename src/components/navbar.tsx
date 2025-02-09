import { Link } from "react-router"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ShoppingCart, Search, User } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useUser } from "@/context/UserContext"

export default function Navbar() {
    const { cart } = useCart();
    const { user } = useUser();

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to='/'>
                            Mi Tienda
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input type="text" placeholder="Search products..." className="w-full pl-10 pr-4" />
                        </div>
                    </div>

                    {/* Cart and Login */}
                    <div className="flex items-center">
                        <Link to='/cart' className="text-gray-600 hover:text-gray-800 mr-4 relative">
                            <ShoppingCart className="h-6 w-6" />
                            {cart.length > 0 && (
                                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-2">
                                    {cart.length}
                                </Badge>
                            )}
                        </Link>
                        {user ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-700">Hi, {user.email}</span>
                                <Button asChild>
                                    <Link to="/auth">Profile</Link>
                                </Button>
                            </div>
                        ) : (
                            <Button asChild>
                                <span className="flex items-center">
                                    <User className="h-5 w-5" />
                                    <Link to="/auth">Log in</Link>
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
