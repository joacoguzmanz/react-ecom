export default function Banner() {
    return (
        <div className="relative w-full h-[300px]">
            <img
                src="/placeholder.svg?height=300&width=1200"
                alt="Ecommerce Banner"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-white">Welcome to Our Store</h1>
            </div>
        </div>
    )
}
