import { MapPin, Clock, Users, Pencil, Trash2, X, EyeOff, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useRecruitment } from '../context/RecruitmentContext';
import { Job } from '../data/mockData';

const statusColors: Record<string, string> = {
  'Active': 'bg-emerald-100 text-emerald-700',
  'Closed': 'bg-slate-100 text-slate-600',
  'Draft': 'bg-yellow-100 text-yellow-700',
};

const statuses = ['Active', 'Closed', 'Draft'] as const;

function formatRupiah(num: number) {
  if (num >= 1000000) {
    const m = num / 1000000;
    return m % 1 === 0 ? `${m}jt` : `${m.toFixed(1).replace('.0', '')}jt`;
  }
  return num.toLocaleString('id-ID');
}

export function JobListings({ onSelectForApply }: { onSelectForApply: (id: number) => void }) {
  const { jobs, addJob, updateJob, deleteJob, canCreateOrDelete, canCreateJobs } = useRecruitment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    minSalary: 0,
    maxSalary: 0,
    hiddenSalary: false,
    status: 'Active' as Job['status'],
    applicants: 0
  });

  const handleOpenModal = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        hiddenSalary: job.hiddenSalary,
        status: job.status,
        applicants: job.applicants,
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        minSalary: 0,
        maxSalary: 0,
        hiddenSalary: false,
        status: 'Active',
        applicants: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingJob) {
      updateJob(editingJob.id, formData);
    } else {
      addJob({
        ...formData,
        postedDate: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    deleteJob(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Lowongan Pekerjaan</h3>
            <p className="text-sm text-slate-500 mt-1">Semua posisi yang sedang dibuka ({jobs.length} lowongan)</p>
          </div>
          {canCreateJobs && (
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 w-fit"
            >
              + Buat Lowongan
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{job.department}</p>
              </div>
              <div className="flex gap-1 items-center">
                {job.status === 'Active' && (
                  <button 
                    onClick={() => onSelectForApply(job.id)} 
                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" 
                    title="Lihat Halaman Pendaftaran (Posting Publik)"
                  >
                    <ExternalLink size={16} />
                  </button>
                )}
                <button onClick={() => handleOpenModal(job)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                  <Pencil size={16} />
                </button>
                {canCreateOrDelete && (
                  <button onClick={() => setDeleteConfirmId(job.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Hapus">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[job.status]}`}>
                {job.status}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                <MapPin size={12} /> {job.location}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                <Clock size={12} /> {job.type}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Users size={14} className="text-indigo-500" />
                <span className="font-semibold">{job.applicants}</span> pelamar
              </div>
              {job.hiddenSalary ? (
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">
                  <EyeOff size={14} />
                  <span className="italic">Gaji dirahasiakan</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  <span>Rp {formatRupiah(job.minSalary)} - {formatRupiah(job.maxSalary)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="col-span-full py-8 text-center text-slate-500">
            Tidak ada lowongan pekerjaan
          </div>
        )}
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {editingJob ? 'Edit Lowongan' : 'Buat Lowongan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Pekerjaan</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Departemen</label>
                  <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as Job['status']})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Salary Section with Hidden Checkbox */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-slate-700">Informasi Gaji</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hiddenSalary}
                      onChange={e => setFormData({...formData, hiddenSalary: e.target.checked})}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-medium text-slate-600">Sembunyikan gaji</span>
                  </label>
                </div>
                {formData.hiddenSalary ? (
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
                    <EyeOff size={14} />
                    <span>Gaji akan ditampilkan sebagai "Gaji dirahasiakan" di publik</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Min Salary (Rp)</label>
                      <input required type="number" min="0" step="500000" placeholder="15000000" value={formData.minSalary || ''} onChange={e => setFormData({...formData, minSalary: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Max Salary (Rp)</label>
                      <input required type="number" min="0" step="500000" placeholder="25000000" value={formData.maxSalary || ''} onChange={e => setFormData({...formData, maxSalary: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors text-sm">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Lowongan?</h3>
            <p className="text-sm text-slate-500 mb-6">Lowongan akan dihapus secara permanen.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors text-sm">Batal</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors text-sm">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
