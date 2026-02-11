interface LogoProps {
  size?: "sm" | "md" | "lg" | number; // allow numeric size too
}

const sizeClasses = {
  sm: "w-24 h-20",
  md: "w-28 h-24",
  lg: "w-38 h-32",
};

export const Logo = ({ size = "lg" }: LogoProps) => {
  const sizeClass =
    typeof size === "number" ? `w-[${size}px] h-[${size}px]` : sizeClasses[size];

  return (
    <div className="flex items-center justify-center">
      <img
        src="/logo.png"
        alt="Adventure Holidays"
        className={`${sizeClass} object-contain`}
      />
    </div>
  );
};
