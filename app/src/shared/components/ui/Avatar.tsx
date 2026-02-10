import * as React from "react";
import { View, Text, Image } from "react-native";
import { cn } from "../../lib/utils";

function Avatar({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof View>) {
    return (
        <View
            className={cn(
                "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                className
            )}
            {...props}
        >
            {children}
        </View>
    );
}

function AvatarImage({ className, ...props }: React.ComponentPropsWithoutRef<typeof Image>) {
    return (
        <Image
            className={cn("aspect-square h-full w-full", className)}
            {...props}
        />
    );
}

function AvatarFallback({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof View>) {
    return (
        <View
            className={cn(
                "flex h-full w-full items-center justify-center rounded-full bg-muted",
                className
            )}
            {...props}
        >
            {typeof children === 'string' ? (
                <Text className="text-muted-foreground">{children}</Text>
            ) : (
                children
            )}
        </View>
    );
}

export { Avatar, AvatarImage, AvatarFallback };
