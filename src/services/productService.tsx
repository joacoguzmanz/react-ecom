import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Product } from "@/types/product";

// Obté tots els productes
export const fetchProducts = async (): Promise<Product[]> => {
    const productsCollection = collection(db, "products");
    const productSnapshot = await getDocs(productsCollection);

    return productSnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Product, "id">;
        const product: Product = { id: doc.id, ...data };
        return product;
    });
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
};

// Obté productes associats a un venedor específic
export const fetchSellerProducts = async (sellerId: string): Promise<Product[]> => {
    const productsCollection = collection(db, "products");
    const productsQuery = query(productsCollection, where("sellerId", "==", sellerId));
    const productSnapshot = await getDocs(productsQuery);

    return productSnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Product, "id">;
        const product: Product = { id: doc.id, ...data };
        return product;
    });
};

