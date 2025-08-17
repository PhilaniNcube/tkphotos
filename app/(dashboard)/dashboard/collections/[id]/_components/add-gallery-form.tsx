"use client";

import { useActionState, useEffect, useState } from "react";
import { addGalleryToCollectionAction } from "@/lib/actions/collections";
import { initialLinkGalleryState } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { linkGallerySchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Local form schema: take raw (pre-transform) gallery_id as string; server action will transform.
const formSchema = z.object({
  gallery_id: z.string().min(1, { message: "Select a gallery" }),
  collection_id: z.number(),
});

interface AddGalleryToCollectionFormProps {
  collectionId: number;
  galleries: { id: number; title: string }[];
}

export function AddGalleryToCollectionForm({
  collectionId,
  galleries,
}: AddGalleryToCollectionFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    addGalleryToCollectionAction,
    initialLinkGalleryState
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { gallery_id: "", collection_id: collectionId },
  });
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    if (state.success) {
      setJustSubmitted(true);
      form.reset({ gallery_id: "", collection_id: collectionId });
      router.refresh();
    }
  }, [state, form, collectionId, router]);

  useEffect(() => {
    if (state.fieldErrors) {
      for (const [name, messages] of Object.entries(state.fieldErrors)) {
        form.setError(name as any, {
          message: (messages as string[]).join(". "),
        });
      }
    }
  }, [state.fieldErrors, form]);

  const disableForm = isPending || galleries.length === 0;

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-medium">Add Gallery to Collection</h3>
      {galleries.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          All galleries are already in this collection.
        </p>
      ) : (
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
            className="flex flex-col gap-4 max-w-sm"
          >
            <input type="hidden" name="collection_id" value={collectionId} />
            <FormField
              control={form.control}
              name="gallery_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gallery</FormLabel>
                  <FormControl>
                    <Select
                      disabled={disableForm}
                      onValueChange={(v) => field.onChange(v)}
                      value={field.value || undefined}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gallery" />
                      </SelectTrigger>
                      <SelectContent>
                        {galleries.map((g) => (
                          <SelectItem key={g.id} value={String(g.id)}>
                            {g.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {/* Hidden input to ensure value is included in FormData submit */}
                  <input
                    type="hidden"
                    name="gallery_id"
                    value={field.value || ""}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {state.error && !state.fieldErrors && (
              <p className="text-xs text-red-500">{state.error}</p>
            )}
            {state.success && justSubmitted && (
              <p className="text-xs text-emerald-600">Gallery added.</p>
            )}
            <Button type="submit" size="sm" disabled={disableForm}>
              {isPending ? "Adding..." : "Add"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
