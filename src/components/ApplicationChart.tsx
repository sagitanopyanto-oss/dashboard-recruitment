import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { monthlyApplications, departmentData } from '../data/mockData';

export function ApplicationChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Tren Aplikasi & Rekrutmen</h3>
        <p className="text-sm text-slate-500 mt-1">Jumlah aplikasi dan rekrutmen per bulan</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyApplications} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Bar dataKey="applications" name="Aplikasi" fill="#6366f1" radius={[8, 8, 0, 0]} />
          <Bar dataKey="hires" name="Diterima" fill="#a78bfa" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DepartmentChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Rekrutmen per Departemen</h3>
        <p className="text-sm text-slate-500 mt-1">Perbandingan rekrutmen dan lowongan</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={departmentData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="hires" name="Diterima" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} />
          <Line type="monotone" dataKey="openings" name="Lowongan" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
