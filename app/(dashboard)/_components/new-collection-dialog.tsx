"use client";

import React, { useActionState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  createCollectionSchema,
  initialCreateCollectionState,
} from "@/lib/schema";
import { createCollectionAction } from "@/lib/actions/collections";
import { PlusIcon } from "lucide-react";

type FormValues = z.input<typeof createCollectionSchema>;

const defaultValues: FormValues = {
  name: "",
  slug: "",
  description: "",
};

const NewCollectionDialog: React.FC = () => {
  const [state, formAction, isPending] = useActionState(
    createCollectionAction,
    initialCreateCollectionState
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues,
    mode: "onBlur",
  });

  // Inject server-side validation errors into RHF
  useEffect(() => {
    if (state.fieldErrors) {
      for (const [name, messages] of Object.entries(state.fieldErrors)) {
        const list = messages as string[];
        form.setError(name as any, { message: list.join(". ") });
      }
    }
    if (state.success) {
      form.reset(defaultValues);
    }
  }, [state, form]);

  // Auto-generate slug from name when slug not manually touched
  const nameValue = form.watch("name");
  useEffect(() => {
    const slugDirty = form.getFieldState("slug").isDirty;
    if (!slugDirty) {
      const slug = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (slug) form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [nameValue, form]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>
            Provide the details below to create a new collection.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            action={formAction}
            onSubmit={(e) => {
              const valid = form.trigger();
              if (!valid) {
                e.preventDefault();
                return;
              }
            }}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Weddings" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="weddings" {...field} />
                  </FormControl>
                  <FormDescription>
                    Lowercase, hyphen separated identifier.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description (max 1000 chars)"
                      {...field}
                      value={field.value ?? ""}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {state.error && !state.fieldErrors && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCollectionDialog;
