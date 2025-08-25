import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Revenue: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm({ amount: '', description: '' });
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Umsätze</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Umsatz hinzufügen</Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Umsatz hinzufügen</DialogTitle>
              <DialogDescription>
                Erfassen Sie einen neuen Umsatz.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Betrag</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Speichern</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Revenue;

