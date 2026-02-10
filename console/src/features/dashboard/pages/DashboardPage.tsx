import { Users, Building, MessageSquare, TrendingUp } from 'lucide-react'
import { StatsCard } from '@/features/dashboard/components/StatsCard'
import { DailyUsersChart, WeeklyUsersChart } from '@/features/dashboard/components/Charts'
import { RecentInquiriesTable } from '@/features/dashboard/components/RecentInquiriesTable'

const stats = [
    { title: "총 이용자", value: "8,213", icon: Users, trend: { value: "12.5%", isPositive: true }, className: "border-l-4 border-l-blue-500" },
    { title: "제휴 치과", value: "124", icon: Building, trend: { value: "8", isPositive: true }, className: "border-l-4 border-l-green-500" },
    { title: "신규 문의", value: "36", icon: MessageSquare, trend: { value: "5", isPositive: true }, className: "border-l-4 border-l-orange-500" },
    { title: "이번 주 이용", value: "2,013", icon: TrendingUp, trend: { value: "10.5%", isPositive: false }, className: "border-l-4 border-l-purple-500" },
]

export function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <DailyUsersChart />
                <WeeklyUsersChart />
            </div>

            <RecentInquiriesTable />
        </div>
    )
}

