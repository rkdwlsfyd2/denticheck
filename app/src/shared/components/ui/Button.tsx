import * as React from "react";
import { Text, Pressable } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonContainerVariants = cva(
    "flex-row items-center justify-center gap-2 rounded-md disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary active:opacity-90",
                destructive: "bg-destructive active:opacity-90",
                outline: "border border-input bg-background active:bg-accent/50",
                secondary: "bg-secondary active:opacity-80",
                ghost: "active:bg-accent/50",
                link: "",
            },
            size: {
                default: "h-11 px-4 py-2", // Increased height from 9 to 11
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-md px-6",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const buttonTextVariants = cva("text-sm font-medium", {
    variants: {
        variant: {
            default: "text-primary-foreground",
            destructive: "text-destructive-foreground",
            outline: "text-foreground",
            secondary: "text-secondary-foreground",
            ghost: "text-accent-foreground",
            link: "text-primary underline",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

interface ButtonProps
    extends React.ComponentPropsWithoutRef<typeof Pressable>,
    VariantProps<typeof buttonContainerVariants> {
    children: React.ReactNode;
    textClassName?: string;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
    ({ className, textClassName, variant, size, children, ...props }, ref) => {
        return (
            <Pressable
                ref={ref}
                className={cn(buttonContainerVariants({ variant, size, className }), "pb-0")} // pb-0 to prevent cutoff on Android if any
                {...props}
            >
                {typeof children === "string" ? (
                    <Text className={cn(buttonTextVariants({ variant }), textClassName)}>
                        {children}
                    </Text>
                ) : (
                    children
                )}
            </Pressable>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonContainerVariants };
