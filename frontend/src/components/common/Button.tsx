import { type ButtonHTMLAttributes } from "react";

const variants = {
  primary: "btn-primary",
  accent: "btn-accent",
  ghost: "btn-ghost",
  success: "btn-success"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`${variants[variant]} ${className}`} {...props} />;
}
