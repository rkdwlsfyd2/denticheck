import * as React from "react";
import CheckboxPrimitive from "expo-checkbox";
import { cn } from "../../lib/utils";
import { useColorTheme } from "../../providers/ColorThemeProvider";

function Checkbox({ className, value, onValueChange, ...props }: React.ComponentProps<typeof CheckboxPrimitive> & { className?: string }) {
    const { theme } = useColorTheme();

    return (
        <CheckboxPrimitive
            value={value}
            onValueChange={onValueChange}
            color={value ? theme.primary : undefined}
            className={cn("h-4 w-4 rounded-sm", className)}
            {...props}
        />
    );
}

export { Checkbox };
