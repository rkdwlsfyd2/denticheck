import * as React from "react";
import { Text, Pressable } from "react-native";
import { cn } from "../../lib/utils";

const Label = React.forwardRef<React.ElementRef<typeof Text>, React.ComponentPropsWithoutRef<typeof Text>>(
    ({ className, onPress, ...props }, ref) => {
        return (
            <Pressable onPress={onPress}>
                <Text
                    ref={ref}
                    className={cn(
                        "text-sm font-medium leading-none text-foreground opacity-70",
                        className
                    )}
                    {...props}
                />
            </Pressable>
        );
    }
);
Label.displayName = "Label";

export { Label };
