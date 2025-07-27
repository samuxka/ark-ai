"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    if (response.ok) {
      router.push("/login");
    } else {
      const data = await response.json();
      setError(data.error || "Erro ao cadastrar");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-col items-center justify-center">
          <Image src="/arkai-logo.png" alt="arkai" width={1080} height={1080} className="w-28 dark:invert" />
          <CardTitle className="text-xl">Welcome to Ark.ai</CardTitle>
          <CardDescription>Best bible a.i in the world</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full">Create account</Button>
          </form>
          <p className="mt-2 flex items-center justify-center gap-1">
            Have an account?
            <Link href="/login" className="hover:text-indigo-600 hover:underline">Click here</Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}