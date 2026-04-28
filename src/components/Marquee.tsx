const items = [
  "✦ Free shipping over ₹999",
  "✦ COD available",
  "✦ Made in India",
  "✦ 7-day easy returns",
  "✦ Premium 3D printed quality",
  "✦ Limited drops every month",
];

export const Marquee = () => (
  <div className="border-y border-border/50 bg-muted/30 py-4 overflow-hidden">
    <div className="marquee text-sm font-medium text-muted-foreground">
      {[...items, ...items].map((it, i) => (
        <span key={i} className="shrink-0">{it}</span>
      ))}
    </div>
  </div>
);
