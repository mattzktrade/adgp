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
    <div className={`flex flex-row flex-nowrap items-center gap-5 md:gap-8 ${className}`}>
      <img
        src={PADDOCK_BADGE}
        alt="Formula 1 Paddock Club — Authorised Distributor"
        className={`w-auto object-contain ${compact ? "h-14 md:h-16" : "h-16 md:h-24"}`}
        draggable={false}
      />
      <img
        src={ETHARA_BADGE}
        alt="Ethara — Official Onseller"
        className={`w-auto object-contain ${compact ? "h-14 md:h-16" : "h-16 md:h-24"}`}
        draggable={false}
      />
    </div>
  );
}
