const PADDOCK_BADGE = "/F1_Paddock_Club_Premium_2x.png";
const ETHARA_BADGE = "/ethara_logo_transparent.png";

export function CredentialBadges({
  variant = "full",
  className = "",
}: {
  variant?: "full" | "compact";
  className?: string;
}) {
  const compact = variant === "compact";
  return (
    <div className={`flex flex-wrap items-center gap-8 md:gap-10 ${className}`}>
      <img
        src={PADDOCK_BADGE}
        alt="Formula 1 Paddock Club — Authorised Distributor"
        style={{ width: compact ? 210 : 320 }}
        className="h-auto block"
        draggable={false}
      />
      <img
        src={ETHARA_BADGE}
        alt="Ethara — Official Onseller"
        style={{
          width: compact ? 180 : 260,
          height: compact ? 106 : 153,
          objectFit: "cover",
          objectPosition: "center",
        }}
        className="block"
        draggable={false}
      />
    </div>
  );
}
