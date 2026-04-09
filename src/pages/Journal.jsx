import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Search, ChevronDown, ChevronUp, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

const moods = ['平靜 🍵', '喜悅 ✨', '低落 🌧️', '迷惘 🌫️', '感恩 🙏'];

const Journal = () => {
  const { journals, addJournal, removeJournal, updateJournal } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingId, setIsEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(moods[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    if (isEditingId) {
      updateJournal(isEditingId, { title: title || '無題', content, mood });
    } else {
      addJournal({
        title: title || '無題',
        content,
        mood,
        date: format(new Date(), 'yyyy-MM-dd HH:mm'),
        tags: []
      });
    }
    setTitle('');
    setContent('');
    setIsAdding(false);
    setIsEditingId(null);
  };

  const startEdit = (journal, e) => {
    e.stopPropagation();
    setIsEditingId(journal.id);
    setTitle(journal.title);
    setContent(journal.content);
    setMood(journal.mood);
    setIsAdding(true);
    setExpandedId(journal.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setIsEditingId(null);
    setTitle('');
    setContent('');
  };

  const filteredJournals = journals
    .filter(j => 
      j.title.includes(searchTerm) || 
      j.content.includes(searchTerm) ||
      j.date.includes(searchTerm)
    )
    .sort((a, b) => b.id - a.id);

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <header className="space-y-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light tracking-wider text-[#e5e5e5]">隨筆</h1>
          <p className="text-[#888888] tracking-widest text-sm mt-2">生活紀錄與情緒整理</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => { setIsAdding(true); setIsEditingId(null); setTitle(''); setContent(''); setMood(moods[0]); }}
            className="flex items-center gap-2 text-[#888888] hover:text-[#e5e5e5] transition-colors pb-1"
          >
            <Plus size={18} />
            <span className="tracking-widest text-sm">書寫</span>
          </button>
        )}
      </header>

      {/* 沉浸式輸入/編輯區 */}
      {isAdding && (
        <section className="zen-panel bg-[#1f1f1f] border-l-2 border-[#bbbbbb] relative animate-fade-in">
          <input 
            type="text" 
            placeholder="標題 (選填)" 
            className="w-full bg-transparent text-xl font-light tracking-wider text-[#e5e5e5] placeholder-[#555555] focus:outline-none mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <textarea 
            placeholder="寫下此刻的心流..." 
            className="w-full h-40 bg-transparent text-[#cccccc] placeholder-[#555555] focus:outline-none resize-none tracking-wide leading-relaxed"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4 border-t border-[#333333] pt-4">
            <div className="flex gap-2">
              {moods.map(m => (
                <button 
                  key={m} 
                  onClick={() => setMood(m)}
                  className={`text-sm px-2 py-1 transition-colors ${mood === m ? 'text-[#e5e5e5] bg-[#333333]' : 'text-[#888888] hover:text-[#cccccc]'}`}
                >
                  {m.split(' ')[1]} {/* Just emoji or word */}
                </button>
              ))}
            </div>
            <div className="space-x-4">
              <button onClick={cancelEdit} className="text-[#888888] hover:text-[#e5e5e5] tracking-widest text-sm transition-colors">
                取消
              </button>
              <button onClick={handleSave} className="text-[#e5e5e5] tracking-widest text-sm border-b border-[#bbbbbb] pb-1 hover:border-[#ffffff] transition-colors">
                保存
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 搜尋列 */}
      <section className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" size={16} />
        <input 
          type="text" 
          placeholder="搜尋記憶..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-b border-[#333333] py-2 pl-10 pr-4 text-[#888888] focus:border-[#666666] focus:outline-none focus:text-[#e5e5e5] tracking-widest text-sm transition-colors"
        />
      </section>

      {/* 歷史時間軸 */}
      <section className="space-y-6 container pl-2 border-l border-[#333333]">
        {filteredJournals.map((j) => {
          const isExpanded = expandedId === j.id;
          return (
            <div key={j.id} className={`relative group pl-6 pb-6 ${isEditingId === j.id ? 'opacity-50' : ''}`}>
              {/* Timeline dot */}
              <div className="absolute -left-[5px] top-[10px] w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#666666] group-hover:bg-[#888888] transition-colors" />
              
              <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : j.id)}>
                <div>
                  <div className="text-[#e5e5e5] text-lg font-light flex items-center gap-2">
                    {j.title} 
                    <span className="text-sm opacity-60">{j.mood}</span>
                  </div>
                  <div className="text-[#666666] text-xs font-mono mt-1">{j.date}</div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => startEdit(j, e)}
                    className="action-hidden text-[#888888] hover:text-[#cccccc] transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeJournal(j.id); }}
                    className="action-hidden text-[#ff6666] hover:text-[#ff9999] transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <span className="text-[#555555]">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>
              </div>
              
              {/* Content preview or full */}
              <div className={`mt-3 text-[#cccccc] tracking-wide leading-relaxed ${isExpanded ? '' : 'line-clamp-2 text-[#888888]'}`}>
                {j.content.split('\n').map((line, i) => (
                  <span key={i}>{line}<br/></span>
                ))}
              </div>
            </div>
          );
        })}
        {filteredJournals.length === 0 && (
          <div className="pl-6 text-[#555555] tracking-widest text-sm">
            落花無言，人淡如菊。
          </div>
        )}
      </section>
    </div>
  );
};
export default Journal;
