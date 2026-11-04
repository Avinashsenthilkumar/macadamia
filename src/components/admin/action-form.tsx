"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { ActionState } from "@/lib/admin-action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

const Ctx = createContext<{ state: ActionState; pending: boolean }>({ state: null, pending: false });

/**
 * Admin form wrapper. Submits via a server action without React's automatic form reset,
 * so typed values survive validation errors. Shows success / error feedback and exposes
 * field errors to <FieldMsg>.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  submitLabel,
  submitClassName,
}: {
  action: FormAction;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  submitLabel?: string;
  submitClassName?: string;
}) {
  const [state, dispatch, pending] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <Ctx.Provider value={{ state, pending }}>
      <form
        ref={ref}
        noValidate
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => dispatch(fd));
        }}
      >
        {children}
        {submitLabel ? (
          <div className={cn("mt-6 flex flex-wrap items-center gap-4", submitClassName)}>
            <SubmitButton label={submitLabel} />
            <FormStatus />
          </div>
        ) : null}
      </form>
    </Ctx.Provider>
  );
}

export function useActionFormState() {
  return useContext(Ctx);
}

export function SubmitButton({ label, variant = "primary" }: { label: string; variant?: "primary" | "nut" | "danger" }) {
  const { pending } = useActionFormState();
  return (
    <Button type="submit" variant={variant} disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function FormStatus() {
  const { state } = useActionFormState();
  return (
    <AnimatePresence mode="wait">
      {state?.message ? (
        <motion.p
          key={state.message + String(state.ok)}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          role={state.ok ? "status" : "alert"}
          className={cn("flex items-center gap-2 text-sm font-semibold", state.ok ? "text-emerald-700" : "text-red-700")}
        >
          {state.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {state.message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

export function FieldMsg({ name }: { name: string }) {
  const { state } = useActionFormState();
  const msg = state?.errors?.[name];
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm text-red-700">
      {msg}
    </p>
  );
}
