"use client";

import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitContact } from "@/lib/actions/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { contactSchema } from "@/lib/schema";

type ContactValues = z.infer<typeof contactSchema>;

function ContactForm() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", service: undefined, message: "" },
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: ContactValues) => {
    setServerError(null);
    setSuccess(false);
    startTransition(async () => {
      const { error } = await submitContact(values);
      if (error) {
        setServerError(error);
        return;
      }
      setSuccess(true);
      form.reset();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send a Message</CardTitle>
        <CardDescription>
          Share a few details about what you need—I'll respond with availability
          and next steps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Event Photography" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Tell me about your project, date(s), goals..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
            {success && (
              <p className="text-sm text-green-600">
                Message sent! I'll be in touch soon.
              </p>
            )}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ContactPage() {
  return (
    <main className="py-14 md:py-20">
      <div className="mx-auto w-full container px-4 space-y-14">
        <section className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-stone-800">
            Contact
          </h1>
          <p className="text-base md:text-lg text-stone-600 leading-relaxed">
            Ready to book or explore a project? Send a message with any details
            you have—type of service, dates, scope, or questions. I'll reply
            with availability and a tailored next step.
          </p>
        </section>
        <div className="max-w-2xl">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
