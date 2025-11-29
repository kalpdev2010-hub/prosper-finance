'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Validation Schema
const formSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  note: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
});

export function TransactionForm({ onClose }: { onClose: () => void }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // 1. Setup Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      note: '',
      type: 'expense',
    },
  });

  // 2. Fetch Categories (or create defaults if empty)
  useEffect(() => {
    async function getCategories() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      let { data, error } = await supabase.from('categories').select('*');

      // If no categories exist, create defaults automatically
      if (!error && (!data || data.length === 0)) {
        const defaults = [
          { name: 'Food', type: 'expense', user_id: user.id },
          { name: 'Rent', type: 'expense', user_id: user.id },
          { name: 'Salary', type: 'income', user_id: user.id },
          { name: 'Entertainment', type: 'expense', user_id: user.id },
        ];
        await supabase.from('categories').insert(defaults);
        const { data: newData } = await supabase.from('categories').select('*');
        setCategories(newData || []);
      } else {
        setCategories(data || []);
      }
    }
    getCategories();
  }, []);

  // 3. Submit Handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from('transactions').insert({
        ...values,
        user_id: user.id,
        date: new Date().toISOString(),
      });

      if (error) {
        alert('Error saving: ' + error.message);
      } else {
        router.refresh();
        onClose();
      }
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Lunch" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save Transaction'}
        </Button>
      </form>
    </Form>
  );
}
