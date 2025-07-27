"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl: "/",
        });
        if (result?.error) {
            setError("Credenciais inválidas");
        } else {
            router.push("/");
        }
    };

    return (
        <section className="w-full h-screen flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader className="flex flex-col items-center justify-center">
                    <Image src="/arkai-logo.png" alt="arkai" width={1080} height={1080} className="w-28 dark:invert" />
                    <CardTitle className="text-xl">Welcome back to Ark.ai</CardTitle>
                    <CardDescription>Best bible a.i in the world</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCredentialsLogin} className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <p className="text-sm">Forget your password? Click here!</p>
                        {error && <p className="text-red-500">{error}</p>}
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                    <p className="mt-2 flex items-center justify-center gap-1 text-sm">
                        Don't have an account yet? 
                        <Link href="/signup" className="hover:text-indigo-600 hover:underline">Click here</Link>
                    </p>
                </CardContent>
            </Card>
        </section>
    );
}