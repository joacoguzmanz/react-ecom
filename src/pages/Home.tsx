import { useMemo, useState, useEffect } from "react";
import Banner from "@/components/banner";
import CategoryList from "@/components/category-list";
import ProductGrid from "@/components/product-grid";
import { fetchProducts } from "@/services/productService";

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos")
    const [products, setProducts] = useState<{ price: number }[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])

    useEffect(() => {
        const fetchData = async () => {
            const fetchedProducts = await fetchProducts();
            setProducts(fetchedProducts);

            const maxPrice = Math.max(...fetchedProducts.map((p) => p.price), 0);
            setPriceRange([0, maxPrice]); // Set the initial price range after fetching data
        };

        fetchData();
    }, []);

    const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price)), [products])

    return (
        <main className="min-h-screen">
            <Banner />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/4">
                        <CategoryList
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            priceRange={priceRange}
                            onPriceRangeChange={setPriceRange}
                            maxPrice={maxPrice}
                        />
                    </div>
                    <div className="w-full md:w-3/4">
                        <ProductGrid category={selectedCategory} priceRange={priceRange} />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home;
