import { useState } from 'react';
import { useStore } from '../store/useStore';
import ProgressBar from '../components/ui/ProgressBar';
import { Plus, Trash2, Edit2, Play } from 'lucide-react';

const Goals = () => {
  const { goals, addGoal, removeGoal, incrementGoal, updateGoal } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  
  const completedCount = goals.filter(g => g.current >= g.target).length;
  
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(10);
  const [unit, setUnit] = useState('次');
  const [deadline, setDeadline] = useState('');

  
  const handleSave = () => {
    if (!title) return;
    if (isEditing) {
      updateGoal(isEditing, { title, target: Number(target), unit, deadline });
      setIsEditing(null);
    } else {
      addGoal({ title, target: Number(target), unit, deadline });
    }
    setTitle('');
    setTarget(10);
    setUnit('次');
    setDeadline('');
    setIsAdding(false);
  };

  const startEdit = (goal) => {
    setIsEditing(goal.id);
    setTitle(goal.title);
    setTarget(goal.target);
    setUnit(goal.unit || '次');
    setDeadline(goal.deadline || '');
    setIsAdding(true);
  };

  const isExpired = (goalDeadline) => {
    if (!goalDeadline) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(goalDeadline);
    return d < today;
  };

  const activeGoals = goals.filter(g => !isExpired(g.deadline));
  const expiredGoals = goals.filter(g => isExpired(g.deadline));


  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <header className="space-y-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light tracking-wider text-[#e5e5e5] flex items-baseline gap-4">
            微光
            <span className="text-sm text-[#888888]">已達成: {completedCount} 件</span>
          </h1>
          <p className="text-[#888888] tracking-widest text-sm mt-2">年度目標：微小穩定的累積</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setIsEditing(null); setTitle(''); }}
          className="flex items-center gap-2 text-[#888888] hover:text-[#e5e5e5] transition-colors pb-1"
        >
          <Plus size={18} />
          <span className="tracking-widest text-sm">點亮</span>
        </button>
      </header>

      {/* 新增/編輯區塊 */}
      {isAdding && (
        <section className="zen-panel bg-[#1a1a1a] border-[#666666] transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="微光目標..." 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="flex-1 bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] focus:border-[#bbbbbb] focus:outline-none tracking-widest"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={target}
                onChange={e => setTarget(e.target.value)}
                className="w-20 bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] text-center focus:border-[#bbbbbb] focus:outline-none"
                title="目標數量"
              />
              <input 
                type="text" 
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-16 bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] text-center focus:border-[#bbbbbb] focus:outline-none"
                title="單位"
              />
              <input 
                type="date" 
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] text-center focus:border-[#bbbbbb] focus:outline-none ml-2 tracking-widest text-sm"
                title="到期日"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-4">
            <button onClick={() => setIsAdding(false)} className="text-[#888888] hover:text-[#e5e5e5] text-sm tracking-widest transition-colors">取消</button>
            <button onClick={handleSave} className="text-[#e5e5e5] border border-[#666666] px-4 py-1 hover:bg-[#e5e5e5] hover:text-[#1a1a1a] text-sm tracking-widest transition-colors">確認</button>
          </div>
        </section>
      )}

      {/* 目標列表 */}
      <section className="space-y-8">
        {activeGoals.map((g) => (
          <div key={g.id} className="zen-border p-6 relative group bg-[#1f1f1f] hover:border-[#666666] transition-all duration-500">
            {/* 隱藏操作選單 */}
            <div className="absolute right-4 top-4 flex gap-3 action-hidden z-10">
              <button 
                onClick={() => startEdit(g)}
                className="text-[#888888] hover:text-[#e5e5e5] transition-colors"
                title="編輯"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => removeGoal(g.id)}
                className="text-[#ff6666] hover:text-[#ff9999] transition-colors"
                title="刪除"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="flex justify-between items-start mb-6 pr-16">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-light text-[#e5e5e5] tracking-widest">{g.title}</h3>
                  {g.deadline && (
                    <span className="text-xs border border-[#444444] px-2 py-0.5 text-[#888888]">到期: {g.deadline}</span>
                  )}
                </div>
                <div className="text-[#666666] text-xs font-mono mt-1">
                  進度：{g.current.toFixed(1)} / {g.target} {g.unit}
                </div>
              </div>
              <button 
                onClick={() => incrementGoal(g.id, 1)}
                className="flex items-center gap-1 border border-[#333333] px-3 py-1 rounded-full hover:border-[#888888] hover:bg-[#333333] transition-all group/btn"
              >
                <Play size={12} className="text-[#888888] group-hover/btn:text-[#cccccc]" fill="currentColor" />
                <span className="text-[#888888] group-hover/btn:text-[#cccccc] text-xs tracking-widest">+1</span>
              </button>
            </div>
            
            <ProgressBar current={g.current} target={g.target} />
          </div>
        ))}

        {goals.length === 0 && !isAdding && (
          <div className="border border-dashed border-[#333333] p-12 text-center">
            <p className="text-[#666666] tracking-widest">目前沒有微光，按下「點亮」開始新旅程。</p>
          </div>
        )}
      </section>

      {/* 歷史紀錄區 */}
      {expiredGoals.length > 0 && (
        <section className="space-y-6 mt-16 pt-8 border-t border-[#333333]">
          <h2 className="text-xl font-light tracking-widest text-[#888888]">歷史紀錄 (已到期)</h2>
          <div className="space-y-4">
            {expiredGoals.map((g) => (
              <div key={g.id} className="zen-border p-6 relative bg-[#1a1a1a] opacity-70">
                <div className="absolute right-4 top-4 flex gap-3 z-10">
                  <button 
                    onClick={() => removeGoal(g.id)}
                    className="text-[#ff6666] hover:text-[#ff9999] transition-colors"
                    title="刪除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex justify-between items-start mb-6 pr-16">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-light text-[#cccccc] tracking-widest">{g.title}</h3>
                      <span className="text-xs border border-[#444444] px-2 py-0.5 text-[#666666]">到期: {g.deadline}</span>
                    </div>
                    <div className="text-[#666666] text-xs font-mono mt-1">
                      最終進度：{g.current.toFixed(1)} / {g.target} {g.unit}
                    </div>
                  </div>
                </div>
                
                <ProgressBar current={g.current} target={g.target} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
export default Goals;
