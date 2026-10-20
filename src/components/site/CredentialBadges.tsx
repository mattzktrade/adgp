const PADDOCK_BADGE = "/F1_Paddock_Club_Premium_2x.png";
const YAS_BADGE = "/Yas_Marina_Official_On_Seller_Premium_2x.png";

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
        src={YAS_BADGE}
        alt="Yas Marina Circuit — Official On-Seller"
        style={{ width: compact ? 180 : 260 }}
        className="h-auto block"
        draggable={false}
      />
    </div>
  );
}
