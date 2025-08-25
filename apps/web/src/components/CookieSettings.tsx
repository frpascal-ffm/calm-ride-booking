"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

export function CookieSettings({ children }: { children: ReactNode }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed inset-0 m-auto flex max-w-md flex-col rounded-md bg-white p-6 shadow-lg focus:outline-none">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">Cookie-Einstellungen</Dialog.Title>
            <Dialog.Close aria-label="Schließen" className="rounded p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-2 text-sm">
            Hier können Sie Ihre Einwilligungen anpassen. Diese Komponente ist ein Stub für einen Consent-Manager.
          </Dialog.Description>
          <div className="mt-4 text-right">
            <Dialog.Close className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90">
              Schließen
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
