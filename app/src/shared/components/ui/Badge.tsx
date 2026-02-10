import * as React from "react";
import { View, Text } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary",
                secondary:
                    "border-transparent bg-secondary",
                destructive:
                    "border-transparent bg-destructive",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

/* 
  Note regarding Badge text color:
  In web setup, text color helper classes (text-primary-foreground) are part of badgeVariants.
  In RN, we might need separate styling for Text or assume children handle it. 
  For simplicity here, we add some default Text styles based on variant.
*/

const badgeTextVariants = cva("text-xs font-semibold", {
    variants: {
        variant: {
            default: "text-primary-foreground",
            secondary: "text-secondary-foreground",
            destructive: "text-destructive-foreground",
            outline: "text-foreground",
        }
    },
    defaultVariants: {
        variant: "default"
    }
});

export interface BadgeProps
    extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, children, ...props }: BadgeProps) {
    return (
        <View className={cn(badgeVariants({ variant }), className)} {...props}>
            {typeof children === 'string' ? (
                <Text className={badgeTextVariants({ variant })}>{children}</Text>
            ) : (
                children
            )}
        </View>
    );
}

export { Badge, badgeVariants };
