import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    className?: string;
    variant?: "blue" | "green" | "orange" | "purple";
}

export function StatsCard({ title, value, icon: Icon, trend, className, variant = "blue" }: StatsCardProps) {
    return (
        <div className={cn("rounded-xl border bg-white text-card-foreground shadow-sm p-6", className)}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
                <div
                    className={cn(
                        "p-2 rounded-lg",
                        variant === "blue"
                            ? "bg-blue-50 text-blue-600"
                            : variant === "green"
                              ? "bg-green-50 text-green-600"
                              : variant === "orange"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-purple-50 text-purple-600",
                    )}
                >
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="mt-2">
                <div className="text-2xl font-bold">{value}</div>
                {trend && (
                    <p
                        className={cn(
                            "text-xs mt-1 font-medium",
                            trend.isPositive ? "text-green-600" : "text-red-600", // Simple logic, can be adjusted
                        )}
                    >
                        {trend.isPositive ? "+" : ""}
                        {trend.value}
                    </p>
                )}
            </div>
        </div>
    );
}
