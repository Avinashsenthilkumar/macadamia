export function MapEmbed({ query, title, className }: { query: string; title: string; className?: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className ?? "h-full min-h-72 w-full rounded-3xl border-0 grayscale-[30%]"}
      allowFullScreen
    />
  );
}

export function mapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
