import "@/firebaseConfig.js"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useState } from "react"
import { useUser } from "@/context/UserContext"
import { Link } from "react-router"

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSeller, setIsSeller] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const auth = getAuth();
    const db = getFirestore();
    const googleProvider = new GoogleAuthProvider();

    const { user } = useUser();

    const handleSubmit = async (): Promise<void> => {
        setError(null);
        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                const firebaseUser = userCredential.user;

                // Save the user's role
                await setDoc(doc(db, "user", firebaseUser.uid), {
                    email: firebaseUser.email,
                    role: isSeller ? "seller" : "user",
                });

                setIsSeller(isSeller); // Update state based on chosen role during registration
            } else {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                const firebaseUser = userCredential.user;

                // Retrieve role from Firestore
                const userDoc = await getDoc(doc(db, "user", firebaseUser.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    setIsSeller(role === "seller"); // Set isSeller if role is "seller"
                }
            }
        } catch (err: any) {
            setError(err.message);
            console.log(error);
        }
    };

    const handleGoogleSignIn = async (): Promise<void> => {
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            // Save the user's default role as "user"
            const userDocRef = doc(db, "user", firebaseUser.uid);
            await setDoc(userDocRef, { email: firebaseUser.email, role: "user" }, { merge: true });

            // Check the role in Firestore
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                setIsSeller(role === "seller");
            }
        } catch (err: any) {
            setError(err.message);
            console.log(error);
        }
    };

    const handleSignOut = async (): Promise<void> => {
        await signOut(auth);
        setIsSeller(false); // Reset isSeller after sign out
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {user ? (
                <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto mt-10">
                    <div className="flex-col items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.email}</h1>
                        <Badge variant="secondary">{isSeller ? "Vendedor" : "Comprador"}</Badge>
                    </div>
                    {isSeller && (
                        <Button className="w-full cursor-pointer mb-4">
                            <Link to="/admin">Go to Dashboard</Link>
                        </Button>
                    )}
                    <Button onClick={handleSignOut} className="w-full cursor-pointer">
                        Sign Out
                    </Button>
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{isSignUp ? "Sign up" : "Log in"}</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                {isSignUp && (
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="seller" checked={isSeller} onCheckedChange={(checked) => setIsSeller(checked as boolean)} />
                                        <Label htmlFor="seller">Register as seller</Label>
                                    </div>
                                )}
                                <Button type="button" className="w-full cursor-pointer" onClick={handleSubmit}>
                                    {isSignUp ? "Register" : "Login"}
                                </Button>
                                <Button variant="outline" className="w-full cursor-pointer" onClick={handleGoogleSignIn}>
                                    Login with Google
                                </Button>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                {isSignUp ? "Already have en account? " : "Don't have an account? "}
                                <span className="underline underline-offset-4 cursor-pointer" onClick={() => setIsSignUp(!isSignUp)}>
                                    {isSignUp ? "Log in" : "Sign Up"}
                                </span>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

