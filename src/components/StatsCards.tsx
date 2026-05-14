import { Users, Briefcase, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, HeartPulse } from 'lucide-react';
import { useRecruitment } from '../context/RecruitmentContext';

export function StatsCards() {
  const { candidates, jobs, interviews } = useRecruitment();

  const totalCandidates = candidates.length;
  const activeJobs = jobs.filter(j => j.status === 'Active').length;
  const scheduledInterviews = interviews.filter(i => i.status === 'Scheduled').length;
  const hiredThisMonth = candidates.filter(c => c.stage === 'Hired').length;
  const medicalCount = candidates.filter(c => c.stage === 'Medical').length;

  const stats = [
    {
      title: 'Total Kandidat',
      value: totalCandidates,
      change: '+12.5%',
      isPositive: true,
      icon: Users,
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Lowongan Aktif',
      value: activeJobs,
      change: '+3',
      isPositive: true,
      icon: Briefcase,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Wawancara Terjadwal',
      value: scheduledInterviews,
      change: '-2',
      isPositive: false,
      icon: Calendar,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Medical Check-up',
      value: medicalCount,
      change: `${medicalCount}`,
      isPositive: true,
      icon: HeartPulse,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Diterima (Hired)',
      value: hiredThisMonth,
      change: '+28%',
      isPositive: true,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
              }`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
}
