import React, { useState } from 'react';
import { 
  Pencil, 
  Trash2, 
  CheckCircle, 
  Clock, 
  MinusCircle, 
  Search, 
  Filter, 
  Plane, 
  RefreshCw,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { DispatchStatus, OECRecord } from '../types';

interface RecordTableProps {
  records: OECRecord[];
  isLoading: boolean;
  onToggleStatus: (id: string, currentStatus: DispatchStatus) => void;
  onEdit: (record: OECRecord) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export const RecordTable: React.FC<RecordTableProps> = ({
  records,
  isLoading,
  onToggleStatus,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [recordToDelete, setRecordToDelete] = useState<OECRecord | null>(null);

  // Helper for next status in toggle cycle
  const getNextStatus = (current: DispatchStatus): DispatchStatus => {
    if (current === 'Active') return 'Pending';
    if (current === 'Pending') return 'Inactive';
    return 'Active';
  };

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const dataVal = (rec.dataInfo || rec.oecNumber || (rec as any).oec || (rec as any).flight || '').toLowerCase();
    const boardVal = (rec.boardInfo || rec.countryInfo || (rec as any).country || (rec as any).origin || '').toLowerCase();
    const prog = (rec.progress || (rec as any).time || (rec as any).departure || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = !query || dataVal.includes(query) || boardVal.includes(query) || prog.includes(query);
    const matchesFilter = filterStatus === 'ALL' || (rec.status || 'Active').toUpperCase() === filterStatus.toUpperCase();

    return matchesSearch && matchesFilter;
  });

  const renderStatusBadge = (rec: OECRecord) => {
    const status: DispatchStatus = rec.status || 'Active';
    const nextStatus = getNextStatus(status);

    let badgeClass = '';
    let dotClass = '';
    let Icon = CheckCircle;

    if (status === 'Active') {
      badgeClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
      dotClass = 'bg-emerald-400 animate-pulse';
      Icon = CheckCircle;
    } else if (status === 'Pending') {
      badgeClass = 'bg-amber-500/15 text-amber-400 border-amber-500/40 hover:bg-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
      dotClass = 'bg-amber-400';
      Icon = Clock;
    } else {
      badgeClass = 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700/60';
      dotClass = 'bg-zinc-500';
      Icon = MinusCircle;
    }

    return (
      <button
        type="button"
        onClick={() => onToggleStatus(rec.id, status)}
        title={`Status: ${status}. Click to change to ${nextStatus}`}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none group ${badgeClass}`}
      >
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        <span>{status}</span>
        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-zinc-400">
          ↻
        </span>
      </button>
    );
  };

  return (
    <div className="bg-[#16181d] border border-[#24272c] rounded-xl shadow-xl overflow-hidden">
      {/* Table Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-[#24272c] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#14161a]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-display">
              Live LED Board Records
            </h2>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[#20242c] text-emerald-400 border border-[#2b313d]">
              {records.length} Total
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Click status badges to cycle Active, Pending, and Inactive in real-time
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search flight, country..."
              className="w-full bg-[#101114] border border-[#272a31] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center rounded-lg bg-[#101114] border border-[#272a31] p-0.5 text-xs">
            {(['ALL', 'Active', 'Pending', 'Inactive'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  filterStatus.toUpperCase() === st.toUpperCase()
                    ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Refresh RTDB Button */}
          <button
            onClick={onRefresh}
            title="Refresh database records"
            className="p-2 text-zinc-400 hover:text-zinc-200 bg-[#101114] border border-[#272a31] hover:border-zinc-600 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#24272c] bg-[#111215] text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              <th className="py-3.5 px-4 sm:px-6">
                <span className="text-emerald-400 font-bold mr-1.5 text-[10px]">LED SIGNALS</span>
                <span>Data Info</span>
              </th>
              <th className="py-3.5 px-4 sm:px-6">Board Info</th>
              <th className="py-3.5 px-4 sm:px-6">Progress</th>
              <th className="py-3.5 px-4 sm:px-6">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2026] text-sm">
            {isLoading && records.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                    <span className="text-sm">Connecting to Firebase Realtime Database...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-500">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#1b1e24] flex items-center justify-center text-zinc-600 mb-3">
                      <Plane className="w-6 h-6" />
                    </div>
                    <p className="text-white font-medium text-sm">No dispatch records found</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {searchTerm
                        ? `No results matching "${searchTerm}". Try resetting search filter.`
                        : 'Submit a new record above or click "Sample Data" to populate demo records.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => {
                const dataVal = record.dataInfo || record.oecNumber || (record as any).oec || (record as any).flight || 'N/A';
                const boardVal = record.boardInfo || record.countryInfo || (record as any).country || (record as any).origin || '—';
                const progress = record.progress || (record as any).time || (record as any).departure || '—';

                return (
                  <tr
                    key={record.id}
                    className="hover:bg-[#1a1d23]/80 transition-colors group"
                  >
                    {/* LED Signals Data Info */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-led font-bold text-white text-sm sm:text-base tracking-wide bg-[#111215] px-2.5 py-1 rounded border border-[#282c35] text-emerald-300">
                          {dataVal}
                        </span>
                      </div>
                    </td>

                    {/* Board Info */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-medium text-zinc-200 flex items-center gap-2">
                        <span>{boardVal}</span>
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="inline-flex items-center gap-1.5 text-zinc-300 text-xs sm:text-sm bg-[#121317] px-2.5 py-1 rounded border border-[#23262f]">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{progress}</span>
                      </div>
                    </td>

                    {/* Status Toggle Badge */}
                    <td className="py-4 px-4 sm:px-6">
                      {renderStatusBadge(record)}
                    </td>

                    {/* Actions: Edit & Delete Icons */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          title="Edit Record"
                          className="p-1.5 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setRecordToDelete(record)}
                          title="Delete from LED Board"
                          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 bg-[#121316] border-t border-[#24272c] flex items-center justify-between text-[11px] text-zinc-500">
        <div className="flex items-center gap-2">
          <span>Displaying: <strong className="text-zinc-300">{filteredRecords.length}</strong> of {records.length} flights</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>Target: <span className="text-zinc-400 font-mono">/oec_board</span></span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181a1f] border border-[#2b2f38] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Record from LED Board?</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Are you sure you want to remove flight{' '}
                  <span className="font-mono text-emerald-400 font-semibold">
                    {recordToDelete.oecNumber || (recordToDelete as any).oec || 'this record'}
                  </span>{' '}
                  from the live LED board display? This cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-[#22252c] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (recordToDelete) {
                    onDelete(recordToDelete.id);
                    setRecordToDelete(null);
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg shadow-red-600/30 transition-colors cursor-pointer"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
