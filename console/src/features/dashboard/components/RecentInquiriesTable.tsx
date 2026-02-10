import { cn } from '@/shared/lib/utils'

const inquiries = [
    { id: 1, user: '김민수', dentist: '서울치과', title: '상품 문의', date: '2026-02-10', status: '대기' },
    { id: 2, user: '이지은', dentist: '강남치과', title: '보험 문의', date: '2026-02-10', status: '처리중' },
    { id: 3, user: '박철수', dentist: '부산치과', title: '결제 문의', date: '2026-02-09', status: '완료' },
    { id: 4, user: '정수현', dentist: '대구치과', title: '일반 문의', date: '2026-02-09', status: '대기' },
]

export function RecentInquiriesTable() {
    return (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold">최근 문의 현황</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-3 font-medium">ID</th>
                            <th className="px-6 py-3 font-medium">사용자</th>
                            <th className="px-6 py-3 font-medium">치과</th>
                            <th className="px-6 py-3 font-medium">제목</th>
                            <th className="px-6 py-3 font-medium">날짜</th>
                            <th className="px-6 py-3 font-medium">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inquiries.map((inquiry) => (
                            <tr key={inquiry.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{inquiry.id}</td>
                                <td className="px-6 py-4 text-slate-600">{inquiry.user}</td>
                                <td className="px-6 py-4 text-slate-600">{inquiry.dentist}</td>
                                <td className="px-6 py-4 text-slate-600">{inquiry.title}</td>
                                <td className="px-6 py-4 text-slate-500">{inquiry.date}</td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                        inquiry.status === '대기' && "bg-yellow-50 text-yellow-600 border-yellow-200",
                                        inquiry.status === '처리중' && "bg-blue-50 text-blue-600 border-blue-200",
                                        inquiry.status === '완료' && "bg-green-50 text-green-600 border-green-200"
                                    )}>
                                        {inquiry.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
