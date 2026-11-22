"use client";

import * as React from "react";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectList,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select";
import { Textarea } from "@ui-sdk/react/textarea";
import { toast } from "@ui-sdk/react/toast";
import { Check, CheckCircle2, ChevronDown, Send } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import { submitContact } from "@/lib/actions/contact";
import { trackContactForm, trackServiceInquiry } from "@/lib/analytics";
import {
  contactSchema,
  SERVICE_OPTIONS,
  type ContactInput,
  type ServiceSelectOption,
} from "@/lib/schema";

interface ContactInquiryFormSectionProps {
  initialService?: string;
  serviceOptions?: ServiceSelectOption[];
}

type FieldErrors = Partial<Record<"name" | "email" | "service" | "message", string>>;

function extractEstimateBadge(
  serviceValue: string,
  options: ServiceSelectOption[]
): string {
  if (!serviceValue) return "Custom Quote";
  const match = options.find((opt) => opt.value === serviceValue);
  if (!match) return "Custom Quote";
  if (match.rate) return `Est. ${match.rate}`;
  const rateMatch = match.label.match(/\(([^)]+)\)/);
  return rateMatch ? `Est. ${rateMatch[1]}` : "Custom Quote";
}

export function ContactInquiryFormSection({
  initialService = "",
  serviceOptions = SERVICE_OPTIONS,
}: ContactInquiryFormSectionProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [service, setService] = React.useState(initialService);
  const [eventDetails, setEventDetails] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const estimateLabel = React.useMemo(
    () => extractEstimateBadge(service, serviceOptions),
    [service, serviceOptions]
  );

  const clearFieldError = (field: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const parsed = contactSchema.safeParse({
      name: name.trim(),
      email: email.trim(),
      service: service ? service : undefined,
      message: message.trim(),
    });

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          (key === "name" ||
            key === "email" ||
            key === "service" ||
            key === "message") &&
          !nextErrors[key]
        ) {
          nextErrors[key] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const finalMessage = eventDetails.trim()
      ? `Event Date / Location: ${eventDetails.trim()}\n\n${parsed.data.message}`
      : parsed.data.message;

    const payload: ContactInput = {
      name: parsed.data.name,
      email: parsed.data.email,
      service: parsed.data.service,
      message: finalMessage,
    };

    try {
      const result = await submitContact(payload);
      if (result.error) {
        setSubmitError(result.error);
        toast.error("Could not send inquiry", {
          description: result.error,
        });
        return;
      }

      trackContactForm();
      if (parsed.data.service) {
        trackServiceInquiry(parsed.data.service);
      }

      toast.success("Inquiry sent", {
        description: "TK Media will respond within 24 hours.",
      });
      setSubmitted(true);
    } catch {
      const fallback = "An unexpected error occurred. Please try again.";
      setSubmitError(fallback);
      toast.error("Could not send inquiry", {
        description: fallback,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setEventDetails("");
    setMessage("");
    setErrors({});
    setSubmitError(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="lg:col-span-7">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center rounded-3xl border border-outline-variant/60 bg-surface-container-lowest px-8 py-16 text-center shadow-sm"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <span className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Confirmed
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
            Inquiry Received
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-on-surface-variant sm:text-base">
            Thank you for contacting TK Media. We have logged your booking brief
            and will reply to{" "}
            <span className="font-semibold text-on-surface">{email}</span>{" "}
            within 24 hours.
          </p>
          <div className="mt-8">
            <AppButton type="button" variant="outline" onClick={handleReset}>
              Send Another Inquiry
            </AppButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-7">
      <div className="rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-outline-variant/50 pb-6">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              02 / Booking Inquiry
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-on-surface">
              Tell Us About Your Project
            </h2>
          </div>

          <span className="inline-flex items-center rounded-full bg-tertiary-fixed px-3.5 py-1.5 font-mono text-xs font-semibold text-on-tertiary-fixed">
            {estimateLabel}
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field name="name" invalid={Boolean(errors.name)} className="space-y-2">
              <FieldLabel className="block text-xs font-semibold uppercase tracking-wider text-on-surface">
                Full Name
              </FieldLabel>
              <Input
                name="name"
                type="text"
                value={name}
                onValueChange={(next) => {
                  setName(next);
                  clearFieldError("name");
                }}
                placeholder="e.g. Luyanda Ndlovu"
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
              />
              <FieldError
                match={Boolean(errors.name)}
                className="text-xs font-medium text-error"
              >
                {errors.name}
              </FieldError>
            </Field>

            <Field name="email" invalid={Boolean(errors.email)} className="space-y-2">
              <FieldLabel className="block text-xs font-semibold uppercase tracking-wider text-on-surface">
                Email Address
              </FieldLabel>
              <Input
                name="email"
                type="email"
                value={email}
                onValueChange={(next) => {
                  setEmail(next);
                  clearFieldError("email");
                }}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
              />
              <FieldError
                match={Boolean(errors.email)}
                className="text-xs font-medium text-error"
              >
                {errors.email}
              </FieldError>
            </Field>
          </div>

          <Field name="service" invalid={Boolean(errors.service)} className="space-y-2">
            <FieldLabel className="block text-xs font-semibold uppercase tracking-wider text-on-surface">
              Service &amp; Pricing Tier
            </FieldLabel>
            <Select
              name="service"
              items={serviceOptions}
              value={service || null}
              onValueChange={(next) => {
                setService(typeof next === "string" ? next : "");
                clearFieldError("service");
              }}
            >
              <SelectTrigger className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-outline-variant bg-surface px-4 text-left text-sm text-on-surface hover:border-primary/60 focus:border-primary focus:outline-none cursor-pointer">
                <SelectValue placeholder="Select a photography or media service" />
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-on-surface-variant"
                  aria-hidden="true"
                />
              </SelectTrigger>
              <SelectContent
                sideOffset={6}
                className="z-50 max-h-72 w-[var(--anchor-width)] overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-lowest p-1.5 shadow-xl"
              >
                <SelectList className="flex flex-col gap-0.5">
                  {serviceOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container data-[highlighted]:bg-surface-container data-[selected]:bg-primary-fixed/60 data-[selected]:font-semibold data-[selected]:text-primary"
                    >
                      <span className="truncate">{option.label}</span>
                      <SelectItemIndicator className="shrink-0 text-primary">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </SelectItemIndicator>
                    </SelectItem>
                  ))}
                </SelectList>
              </SelectContent>
            </Select>
            <FieldError
              match={Boolean(errors.service)}
              className="text-xs font-medium text-error"
            >
              {errors.service}
            </FieldError>
          </Field>

          <Field name="eventDetails" className="space-y-2">
            <FieldLabel className="block text-xs font-semibold uppercase tracking-wider text-on-surface">
              Event Date / Location
            </FieldLabel>
            <Input
              name="eventDetails"
              type="text"
              value={eventDetails}
              onValueChange={setEventDetails}
              placeholder="e.g. 14 November 2026 • East London, Eastern Cape"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
            />
          </Field>

          <Field
            name="message"
            invalid={Boolean(errors.message)}
            className="space-y-2"
          >
            <FieldLabel className="block text-xs font-semibold uppercase tracking-wider text-on-surface">
              Project Details &amp; Vision
            </FieldLabel>
            <Textarea
              name="message"
              rows={5}
              value={message}
              onValueChange={(next) => {
                setMessage(next);
                clearFieldError("message");
              }}
              placeholder="Tell us about your event schedule, guest count, key moments, or deliverables..."
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
            />
            <FieldError
              match={Boolean(errors.message)}
              className="text-xs font-medium text-error"
            >
              {errors.message}
            </FieldError>
          </Field>

          {submitError && (
            <div
              role="alert"
              className="rounded-xl border border-error/40 bg-error-container/60 px-4 py-3 text-sm font-medium text-on-error-container"
            >
              {submitError}
            </div>
          )}

          <div className="pt-2">
            <AppButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              data-agent-confirm="Sends your booking inquiry email to TK Media"
              className="w-full justify-center"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              <span>{isSubmitting ? "Sending Inquiry..." : "Send Inquiry"}</span>
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
