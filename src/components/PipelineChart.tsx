import { useRecruitment } from '../context/RecruitmentContext';

const stageLabels: Record<string, string> = {
  'Applied': 'Lamaran',
  'Screening': 'Screening',
  'Interview': 'Interview',
  'Assessment': 'Assessment',
  'Offer': 'Offering',
  'Medical': 'Medical',
  'Hired': 'Hired',
};

export function PipelineChart() {
  const { candidates } = useRecruitment();

  const pipelineData = [
    { name: 'Applied',    label: stageLabels['Applied'],    value: candidates.filter(c => c.stage === 'Applied').length,    color: '#6366f1' },
    { name: 'Screening',  label: stageLabels['Screening'],  value: candidates.filter(c => c.stage === 'Screening').length,  color: '#8b5cf6' },
    { name: 'Interview',  label: stageLabels['Interview'],  value: candidates.filter(c => c.stage === 'Interview').length,  color: '#a78bfa' },
    { name: 'Assessment', label: stageLabels['Assessment'], value: candidates.filter(c => c.stage === 'Assessment').length, color: '#f59e0b' },
    { name: 'Offer',      label: stageLabels['Offer'],      value: candidates.filter(c => c.stage === 'Offer').length,      color: '#22c55e' },
    { name: 'Medical',    label: stageLabels['Medical'],    value: candidates.filter(c => c.stage === 'Medical').length,    color: '#06b6d4' },
    { name: 'Hired',      label: stageLabels['Hired'],      value: candidates.filter(c => c.stage === 'Hired').length,      color: '#10b981' },
  ];

  const total = candidates.filter(c => c.stage !== 'Rejected').length;
  const maxValue = Math.max(...pipelineData.map(d => d.value), 1);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Pipeline Rekrutmen</h3>
          <p className="text-sm text-slate-500 mt-1">Distribusi kandidat per tahap</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            Aktif: {total}
          </span>
          <span className="flex items-center gap-1.5 text-red-500">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            Ditolak: {candidates.filter(c => c.stage === 'Rejected').length}
          </span>
        </div>
      </div>

      {/* Funnel visualization */}
      <div className="space-y-3">
        {pipelineData.map((item) => (
          <div key={item.name} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-700">{item.value}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-90"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
