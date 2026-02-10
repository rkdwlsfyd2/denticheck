import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dailyData = [
    { name: '월', users: 240 },
    { name: '화', users: 300 },
    { name: '수', users: 290 },
    { name: '목', users: 380 },
    { name: '금', users: 420 },
    { name: '토', users: 180 },
    { name: '일', users: 150 },
];

const weeklyData = [
    { name: '1주', users: 1800 },
    { name: '2주', users: 2100 },
    { name: '3주', users: 2300 },
    { name: '4주', users: 2000 },
];

export function DailyUsersChart() {
    return (
        <div className="rounded-xl border bg-white shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">일일 이용자 현황</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function WeeklyUsersChart() {
    return (
        <div className="rounded-xl border bg-white shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">주간 이용자 현황</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} domain={[0, 2400]} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
