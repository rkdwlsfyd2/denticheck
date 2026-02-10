import * as React from "react";
import { View } from "react-native";
import { cn } from "../../lib/utils";
import { useColorTheme } from "../../providers/ColorThemeProvider";

function Progress({ className, value = 0, ...props }: React.ComponentPropsWithoutRef<typeof View> & { value?: number }) {
    const { theme } = useColorTheme();
    return (
        <View
            className={cn(
                "relative h-4 w-full overflow-hidden rounded-full bg-secondary/20",
                className
            )}
            {...props}
        >
            <View
                className="h-full flex-1 bg-primary transition-all"
                style={{ width: `${value}%`, backgroundColor: theme.primary }}
            />
        </View>
    );
}

export { Progress };
