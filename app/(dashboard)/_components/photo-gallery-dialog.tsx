"use client";

import React, { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGallerySchema } from "@/lib/schema";
import { z } from "zod";
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
import { createGalleryAction } from "@/lib/actions/galleries";
import { initialCreateGalleryState } from "@/lib/schema";
import { Switch } from "@/components/ui/switch";
import { PlusIcon } from "lucide-react";

// Because createGallerySchema adds a default for is_public, RHF form values can use the inferred type directly.
type FormValues = z.input<typeof createGallerySchema>;

// Helper: derive default values from schema with minimal duplication.
const defaultValues: FormValues = {
  title: "",
  slug: "",
  description: "",
  access_key: "",
  event_date: "",
  cover_image: "",
};

const PhotoGalleryDialog: React.FC = () => {
  const [state, formAction, isPending] = useActionState(
    createGalleryAction,
    initialCreateGalleryState
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(createGallerySchema),
    defaultValues,
    mode: "onBlur",
  });

  // Push server validation errors from action into form if present
  useEffect(() => {
    if (state.fieldErrors) {
      for (const [name, messages] of Object.entries(state.fieldErrors)) {
        const list = messages as string[];
        if (form.getFieldState(name as keyof FormValues)) {
          form.setError(name as any, { message: list.join(". ") });
        }
      }
    }
    if (state.success) {
      form.reset(defaultValues);
    }
  }, [state, form]);

  // Auto-generate slug from title if slug untouched
  const titleValue = form.watch("title");
  useEffect(() => {
    const slugDirty = form.getFieldState("slug").isDirty;
    if (!slugDirty) {
      const slug = titleValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (slug) form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [titleValue, form]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Gallery
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Gallery</DialogTitle>
          <DialogDescription>
            Provide details below to create a new gallery.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            action={formAction}
            onSubmit={(e) => {
              // sync RHF validation before server action
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Summer Wedding" {...field} />
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
                    <Input placeholder="summer-wedding" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL-safe slug (lowercase, hyphen separated)
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
            <FormField
              control={form.control}
              name="access_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Key</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Secret key for clients"
                        {...field}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => {
                          const chars =
                            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                          const length = 12;
                          let key = "";
                          for (let i = 0; i < length; i++) {
                            key += chars.charAt(
                              Math.floor(Math.random() * chars.length)
                            );
                          }
                          form.setValue("access_key", key, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                      >
                        Generate
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    6-64 alphanumeric characters required by visitors.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cover_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL / Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Optional cover image"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0 border rounded-md p-3">
                  <div className="space-y-1">
                    <FormLabel className="mb-0">Public</FormLabel>
                    <FormDescription>
                      If enabled, gallery is visible without access key.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(v)}
                    />
                  </FormControl>
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

export default PhotoGalleryDialog;
