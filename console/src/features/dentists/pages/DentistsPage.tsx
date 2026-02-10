export function DentistsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">제휴 치과 관리</h2>
                    <p className="text-slate-500">제휴 치과 정보와 광고 노출을 관리하세요</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    + 치과 추가
                </button>
            </div>
            <div className="rounded-xl border bg-white shadow-sm p-6 flex items-center justify-center h-96 text-slate-400">
                제휴 치과 목록 준비 중...
            </div>
        </div>
    )
}
