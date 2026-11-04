"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import type { ActionState } from "@/lib/admin-action";
import { cn } from "@/lib/utils";

/**
 * Runs a bound server action from a button. Destructive actions use a two-step
 * "click again to confirm" pattern instead of a browser dialog.
 */
export function ActionButton({
  action,
  children,
  confirm,
  className,
  tone = "default",
}: {
  action: () => Promise<ActionState>;
  children: React.ReactNode;
  confirm?: string;
  className?: string;
  tone?: "default" | "danger";
}) {
  const [armed, setArmed] = useState(false);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const router = useRouter();

  const run = () => {
    if (confirm && !armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 4000);
      return;
    }
    setArmed(false);
    start(async () => {
      const res = await action();
      if (res) {
        setMsg({ ok: res.ok, text: res.message });
        setTimeout(() => setMsg(null), 3500);
      }
      router.refresh();
    });
  };

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition disabled:opacity-50",
          armed ? "bg-red-600 text-white" : tone === "danger" ? "text-red-700 hover:bg-red-50" : "text-forest hover:bg-forest/5",
          className,
        )}
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        {armed ? confirm : children}
      </button>
      <AnimatePresence>
        {msg ? (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className={cn("absolute right-0 top-full z-20 mt-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold shadow-soft", msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800")}
          >
            {msg.text}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
