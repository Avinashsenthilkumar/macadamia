import { FieldMsg } from "@/components/admin/action-form";
import { Hint, Input, Label, Select, Textarea } from "@/components/ui/form";
import { cn } from "@/lib/utils";

type Base = { name: string; label: string; hint?: string; required?: boolean; className?: string };

export function TextField({ name, label, hint, required, className, defaultValue, type = "text", placeholder, maxLength }: Base & { defaultValue?: string | number | null; type?: string; placeholder?: string; maxLength?: number }) {
  return (
    <div className={className}>
      <Label htmlFor={`f-${name}`} required={required}>{label}</Label>
      <Input id={`f-${name}`} name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder} maxLength={maxLength} />
      {hint ? <Hint>{hint}</Hint> : null}
      <FieldMsg name={name} />
    </div>
  );
}

export function TextAreaField({ name, label, hint, required, className, defaultValue, rows = 5, placeholder, mono }: Base & { defaultValue?: string | null; rows?: number; placeholder?: string; mono?: boolean }) {
  return (
    <div className={className}>
      <Label htmlFor={`f-${name}`} required={required}>{label}</Label>
      <Textarea id={`f-${name}`} name={name} rows={rows} defaultValue={defaultValue ?? ""} placeholder={placeholder} className={cn(mono && "font-mono text-sm")} />
      {hint ? <Hint>{hint}</Hint> : null}
      <FieldMsg name={name} />
    </div>
  );
}

export function SelectField({ name, label, hint, required, className, defaultValue, options }: Base & { defaultValue?: string | null; options: { value: string; label: string }[] }) {
  return (
    <div className={className}>
      <Label htmlFor={`f-${name}`} required={required}>{label}</Label>
      <Select id={`f-${name}`} name={name} defaultValue={defaultValue ?? ""}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
      {hint ? <Hint>{hint}</Hint> : null}
      <FieldMsg name={name} />
    </div>
  );
}

export function Toggle({ name, label, hint, defaultChecked }: { name: string; label: string; hint?: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-forest/10 bg-white p-4 transition hover:border-leaf/40">
      <span>
        <span className="block text-sm font-semibold text-deep">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-ink/55">{hint}</span> : null}
        <FieldMsg name={name} />
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-forest/15 transition peer-checked:bg-leaf peer-focus-visible:ring-4 peer-focus-visible:ring-sage/40" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
