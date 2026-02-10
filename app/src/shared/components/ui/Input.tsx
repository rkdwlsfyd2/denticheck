import * as React from "react";
import { TextInput } from "react-native";
import { cn } from "../../lib/utils";
import { useColorTheme } from "../../providers/ColorThemeProvider";

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, React.ComponentPropsWithoutRef<typeof TextInput>>(
    ({ className, ...props }, ref) => {
        const { theme } = useColorTheme();
        return (
            <TextInput
                ref={ref}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base text-foreground placeholder:text-muted-foreground",
                    className
                )}
                placeholderTextColor={theme.muted ? "#717182" : "#999"} // Defaulting to muted-foreground color roughly
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
