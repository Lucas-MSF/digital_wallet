import React from "react";

interface LogoProps {
  variant?: "light" | "dark" | "default";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "default",
  className = "",
}) => {
  const logoPath = {
    dark: "/logo-dark.svg",
    light: "/logo-light.svg",
    default: "/logo.svg",
  }[variant];

  return (
    <img src={logoPath} alt="Logo do Minha Carteira" className={className} />
  );
};

export default Logo;
