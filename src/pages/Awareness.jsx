import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Activity, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

const bodyParts = ['呼吸', '脊椎', '肩頸', '下肢', '自訂'];

const Awareness = () => {
  const { awareness, addAwareness, removeAwareness, updateAwareness } = useStore();
  const [part, setPart] = useState('呼吸');
  const [customPart, setCustomPart] = useState('');
  
  // New fields
  const [practiceItem, setPracticeItem] = useState('');
  const [record, setRecord] = useState('');
  
  const [isEditingId, setIsEditingId] = useState(null);

  const handleSave = () => {
    if (!practiceItem.trim() && !record.trim()) return;

    const finalPart = part === '自訂' ? customPart || '未指定' : part;

    if (isEditingId) {
      updateAwareness(isEditingId, {
        bodyPart: finalPart,
        practiceItem: practiceItem || '無',
        record: record || '無紀錄'
      });
      setIsEditingId(null);
    } else {
      addAwareness({
        date: format(new Date(), 'yyyy-MM-dd HH:mm'),
        bodyPart: finalPart,
        practiceItem: practiceItem || '無',
        record: record || '無紀錄'
      });
    }
    
    // Reset defaults
    setPart('呼吸');
    setCustomPart('');
    setPracticeItem('');
    setRecord('');
  };

  const startEdit = (item) => {
    setIsEditingId(item.id);
    if (bodyParts.includes(item.bodyPart)) {
      setPart(item.bodyPart);
      setCustomPart('');
    } else {
      setPart('自訂');
      setCustomPart(item.bodyPart);
    }
    setPracticeItem(item.practiceItem === '無' ? '' : item.practiceItem);
    setRecord(item.record === '無紀錄' ? '' : item.record);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditingId(null);
    setPart('呼吸');
    setCustomPart('');
    setPracticeItem('');
    setRecord('');
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-light tracking-wider text-[#e5e5e5]">覺察</h1>
        <p className="text-[#888888] tracking-widest text-sm">三十秒完成一次身心對話</p>
      </header>

      {/* 快速記錄/編輯區 */}
      <section className={`zen-panel space-y-8 transition-colors ${isEditingId ? 'bg-[#2a2a2a] border-[#888888]' : 'bg-[#1f1f1f]'}`}>
        <div className="space-y-6 max-w-2xl mx-auto">
          {isEditingId && (
            <div className="text-[#bbbbbb] text-sm tracking-widest mb-4 pb-2 border-b border-[#333333]">正在編輯紀錄...</div>
          )}
          
          {/* 部位選擇 */}
          <div className="space-y-2">
            <span className="text-[#888888] text-sm tracking-widest block">覺察焦點</span>
            <div className="flex flex-wrap gap-3">
              {bodyParts.map(p => (
                <button
                  key={p}
                  onClick={() => setPart(p)}
                  className={`px-4 py-2 border text-sm transition-all duration-300 ${
                    part === p 
                      ? 'border-[#e5e5e5] text-[#e5e5e5] bg-[#333333]' 
                      : 'border-[#333333] text-[#888888] hover:border-[#666666]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {part === '自訂' && (
              <input
                type="text"
                placeholder="輸入焦點..."
                className="mt-3 w-full bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] focus:outline-none focus:border-[#666666] tracking-wide"
                value={customPart}
                onChange={(e) => setCustomPart(e.target.value)}
              />
            )}
          </div>

          {/* 練習項目與紀錄 */}
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <span className="text-[#888888] text-sm tracking-widest block">練習項目</span>
              <input 
                type="text" 
                placeholder="例如：腹式呼吸、脊椎螺旋..." 
                className="w-full bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] focus:outline-none focus:border-[#666666] tracking-wide"
                value={practiceItem}
                onChange={(e) => setPracticeItem(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <span className="text-[#888888] text-sm tracking-widest block">覺察紀錄</span>
              <textarea 
                placeholder="寫下練習中的身體感受或發現..." 
                className="w-full h-24 bg-transparent border border-[#333333] p-3 text-[#cccccc] focus:outline-none focus:border-[#666666] resize-none tracking-wide"
                value={record}
                onChange={(e) => setRecord(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4">
            {isEditingId && (
              <button 
                onClick={cancelEdit}
                className="px-6 py-3 text-[#888888] hover:text-[#e5e5e5] tracking-widest text-sm transition-colors"
              >
                取消
              </button>
            )}
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3 border border-[#666666] text-[#e5e5e5] hover:bg-[#e5e5e5] hover:text-[#1a1a1a] transition-all duration-500 tracking-widest"
            >
              {isEditingId ? null : <Activity size={18} />}
              <span>{isEditingId ? '更新紀錄' : '記錄當下'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 歷史紀錄 */}
      <section className="space-y-6">
        <h2 className="zen-title">近期覺察</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...awareness].reverse().map((a) => (
            <div key={a.id} className={`zen-border p-5 group flex justify-between items-start relative overflow-hidden flex-col gap-3 ${isEditingId === a.id ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <span className="text-[#e5e5e5] text-lg font-light">{a.bodyPart}</span>
                  <span className="text-[#888888] text-sm border-l border-[#333333] pl-3">
                    {a.practiceItem}
                  </span>
                </div>
                <div className="text-[#555555] text-xs font-mono">{a.date}</div>
              </div>
              
              <div className="text-[#cccccc] text-sm tracking-wide leading-relaxed pl-2 border-l border-[#222222]">
                {a.record}
              </div>

              <div className="absolute right-4 top-4 flex gap-2 action-hidden bg-[#1a1a1a] pl-2 z-10">
                <button 
                  onClick={() => startEdit(a)}
                  className="text-[#888888] hover:text-[#cccccc] transition-colors"
                  title="編輯"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => removeAwareness(a.id)}
                  className="text-[#ff6666] hover:text-[#ff9999] transition-colors"
                  title="刪除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {awareness.length === 0 && (
            <p className="text-[#555555] text-sm tracking-widest">尚無紀錄。準備好時，隨時開始。</p>
          )}
        </div>
      </section>
    </div>
  );
};
export default Awareness;
