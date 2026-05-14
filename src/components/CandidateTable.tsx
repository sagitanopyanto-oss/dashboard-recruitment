import { Star, Pencil, Trash2, X, Eye, ChevronDown, ChevronUp, Calendar, FileText, Download } from 'lucide-react';
import { useState } from 'react';
import { useRecruitment } from '../context/RecruitmentContext';
import { Candidate } from '../data/mockData';

const stageColors: Record<string, string> = {
  'Applied': 'bg-blue-100 text-blue-700',
  'Screening': 'bg-yellow-100 text-yellow-700',
  'Interview': 'bg-purple-100 text-purple-700',
  'Assessment': 'bg-orange-100 text-orange-700',
  'Offer': 'bg-emerald-100 text-emerald-700',
  'Medical': 'bg-cyan-100 text-cyan-700',
  'Hired': 'bg-green-100 text-green-700',
  'Rejected': 'bg-red-100 text-red-700',
};

const stageLabels: Record<string, string> = {
  'Applied': 'Lamaran', 'Screening': 'Screening', 'Interview': 'Interview',
  'Assessment': 'Assessment', 'Offer': 'Offering', 'Medical': 'Medical',
  'Hired': 'Hired', 'Rejected': 'Rejected',
};

const stages = ['Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Medical', 'Hired', 'Rejected'] as const;

