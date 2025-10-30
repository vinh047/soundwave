import React, { forwardRef, ElementType, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type ButtonProps = {
  children?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  leftIcon?: ElementType;
  rightIcon?: ElementType;
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  as?: ElementType;
  "aria-label"?: string;
  light?: boolean;
  dark?: boolean;
  outline?: boolean;
  ghost?: boolean;
} & React.ComponentPropsWithoutRef<"button">;

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none rounded font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [aria-disabled=true]:cursor-not-allowed [aria-disabled=true]:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600";

const sizes = {
  xs: "h-8 px-3 text-[12px]",
  sm: "h-9 px-3.5 text-[14px]",
  md: "h-10 px-4 text-[16px]",
  lg: "h-12 px-5 text-[18px]",
  xl: "h-14 px-6 text-[20px]",
};

const variants = {
  light: "bg-white text-black hover:bg-gray-100 border border-gray-300",
  dark: "bg-black text-white hover:bg-gray-900",
  outline: "border border-black text-black bg-transparent hover:bg-gray-100",
  ghost: "bg-transparent text-black hover:bg-gray-100",
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size = "md",
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      iconOnly = false,
      loading = false,
      disabled = false,
      fullWidth = false,
      className,
      type = "button",
      as: As = "button",
      "aria-label": ariaLabel,
      light,
      dark,
      outline,
      ghost,
      ...rest
    },
    ref
  ) => {
    const content = (
      <>
        {loading && (
          <Loader2
            aria-hidden
            className={cn("animate-spin", iconOnly ? "h-5 w-5" : "h-4 w-4")}
          />
        )}
        {!loading && LeftIcon && (
          <LeftIcon aria-hidden className={iconOnly ? "h-5 w-5" : "h-4 w-4"} />
        )}
        {children}
        {!loading && RightIcon && (
          <RightIcon aria-hidden className={iconOnly ? "h-5 w-5" : "h-4 w-4"} />
        )}
        {loading && !iconOnly && (
          <span role="status" aria-live="polite" className="sr-only">
            Đang xử lý
          </span>
        )}
      </>
    );

    const iconOnlySize = {
      xs: "h-8 w-8 p-0",
      sm: "h-9 w-9 p-0",
      md: "h-10 w-10 p-0",
      lg: "h-12 w-12 p-0",
      xl: "h-14 w-14 p-0",
    };

    const appliedVariant = light
      ? "light"
      : dark
        ? "dark"
        : outline
          ? "outline"
          : ghost
            ? "ghost"
            : "light";

    const computedClass = cn(
      base,
      variants[appliedVariant],
      iconOnly ? iconOnlySize[size] : sizes[size],
      fullWidth && "w-full",
      className
    );

    const isDisabled = disabled || loading;
    const isNativeButton = As === "button";

    return (
      <As
        ref={ref}
        className={computedClass}
        type={isNativeButton ? type : undefined}
        role={isNativeButton ? undefined : "button"}
        aria-busy={loading || undefined}
        aria-disabled={!isNativeButton && isDisabled ? true : undefined}
        disabled={isNativeButton ? isDisabled : undefined}
        aria-label={iconOnly ? ariaLabel : undefined}
        data-variant={appliedVariant}
        data-size={size}
        {...rest}
      >
        {content}
      </As>
    );
  }
);

Button.displayName = "Button";

// Ví dụ sử dụng
export function BuyNowButton(props: Omit<ButtonProps, "dark">) {
  return (
    <Button dark size="lg" {...props}>
      Mua ngay
    </Button>
  );
}

export function AddToCartButton(props: Omit<ButtonProps, "light">) {
  return (
    <Button light size="lg" {...props}>
      Thêm vào giỏ
    </Button>
  );
}
