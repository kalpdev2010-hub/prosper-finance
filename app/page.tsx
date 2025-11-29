'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Wallet, PieChart, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-16 flex items-center border-b">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            P
          </div>
          Prosper
        </div>
        <div className="ml-auto">
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-24 bg-gray-50 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Master Your Money
          </h1>
          <p className="mt-4 text-gray-500 md:text-xl">
            Track expenses, set budgets, and grow your wealth.
          </p>
          <Link href="/login">
            <Button size="lg" className="mt-6 gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
        <section className="container px-4 py-16 mx-auto grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Wallet className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Expense Tracking</CardTitle>
            </CardHeader>
            <CardContent>Log your daily spending in seconds.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <PieChart className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>See exactly where your money goes.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>Your data is encrypted and private.</CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
