import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { cn } from "../../lib/utils";
import { useColorTheme } from "../../providers/ColorThemeProvider";

const RadioGroupContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
} | null>(null);

function RadioGroup({
    className,
    value,
    onValueChange,
    children,
    ...props
}: React.ComponentPropsWithoutRef<typeof View> & {
    value: string;
    onValueChange: (value: string) => void;
}) {
    return (
        <RadioGroupContext.Provider value={{ value, onValueChange }}>
            <View className={cn("gap-2", className)} {...props}>
                {children}
            </View>
        </RadioGroupContext.Provider>
    );
}

function RadioGroupItem({
    value,
    className,
    ...props
}: React.ComponentPropsWithoutRef<typeof TouchableOpacity> & { value: string }) {
    const context = React.useContext(RadioGroupContext);
    const { theme } = useColorTheme();
    const isSelected = context?.value === value;

    return (
        <TouchableOpacity
            onPress={() => context?.onValueChange(value)}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 items-center justify-center",
                className
            )}
            style={{ borderColor: theme.primary }}
            {...props}
        >
            {isSelected && (
                <View
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                />
            )}
        </TouchableOpacity>
    );
}

export { RadioGroup, RadioGroupItem };
