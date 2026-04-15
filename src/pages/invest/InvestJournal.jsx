import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Edit3, MessageSquare } from 'lucide-react';

const InvestJournal = () => {
  const { investJournals, addInvestJournal, updateInvestJournal, removeInvestJournal } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = {
    symbol: '',
    action: 'BUY',
    strategy: '',
    reason: '',
    risk: '',
    targetPrice: '',
    result: ''
  };
  
  const [formData, setFormData] = useState(initialForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.symbol || !formData.reason) return;

    if (editingId) {
      updateInvestJournal(editingId, {
        ...formData,
        date: new Date().toISOString() // Or keep original date and add updatedDate
      });
    } else {
      addInvestJournal({
        ...formData,
        symbol: formData.symbol.toUpperCase(),
        date: new Date().toISOString(),
      });
    }

    setFormData(initialForm);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (journal) => {
    setFormData(journal);
    setEditingId(journal.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <header className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#333333] pb-4">
        <div>
          <h1 className="text-2xl font-light text-[#e5e5e5] tracking-widest">投資日誌</h1>
          <p className="text-sm text-[#888888] mt-2 tracking-wider">Trading Journal & Decision Log</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if(editingId) handleCancel();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#e5e5e5] text-[#111111] text-sm tracking-widest hover:bg-[#cccccc] transition-colors"
        >
          <Plus size={16} /> {editingId ? '取消編輯' : '新增日誌'}
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-[#333333] p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs text-[#888888] tracking-widest mb-2">標的 (Symbol)</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                className="w-full bg-[#222222] border border-[#333333] p-2 text-[#e5e5e5] focus:outline-none focus:border-[#555555]"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-[#888888] tracking-widest mb-2">操作方向 (Action)</label>
              <select
                value={formData.action}
                onChange={(e) => setFormData({...formData, action: e.target.value})}
                className="w-full bg-[#222222] border border-[#333333] p-2 text-[#e5e5e5] focus:outline-none focus:border-[#555555]"
              >
                <option value="BUY">買進 (BUY)</option>
                <option value="SELL">賣出 (SELL)</option>
                <option value="HOLD">持有 (HOLD)</option>
                <option value="WATCH">觀察 (WATCH)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#888888] tracking-widest mb-2">目標價/停損價 (Target/Stop Loss)</label>
              <input
                type="text"
                value={formData.targetPrice}
                onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                className="w-full bg-[#222222] border border-[#333333] p-2 text-[#e5e5e5] focus:outline-none focus:border-[#555555]"
                placeholder="Ex: TP 150 / SL 130"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs text-[#888888] tracking-widest mb-2">進場策略 (Strategy)</label>
              <input
                type="text"
                value={formData.strategy}
                onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                className="w-full bg-[#222222] border border-[#333333] p-2 text-[#e5e5e5] focus:outline-none focus:border-[#555555]"
                placeholder="Ex: 突破均線 / 左側建倉 / 定期定額"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs text-[#888888] tracking-widest mb-2">決策理由 (Reason)</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full bg-[#222222] border border-[#333333] p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] min-h-[80px]"
                placeholder="為什麼現在做這個決定？..."
                required
              />
            </div>

            <div className="md:col-span-3 border-t border-[#333333] pt-4 mt-2">
              <label className="block text-xs text-[#888888] tracking-widest mb-2 text-red-400">風險考量 (Risk)</label>
              <textarea
                value={formData.risk}
                onChange={(e) => setFormData({...formData, risk: e.target.value})}
                className="w-full bg-[#222222] border border-[#333333] p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] min-h-[60px]"
                placeholder="可能出錯的地方？最壞情況？"
              />
            </div>

            {editingId && (
              <div className="md:col-span-3 border-t border-blue-900 pt-4 mt-2">
                <label className="block text-xs text-blue-400 tracking-widest mb-2">結果回顧 (Result & Review) - Close the Loop</label>
                <textarea
                  value={formData.result}
                  onChange={(e) => setFormData({...formData, result: e.target.value})}
                  className="w-full bg-[#111827] border border-blue-900 p-3 text-[#e5e5e5] focus:outline-none focus:border-blue-500 min-h-[80px]"
                  placeholder="最終結果如何？策略是否奏效？學到什麼？"
                />
              </div>
            )}

          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={handleCancel} className="px-6 py-2 text-[#888888] text-sm tracking-widest hover:text-[#e5e5e5] transition-colors">
              取消
            </button>
            <button type="submit" className="px-6 py-2 bg-[#e5e5e5] text-[#111111] font-medium text-sm tracking-widest hover:bg-[#cccccc] transition-colors">
              儲存日誌
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6">
        {investJournals.sort((a,b) => new Date(b.date) - new Date(a.date)).map((journal) => (
          <div key={journal.id} className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-none relative">
            <div className="flex justify-between items-start mb-4 border-b border-[#222222] pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 text-xs font-bold tracking-widest ${
                  journal.action === 'BUY' ? 'bg-red-900/40 text-red-400' : 
                  journal.action === 'SELL' ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-400'
                }`}>
                  {journal.action}
                </span>
                <span className="text-xl text-[#e5e5e5] tracking-wider">{journal.symbol}</span>
                <span className="text-xs text-[#666666]">{new Date(journal.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(journal)} className="text-[#666666] hover:text-blue-400 p-1 transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => removeInvestJournal(journal.id)} className="text-[#666666] hover:text-red-500 p-1 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="space-y-4">
              {journal.strategy && (
                <div>
                  <h4 className="text-[10px] text-[#888888] tracking-widest mb-1 uppercase">Strategy</h4>
                  <p className="text-sm text-[#cccccc]">{journal.strategy}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-[10px] text-[#888888] tracking-widest mb-1 uppercase">Reasoning</h4>
                <p className="text-sm text-[#e5e5e5] whitespace-pre-wrap">{journal.reason}</p>
              </div>

              {journal.risk && (
                <div className="pl-4 border-l-2 border-red-900/50">
                  <h4 className="text-[10px] text-red-500/70 tracking-widest mb-1 uppercase">Risk Factors</h4>
                  <p className="text-sm text-[#aaaaaa] whitespace-pre-wrap">{journal.risk}</p>
                </div>
              )}

              {journal.targetPrice && (
                <div>
                  <h4 className="text-[10px] text-[#888888] tracking-widest mb-1 uppercase">Target / Stop</h4>
                  <p className="text-sm text-[#cccccc]">{journal.targetPrice}</p>
                </div>
              )}

              {journal.result && (
                <div className="mt-4 p-4 bg-[#111827]/50 border border-blue-900/30">
                  <h4 className="text-[10px] text-blue-400 tracking-widest mb-2 flex items-center gap-2 uppercase">
                    <MessageSquare size={12} /> Post-Analysis Review
                  </h4>
                  <p className="text-sm text-[#cccccc] whitespace-pre-wrap">{journal.result}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {investJournals.length === 0 && (
          <div className="p-12 text-center text-[#666666] tracking-widest text-sm border border-[#333333] border-dashed">
            尚無投資日誌，將「經驗」轉化為「可複製策略」。
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestJournal;
