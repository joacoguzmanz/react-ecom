import { BrowserRouter, Routes, Route } from "react-router";
import Authentication from "./pages/Authentication"
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/Cart";
import { UserProvider } from "./context/UserContext";

function App() {
    return (
        <UserProvider>
            <CartProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Authentication />} />
                        <Route path="/admin" element={<Dashboard />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<CartPage />} />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </UserProvider>
    )
}

export default App
