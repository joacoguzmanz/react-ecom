import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { fetchProducts } from "@/services/productService";

interface CategoryListProps {
    selectedCategory: string
    onSelectCategory: (category: string) => void
    priceRange: [number, number]
    onPriceRangeChange: (value: [number, number]) => void
    maxPrice: number
}

const CategoryList = ({ selectedCategory, onSelectCategory, priceRange, onPriceRangeChange, maxPrice }: CategoryListProps) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const products = await fetchProducts();
            const uniqueCategories = [...new Set(products.map((p) => p.category))];
            setSelectedCategories(["Todos", ...uniqueCategories]);
        };
        fetchCategories();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                {selectedCategories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="w-full justify-start mb-2 cursor-pointer"
                        onClick={() => onSelectCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4">Price Range</h2>
                <Slider
                    min={0}
                    max={maxPrice}
                    step={1}
                    value={priceRange}
                    onValueChange={onPriceRangeChange}
                    className="mb-4 cursor-pointer"
                />
                <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