const emptyFormData = {
  name: '', email: '', position: '', department: '',
  stage: 'Applied' as Candidate['stage'], rating: 3,
  interviewDate: '', assessmentDate: '', offerDate: '', medicalDate: '', hiredDate: '',
  cvData: '', cvFileName: '',
};

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downloadPdf(base64: string, filename: string) {
  const link = document.createElement('a');
  link.href = base64;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function CandidateTable() {
  const { candidates, addCandidate, updateCandidate, deleteCandidate, canCreateOrDelete } = useRecruitment();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [previewCv, setPreviewCv] = useState<{ data: string; name: string } | null>(null);

  const [formData, setFormData] = useState(emptyFormData);

  const filteredCandidates = candidates.filter(c => {
    const matchStage = filter === 'All' || c.stage === filter;
    const matchSearch = searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStage && matchSearch;
  });

  const filterStages = ['All', ...stages];

  const handleOpenModal = (candidate?: Candidate) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData({
        name: candidate.name, email: candidate.email, position: candidate.position,
        department: candidate.department, stage: candidate.stage, rating: candidate.rating,
        interviewDate: candidate.interviewDate, assessmentDate: candidate.assessmentDate,
        offerDate: candidate.offerDate, medicalDate: candidate.medicalDate, hiredDate: candidate.hiredDate,
        cvData: candidate.cvData || '', cvFileName: candidate.cvFileName || '',
      });
    } else {
      setEditingCandidate(null);
      setFormData({ ...emptyFormData });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCandidate) {
      updateCandidate(editingCandidate.id, formData);
    } else {
      const initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      addCandidate({
        ...formData,
        avatar: initials,
        appliedDate: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(false);
  };

  const handleStageChange = (id: number, newStage: Candidate['stage'], candidate: Candidate) => {
    const today = new Date().toISOString().split('T')[0];
    const updates: Partial<Candidate> = { stage: newStage };
    if (newStage === 'Interview' && !candidate.interviewDate) updates.interviewDate = today;
    if (newStage === 'Assessment' && !candidate.assessmentDate) updates.assessmentDate = today;
    if (newStage === 'Offer' && !candidate.offerDate) updates.offerDate = today;
    if (newStage === 'Medical' && !candidate.medicalDate) updates.medicalDate = today;
    if (newStage === 'Hired' && !candidate.hiredDate) updates.hiredDate = today;
    updateCandidate(id, updates);
  };

  const handleDelete = (id: number) => { deleteCandidate(id); setDeleteConfirmId(null); };

  const stageOrder = ['Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Medical', 'Hired'];
  const getStageIndex = (stage: string) => { if (stage === 'Rejected') return -1; return stageOrder.indexOf(stage); };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Daftar Kandidat</h3>
            <p className="text-sm text-slate-500 mt-1">Kelola semua kandidat rekrutmen ({candidates.length} kandidat)</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Cari nama, posisi..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 w-48" />
            {canCreateOrDelete && (
              <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 whitespace-nowrap">+ Tambah</button>
            )}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filterStages.map((stage) => {
            const count = stage === 'All' ? candidates.length : candidates.filter(c => c.stage === stage).length;
            return (
              <button key={stage} onClick={() => setFilter(stage)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${filter === stage ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {stage === 'All' ? 'Semua' : stageLabels[stage]}
                <span className={`px-1.5 py-0.5 rounded-md text-xs font-bold ${filter === stage ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="w-8 py-4 px-3"></th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kandidat</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Posisi</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tahap</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CV</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tgl Lamar</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tgl Interview</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tgl Assessment</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tgl Offering</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tgl Medical</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tgl Hired</th>
              <th className="text-right py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCandidates.map((candidate) => {
              const currentStageIdx = getStageIndex(candidate.stage);
              return (
                <>
                  <tr key={candidate.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-3"><button onClick={() => setExpandedRow(expandedRow === candidate.id ? null : candidate.id)} className="p-1 rounded hover:bg-slate-200 text-slate-400">{expandedRow === candidate.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button></td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 ${candidate.stage === 'Hired' ? 'bg-gradient-to-br from-emerald-400 to-green-500' : candidate.stage === 'Rejected' ? 'bg-gradient-to-br from-red-400 to-rose-500' : candidate.stage === 'Medical' ? 'bg-gradient-to-br from-cyan-400 to-blue-500' : 'bg-gradient-to-br from-indigo-400 to-purple-500'}`}>{candidate.avatar}</div>
                        <div><p className="font-semibold text-slate-800 text-sm">{candidate.name}</p><p className="text-xs text-slate-500">{candidate.email}</p></div>
                      </div>
                    </td>
                    <td className="py-4 px-4"><span className="text-sm text-slate-700 font-medium">{candidate.position}</span><p className="text-xs text-slate-500">{candidate.department}</p></td>
                    <td className="py-4 px-4">
                      <select value={candidate.stage} onChange={(e) => handleStageChange(candidate.id, e.target.value as Candidate['stage'], candidate)} className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer focus:ring-2 focus:ring-indigo-500 ${stageColors[candidate.stage]}`}>
                        {stages.map(s => <option key={s} value={s}>{stageLabels[s]}</option>)}
                      </select>
                    </td>
                    {/* CV Column */}
                    <td className="py-4 px-4">
                      {candidate.cvData ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => setPreviewCv({ data: candidate.cvData, name: candidate.cvFileName || `CV_${candidate.name}.pdf` })} className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 hover:text-indigo-700 transition-colors" title="Preview CV">
                            <FileText size={16} />
                          </button>
                          <button onClick={() => downloadPdf(candidate.cvData, candidate.cvFileName || `CV_${candidate.name}.pdf`)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 hover:text-emerald-700 transition-colors" title="Download CV">
                            <Download size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Tidak ada</span>
                      )}
                    </td>
                    <td className="py-4 px-4"><div className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /><span className="text-sm font-semibold text-slate-700">{candidate.rating}</span></div></td>
                    <td className="py-4 px-4"><span className="text-xs text-slate-600 whitespace-nowrap">{formatDate(candidate.appliedDate)}</span></td>
                    <td className="py-4 px-4"><span className={`text-xs whitespace-nowrap ${candidate.interviewDate ? 'text-purple-600 font-medium' : 'text-slate-400'}`}>{formatDate(candidate.interviewDate)}</span></td>
                    <td className="py-4 px-4"><span className={`text-xs whitespace-nowrap ${candidate.assessmentDate ? 'text-orange-600 font-medium' : 'text-slate-400'}`}>{formatDate(candidate.assessmentDate)}</span></td>
                    <td className="py-4 px-4"><span className={`text-xs whitespace-nowrap ${candidate.offerDate ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>{formatDate(candidate.offerDate)}</span></td>
                    <td className="py-4 px-4"><span className={`text-xs whitespace-nowrap ${candidate.medicalDate ? 'text-cyan-600 font-medium' : 'text-slate-400'}`}>{formatDate(candidate.medicalDate)}</span></td>
                    <td className="py-4 px-4"><span className={`text-xs whitespace-nowrap ${candidate.hiredDate ? 'text-green-600 font-medium' : 'text-slate-400'}`}>{formatDate(candidate.hiredDate)}</span></td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setDetailCandidate(candidate); setIsDetailOpen(true); }} className="p-2 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors" title="Detail"><Eye size={16} /></button>
                        <button onClick={() => handleOpenModal(candidate)} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Edit"><Pencil size={16} /></button>
                        {canCreateOrDelete && (
                          <button onClick={() => setDeleteConfirmId(candidate.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Hapus"><Trash2 size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedRow === candidate.id && (
                    <tr key={`${candidate.id}-expanded`}>
                      <td colSpan={13} className="bg-slate-50/70 px-6 py-4">
                        <div className="flex items-center gap-1 overflow-x-auto pb-2">
                          {stageOrder.map((stage, idx) => {
                            const isCurrent = candidate.stage === stage;
                            const isPassed = currentStageIdx >= idx;
                            const isRejected = candidate.stage === 'Rejected';
                            const dateMap: Record<string, string> = { 'Applied': candidate.appliedDate, 'Screening': candidate.appliedDate, 'Interview': candidate.interviewDate, 'Assessment': candidate.assessmentDate, 'Offer': candidate.offerDate, 'Medical': candidate.medicalDate, 'Hired': candidate.hiredDate };
                            return (
                              <div key={stage} className="flex items-center">
                                <div className="flex flex-col items-center min-w-[80px]">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${isRejected ? 'border-red-300 bg-red-50 text-red-500' : isCurrent ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : isPassed ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300 bg-white text-slate-400'}`}>
                                    {isPassed && !isCurrent && !isRejected ? '✓' : idx + 1}
                                  </div>
                                  <span className={`text-xs mt-1 font-medium whitespace-nowrap ${isCurrent ? 'text-indigo-600' : isPassed ? 'text-green-600' : 'text-slate-400'}`}>{stageLabels[stage]}</span>
                                  {dateMap[stage] && <span className="text-[10px] text-slate-400 mt-0.5">{formatDate(dateMap[stage])}</span>}
                                </div>
                                {idx < stageOrder.length - 1 && <div className={`w-8 h-0.5 mt-[-20px] ${isPassed && !isRejected && idx < currentStageIdx ? 'bg-green-400' : 'bg-slate-200'}`} />}
                              </div>
                            );
                          })}
                          {candidate.stage === 'Rejected' && (
                            <div className="flex items-center ml-2">
                              <div className="flex flex-col items-center min-w-[80px]">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-red-500 bg-red-500 text-white">✗</div>
                                <span className="text-xs mt-1 font-medium text-red-600">Rejected</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filteredCandidates.length === 0 && (
              <tr><td colSpan={13} className="py-12 text-center text-slate-500"><div className="flex flex-col items-center gap-2"><Calendar size={40} className="text-slate-300" /><p className="font-medium">Tidak ada kandidat ditemukan</p><p className="text-sm">Coba ubah filter atau tambah kandidat baru</p></div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-sm text-slate-500">Menampilkan {filteredCandidates.length} dari {candidates.length} kandidat</span>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-800">{editingCandidate ? 'Edit Kandidat' : 'Tambah Kandidat Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Informasi Dasar</p>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Posisi</label><input required type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Departemen</label><input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Tahap</label><select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value as Candidate['stage']})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm">{stages.map(s => <option key={s} value={s}>{stageLabels[s]}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label><input required type="number" min="1" max="5" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" /></div>
              </div>
              <div className="pt-2 border-t border-slate-100"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tanggal Proses Rekrutmen</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">📋 Tgl Interview</label><input type="date" value={formData.interviewDate} onChange={e => setFormData({...formData, interviewDate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">📝 Tgl Assessment</label><input type="date" value={formData.assessmentDate} onChange={e => setFormData({...formData, assessmentDate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">📨 Tgl Offering</label><input type="date" value={formData.offerDate} onChange={e => setFormData({...formData, offerDate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">🏥 Tgl Medical</label><input type="date" value={formData.medicalDate} onChange={e => setFormData({...formData, medicalDate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">✅ Tgl Hired</label><input type="date" value={formData.hiredDate} onChange={e => setFormData({...formData, hiredDate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" /></div>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload / Ganti Dokumen CV (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf,application/pdf" 
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file && file.name.toLowerCase().endsWith('.pdf')) {
                      const base64 = await fileToBase64(file);
                      setFormData(p => ({ ...p, cvFileName: file.name, cvData: base64 }));
                    }
                  }} 
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" 
                />
                {formData.cvFileName && (
                  <p className="text-xs text-emerald-600 mt-1 truncate">File aktif: {formData.cvFileName}</p>
                )}
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors text-sm">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-sm">{editingCandidate ? 'Simpan Perubahan' : 'Tambah Kandidat'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailOpen && detailCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-800">Detail Kandidat</h3>
              <button onClick={() => setIsDetailOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl text-white ${detailCandidate.stage === 'Hired' ? 'bg-gradient-to-br from-emerald-400 to-green-500' : detailCandidate.stage === 'Rejected' ? 'bg-gradient-to-br from-red-400 to-rose-500' : detailCandidate.stage === 'Medical' ? 'bg-gradient-to-br from-cyan-400 to-blue-500' : 'bg-gradient-to-br from-indigo-400 to-purple-500'}`}>{detailCandidate.avatar}</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800">{detailCandidate.name}</h4>
                  <p className="text-sm text-slate-500">{detailCandidate.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${stageColors[detailCandidate.stage]}`}>{stageLabels[detailCandidate.stage]}</span>
                    <span className="flex items-center gap-1 text-sm text-amber-500"><Star size={14} className="fill-amber-400" /> {detailCandidate.rating}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-500">Posisi</p><p className="text-sm font-semibold text-slate-800 mt-0.5">{detailCandidate.position}</p></div>
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-500">Departemen</p><p className="text-sm font-semibold text-slate-800 mt-0.5">{detailCandidate.department}</p></div>
              </div>

              {/* CV Section in Detail */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Dokumen CV</p>
                {detailCandidate.cvData ? (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0"><FileText size={20} className="text-red-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{detailCandidate.cvFileName || 'CV.pdf'}</p>
                      <p className="text-xs text-emerald-600">PDF — Siap diunduh</p>
                    </div>
                    <button onClick={() => setPreviewCv({ data: detailCandidate.cvData, name: detailCandidate.cvFileName || `CV_${detailCandidate.name}.pdf` })} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-200 transition-colors">Preview</button>
                    <button onClick={() => downloadPdf(detailCandidate.cvData, detailCandidate.cvFileName || `CV_${detailCandidate.name}.pdf`)} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-200 transition-colors">Download</button>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center text-sm text-slate-400 italic">Kandidat belum mengunggah CV</div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Timeline Proses Rekrutmen</p>
                <div className="space-y-3">
                  {[
                    { label: 'Lamaran Diterima', date: detailCandidate.appliedDate, color: 'bg-blue-500', icon: '📩' },
                    { label: 'Interview', date: detailCandidate.interviewDate, color: 'bg-purple-500', icon: '📋' },
                    { label: 'Assessment', date: detailCandidate.assessmentDate, color: 'bg-orange-500', icon: '📝' },
                    { label: 'Offering', date: detailCandidate.offerDate, color: 'bg-emerald-500', icon: '📨' },
                    { label: 'Medical Check-up', date: detailCandidate.medicalDate, color: 'bg-cyan-500', icon: '🏥' },
                    { label: 'Hired', date: detailCandidate.hiredDate, color: 'bg-green-500', icon: '✅' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${item.date ? item.color : 'bg-slate-200'}`} />
                        {idx < 5 && <div className={`w-0.5 h-6 ${item.date ? 'bg-slate-300' : 'bg-slate-100'}`} />}
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className={`text-sm ${item.date ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{item.icon} {item.label}</span>
                        <span className={`text-xs ${item.date ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{item.date ? formatDate(item.date) : 'Belum dijadwalkan'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => { setIsDetailOpen(false); handleOpenModal(detailCandidate); }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">Edit Kandidat</button>
              <button onClick={() => setIsDetailOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors text-sm">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Kandidat?</h3>
            <p className="text-sm text-slate-500 mb-6">Data kandidat akan dihapus secara permanen.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors text-sm">Batal</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors text-sm">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewCv && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col" style={{ height: '90vh' }}>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"><FileText size={18} className="text-red-600" /></div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{previewCv.name}</h3>
                  <p className="text-xs text-slate-500">Preview Dokumen PDF</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => downloadPdf(previewCv.data, previewCv.name)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                  <Download size={14} /> Download PDF
                </button>
                <button onClick={() => setPreviewCv(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
              </div>
            </div>
            <div className="flex-1 bg-slate-200">
              <iframe src={previewCv.data} className="w-full h-full border-0" title="PDF Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
