import React, { useState, useEffect } from 'react';
import { Send, Clock, AlertCircle, RefreshCw, Plane, Globe, Activity, Radio } from 'lucide-react';
import { DispatchStatus, OECFormData, OECRecord } from '../types';

interface RecordFormProps {
  onSubmit: (data: OECFormData) => Promise<void>;
  editingRecord: OECRecord | null;
  onCancelEdit: () => void;
  isSubmitting: boolean;
}

export const RecordForm: React.FC<RecordFormProps> = ({
  onSubmit,
  editingRecord,
  onCancelEdit,
  isSubmitting,
}) => {
  const [dataInfo, setDataInfo] = useState('');
  const [boardInfo, setBoardInfo] = useState('');
  const [progress, setProgress] = useState('');
  const [status, setStatus] = useState<DispatchStatus>('Active');
  const [validationError, setValidationError] = useState<string | null>(null);

  // If editing an existing record, populate the fields
  useEffect(() => {
    if (editingRecord) {
      setDataInfo(
        editingRecord.dataInfo ||
        editingRecord.oecNumber ||
        (editingRecord as any).oec ||
        (editingRecord as any).flight ||
        ''
      );
      setBoardInfo(
        editingRecord.boardInfo ||
        editingRecord.countryInfo ||
        (editingRecord as any).country ||
        (editingRecord as any).origin ||
        ''
      );
      setProgress(
        editingRecord.progress ||
        (editingRecord as any).time ||
        (editingRecord as any).departure ||
        ''
      );
      setStatus(editingRecord.status || 'Active');
      setValidationError(null);
    } else {
      setDataInfo('');
      setBoardInfo('');
      setProgress('');
      setStatus('Active');
      setValidationError(null);
    }
  }, [editingRecord]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataInfo.trim()) {
      setValidationError('Please enter Data Info (OEC / Flight / Signal)');
      return;
    }
    if (!boardInfo.trim()) {
      setValidationError('Please enter Board Info (Destination / Origin)');
      return;
    }
    if (!progress.trim()) {
      setValidationError('Please enter Progress (Departure / Time)');
      return;
    }

    setValidationError(null);
    await onSubmit({
      dataInfo: dataInfo.trim(),
      boardInfo: boardInfo.trim(),
      progress: progress.trim(),
      status,
      // Backwards-compatible aliases
      oecNumber: dataInfo.trim(),
      countryInfo: boardInfo.trim(),
    });

    if (!editingRecord) {
      setDataInfo('');
      setBoardInfo('');
      setProgress('');
      setStatus('Active');
    }
  };

  return (
    <div className="bg-[#16181d] border border-[#24272c] rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle green ambient light accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      {/* Form Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#24272c]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-display">
            {editingRecord ? (
              <span className="flex items-center gap-2">
                <span>Edit Record:</span>
                <span className="text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {editingRecord.dataInfo || editingRecord.oecNumber || 'Selected'}
                </span>
              </span>
            ) : (
              'Add New Record (South Korea & OEC Board)'
            )}
          </h2>
        </div>

        {editingRecord && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-1 rounded bg-[#20232a] border border-[#2d313a] hover:border-zinc-500 transition-colors cursor-pointer"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {validationError && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 text-red-300 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Grid Inputs matching the South Korea & OEC Info columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Input 1: Data Info (OEC / Flight / LED Signals) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 tracking-wide uppercase">
              <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-1 py-0.5 rounded mr-1">LED SIGNALS</span>
              Data Info (OEC / Flight) <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={dataInfo}
                onChange={(e) => setDataInfo(e.target.value)}
                placeholder="e.g. OEC-8840 or KOR 712"
                className="w-full bg-[#101114] border border-[#272a31] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 font-mono-led transition-all outline-none"
              />
              <Plane className="w-4 h-4 text-zinc-600 absolute right-3 top-3 pointer-events-none" />
            </div>
            <div className="flex gap-1.5 text-[10px] text-zinc-500 pt-0.5 overflow-x-auto">
              <span>Quick:</span>
              <button
                type="button"
                onClick={() => setDataInfo('OEC-' + Math.floor(1000 + Math.random() * 9000))}
                className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                Auto OEC
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setDataInfo('KOR ' + Math.floor(100 + Math.random() * 900))}
                className="hover:text-zinc-300 cursor-pointer"
              >
                KOR #
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setDataInfo('WY 343')}
                className="hover:text-zinc-300 cursor-pointer"
              >
                WY 343
              </button>
            </div>
          </div>

          {/* Input 2: Board Info (Origin / Destination Airport) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 tracking-wide uppercase">
              Board Info (Origin / Destination) <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={boardInfo}
                onChange={(e) => setBoardInfo(e.target.value)}
                placeholder="e.g. Seoul Incheon or Philippines (MNL)"
                className="w-full bg-[#101114] border border-[#272a31] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-all outline-none"
              />
              <Globe className="w-4 h-4 text-zinc-600 absolute right-3 top-3 pointer-events-none" />
            </div>
            <div className="flex gap-1.5 text-[10px] text-zinc-500 pt-0.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setBoardInfo('SEOUL INCHEON')}
                className="hover:text-zinc-300 cursor-pointer"
              >
                Incheon
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setBoardInfo('BUSAN PORT')}
                className="hover:text-zinc-300 cursor-pointer"
              >
                Busan
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setBoardInfo('DAEGU CENTRAL')}
                className="hover:text-zinc-300 cursor-pointer"
              >
                Daegu
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setBoardInfo('PHILIPPINES (MNL)')}
                className="hover:text-zinc-300 cursor-pointer"
              >
                MNL
              </button>
            </div>
          </div>

          {/* Input 3: Progress (Departure / Time) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 tracking-wide uppercase">
              Progress (Departure / Time) <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                placeholder="e.g. Check-In Open or 13:05"
                className="w-full bg-[#101114] border border-[#272a31] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-all outline-none"
              />
              <Clock className="w-4 h-4 text-zinc-600 absolute right-3 top-3 pointer-events-none" />
            </div>
            <div className="flex gap-1.5 text-[10px] text-zinc-500 pt-0.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setProgress('Check-In Open')}
                className="hover:text-zinc-300 cursor-pointer"
              >
                Check-In
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setProgress('Gate Closed')}
                className="hover:text-zinc-300 cursor-pointer"
              >
                Closed
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setProgress('Boarding - 14:30')}
                className="hover:text-zinc-300 cursor-pointer"
              >
                Boarding
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setProgress('13:05')}
                className="hover:text-zinc-300 cursor-pointer"
              >
                13:05
              </button>
            </div>
          </div>

          {/* Input 4: Status Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 tracking-wide uppercase">
              Status <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DispatchStatus)}
                className="w-full bg-[#101114] border border-[#272a31] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-lg px-3.5 py-2.5 text-sm text-white transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="Active" className="bg-[#16181d] text-emerald-400">
                  ● Active (Display on LED)
                </option>
                <option value="Pending" className="bg-[#16181d] text-amber-400">
                  ● Pending (Standby)
                </option>
                <option value="Inactive" className="bg-[#16181d] text-zinc-400">
                  ● Inactive (Hidden / Off)
                </option>
              </select>
              <Activity className="w-4 h-4 text-zinc-600 absolute right-3 top-3 pointer-events-none" />
            </div>
            <div className="text-[10px] text-zinc-500 pt-0.5">
              Live broadcast state
            </div>
          </div>
        </div>

        {/* Submit Button: A bright green button "SUBMIT TO LED BOARD" */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-zinc-950 font-extrabold text-sm sm:text-base tracking-wider uppercase py-3.5 px-6 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Broadcasting to Firebase RTDB...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 fill-current" />
                <span>{editingRecord ? 'UPDATE RECORD ON LED BOARD' : 'SUBMIT TO LED BOARD'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
