import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, CheckCircle, Trash2, Edit2 } from 'lucide-react';

const Knitting = () => {
  const { yarn, projects, addYarn, updateYarn, removeYarn, addProject, updateProject, removeProject } = useStore();
  
  // Tabs
  const [activeTab, setActiveTab] = useState('yarn'); // 'yarn' | 'projects'

  // Add Yarn State
  const [isAddingYarn, setIsAddingYarn] = useState(false);
  const [yarnName, setYarnName] = useState('');
  const [yarnColor, setYarnColor] = useState('');
  const [yarnQty, setYarnQty] = useState(1);

  // Add Project State
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isEditingProjId, setIsEditingProjId] = useState(null);
  
  const [projName, setProjName] = useState('');
  const [projYarns, setProjYarns] = useState([]); 
  const [customYarn, setCustomYarn] = useState(''); // input field for custom explicit yarn strings
  const [projNeedleSize, setProjNeedleSize] = useState('');
  const [projStatus, setProjStatus] = useState('想法'); 
  const [projTechNotes, setProjTechNotes] = useState('');

  const statusOptions = ['想法', '進行中', '已完工'];

  const handleAddYarn = () => {
    if (!yarnName.trim() || yarnQty <= 0) return;
    addYarn({ name: yarnName, color: yarnColor, quantity: Number(yarnQty) });
    setYarnName(''); setYarnColor(''); setYarnQty(1); setIsAddingYarn(false);
  };

  const handleAddProject = () => {
    if (!projName.trim()) return;
    
    if (isEditingProjId) {
      updateProject(isEditingProjId, {
        name: projName, 
        yarnUsed: projYarns, 
        needleSize: projNeedleSize,
        status: projStatus,
        techNotes: projTechNotes,
      });
    } else {
      addProject({ 
        name: projName, 
        yarnUsed: projYarns, 
        needleSize: projNeedleSize,
        status: projStatus,
        techNotes: projTechNotes,
        startDate: new Date().toISOString() 
      });
    }
    cancelEditProject();
  };

  const handleAddCustomYarn = (e) => {
    if (e) e.preventDefault();
    if (!customYarn.trim()) return;
    if (!projYarns.includes(customYarn.trim())) {
      setProjYarns([...projYarns, customYarn.trim()]);
    }
    setCustomYarn('');
  };

  const startEditProject = (p) => {
    setIsEditingProjId(p.id);
    setProjName(p.name);
    setProjYarns(p.yarnUsed || []);
    setProjNeedleSize(p.needleSize || '');
    setProjStatus(p.status || '想法');
    setProjTechNotes(p.techNotes || '');
    setCustomYarn('');
    setIsAddingProject(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditProject = () => {
    setIsEditingProjId(null);
    setIsAddingProject(false);
    setProjName(''); 
    setProjYarns([]); 
    setProjNeedleSize(''); 
    setProjStatus('想法'); 
    setProjTechNotes('');
    setCustomYarn('');
  };

  const toggleProjectYarn = (yarnIdOrStr, e) => {
    if (e) e.preventDefault();
    setProjYarns(prev => prev.includes(yarnIdOrStr) ? prev.filter(y => y !== yarnIdOrStr) : [...prev, yarnIdOrStr]);
  };

  const customYarnsInProj = projYarns.filter(yId => !yarn.find(y => y.id === yId));

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <header className="space-y-8 flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-[#333333] pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-wider text-[#e5e5e5]">編織</h1>
          <p className="text-[#888888] tracking-widest text-sm mt-2">創作與材料管理</p>
        </div>
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveTab('yarn')}
            className={`pb-2 text-sm tracking-widest transition-all ${activeTab === 'yarn' ? 'text-[#e5e5e5] border-b border-[#e5e5e5]' : 'text-[#666666] hover:text-[#aaaaaa]'}`}
          >
            毛線庫存
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`pb-2 text-sm tracking-widest transition-all ${activeTab === 'projects' ? 'text-[#e5e5e5] border-b border-[#e5e5e5]' : 'text-[#666666] hover:text-[#aaaaaa]'}`}
          >
            手作專案
          </button>
        </div>
      </header>

      {/* ================= 毛線區 ================= */}
      {activeTab === 'yarn' && (
        <section className="space-y-8 animate-fade-in">
          <div className="flex justify-end">
            {!isAddingYarn && (
              <button onClick={() => setIsAddingYarn(true)} className="flex items-center gap-2 text-[#888888] hover:text-[#e5e5e5] transition-colors">
                <Plus size={16} /> <span className="tracking-widest text-sm">新材料</span>
              </button>
            )}
          </div>

          {isAddingYarn && (
            <div className="zen-panel bg-[#1a1a1a] border-[#555555] grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <input type="text" placeholder="品牌/名稱..." value={yarnName} onChange={e=>setYarnName(e.target.value)} className="bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] focus:border-[#888888] focus:outline-none" />
              <input type="text" placeholder="顏色/色號..." value={yarnColor} onChange={e=>setYarnColor(e.target.value)} className="bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] focus:border-[#888888] focus:outline-none" />
              <div className="flex items-center gap-2">
                <span className="text-[#666666] text-sm">庫存(球)</span>
                <input type="number" min="1" value={yarnQty} onChange={e=>setYarnQty(e.target.value)} className="w-16 bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] focus:border-[#888888] focus:outline-none text-center" />
              </div>
              <div className="flex items-end justify-end gap-4 mt-4 md:mt-0 pb-1">
                <button onClick={() => setIsAddingYarn(false)} className="text-[#888888] hover:text-[#e5e5e5] text-sm">取消</button>
                <button onClick={handleAddYarn} className="text-[#e5e5e5] border border-[#666666] px-4 py-1 hover:bg-[#e5e5e5] hover:text-[#1a1a1a] text-sm tracking-widest transition-colors">確認</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#333333] text-[#888888] text-sm tracking-widest">
                  <th className="py-4 px-4 font-normal">名稱</th>
                  <th className="py-4 px-4 font-normal">顏色</th>
                  <th className="py-4 px-4 font-normal text-center">數量</th>
                  <th className="py-4 px-4 font-normal text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {[...yarn].sort((a, b) => b.id - a.id).map(y => (
                  <tr key={y.id} className="border-b border-[#222222] hover:bg-[#1f1f1f] transition-colors group">
                    <td className="py-4 px-4 text-[#e5e5e5]">{y.name}</td>
                    <td className="py-4 px-4 text-[#888888]">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-[#555555] inline-block" style={{ backgroundColor: y.color || 'transparent' }}></span>
                        {y.color || '未標示'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => y.quantity > 0 && updateYarn(y.id, { quantity: y.quantity - 1 })} className="w-6 h-6 border border-[#333333] text-[#888888] hover:text-[#e5e5e5] flex items-center justify-center">-</button>
                        <span className="text-[#e5e5e5] w-6 text-center">{y.quantity}</span>
                        <button onClick={() => updateYarn(y.id, { quantity: y.quantity + 1 })} className="w-6 h-6 border border-[#333333] text-[#888888] hover:text-[#e5e5e5] flex items-center justify-center">+</button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button onClick={() => removeYarn(y.id)} className="text-[#666666] hover:text-[#ff9999] transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {yarn.length === 0 && !isAddingYarn && <div className="border-t border-dashed border-[#333333] p-12 text-center text-[#555555]">無庫存紀錄</div>}
          </div>
        </section>
      )}

      {/* ================= 專案區 ================= */}
      {activeTab === 'projects' && (
        <section className="space-y-8 animate-fade-in">
          <div className="flex justify-end">
            {!isAddingProject && (
              <button onClick={() => setIsAddingProject(true)} className="flex items-center gap-2 text-[#888888] hover:text-[#e5e5e5] transition-colors">
                <Plus size={16} /> <span className="tracking-widest text-sm">新作品</span>
              </button>
            )}
          </div>

          {isAddingProject && (
            <div className={`zen-panel p-6 space-y-6 transition-colors ${isEditingProjId ? 'bg-[#2a2a2a] border-[#888888]' : 'bg-[#1a1a1a] border-[#555555]'}`}>
              {isEditingProjId && (
                <div className="text-[#bbbbbb] text-sm tracking-widest pb-2 border-b border-[#333333]">正在編輯專案...</div>
              )}
              <input type="text" placeholder="作品名稱..." value={projName} onChange={e=>setProjName(e.target.value)} className="w-full bg-transparent border-b border-[#333333] p-2 text-lg text-[#e5e5e5] focus:border-[#888888] focus:outline-none tracking-widest my-2" autoFocus />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 左側：進度與針號 */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-[#888888] tracking-widest block">作品狀態</label>
                    <div className="flex gap-2">
                      {statusOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={(e) => { e.preventDefault(); setProjStatus(opt); }}
                          className={`px-4 py-1 text-sm border transition-colors ${projStatus === opt ? 'border-[#cccccc] text-[#e5e5e5] bg-[#333333]' : 'border-[#333333] text-[#666666] hover:border-[#666666]'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[#888888] tracking-widest block">針號/工具</label>
                    <input type="text" placeholder="例如: 3.5mm 輪針" value={projNeedleSize} onChange={e=>setProjNeedleSize(e.target.value)} className="w-full bg-transparent border-b border-[#333333] p-2 text-[#cccccc] focus:border-[#888888] focus:outline-none" />
                  </div>
                </div>

                {/* 右側：材料與筆記 */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-[#888888] tracking-widest block">綁定材料</label>
                    
                    <div className="flex flex-wrap gap-2">
                      {yarn.map(y => (
                        <button 
                          key={y.id} 
                          onClick={(e) => toggleProjectYarn(y.id, e)}
                          className={`px-3 py-1 text-xs border transition-colors ${projYarns.includes(y.id) ? 'border-[#cccccc] text-[#e5e5e5] bg-[#333333]' : 'border-[#333333] text-[#666666] hover:border-[#666666]'}`}
                        >
                          {y.name} ({y.color})
                        </button>
                      ))}
                      {customYarnsInProj.map((cy, idx) => (
                        <button
                          key={`custom-${idx}`}
                          onClick={(e) => toggleProjectYarn(cy, e)}
                          className="px-3 py-1 text-xs border border-[#cccccc] text-[#e5e5e5] bg-[#333333] transition-colors"
                          title="點擊移除"
                        >
                          {cy} ✕
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#333333]/50">
                      <input 
                        type="text" 
                        placeholder="手動輸入線材..." 
                        value={customYarn}
                        onChange={e => setCustomYarn(e.target.value)}
                        className="bg-transparent border-b border-[#333333] p-1 text-[#cccccc] focus:border-[#888888] focus:outline-none text-sm flex-1"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomYarn(e); }}
                      />
                      <button onClick={handleAddCustomYarn} className="text-[#888888] hover:text-[#cccccc] text-xs px-3 py-1 border border-[#333333] hover:border-[#666666] transition-colors">
                        ＋ 加入
                      </button>
                    </div>

                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[#888888] tracking-widest block">技術筆記</label>
                    <textarea 
                      placeholder="起針數、圖解位置、修改紀錄..." 
                      value={projTechNotes} 
                      onChange={e=>setProjTechNotes(e.target.value)} 
                      className="w-full h-20 bg-transparent border border-[#333333] p-2 text-sm text-[#cccccc] focus:border-[#888888] focus:outline-none resize-none leading-relaxed" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-[#333333]">
                <button onClick={cancelEditProject} className="text-[#888888] hover:text-[#e5e5e5] text-sm">取消</button>
                <button onClick={handleAddProject} className="text-[#e5e5e5] border border-[#666666] px-6 py-2 hover:bg-[#e5e5e5] hover:text-[#1a1a1a] text-sm tracking-widest transition-colors">
                  {isEditingProjId ? '更新專案' : '建立專案'}
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse mt-6">
              <thead>
                <tr className="border-b border-[#333333] text-[#888888] text-sm tracking-widest">
                  <th className="py-4 px-4 font-normal">狀態</th>
                  <th className="py-4 px-4 font-normal">作品名稱</th>
                  <th className="py-4 px-4 font-normal">工具/材料</th>
                  <th className="py-4 px-4 font-normal">開始日期</th>
                  <th className="py-4 px-4 font-normal text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {[...projects].sort((a, b) => b.id - a.id).map(p => (
                  <tr key={p.id} className={`border-b border-[#222222] hover:bg-[#1f1f1f] transition-colors group ${p.status === '已完工' ? 'opacity-70 bg-[#1a1a1a]' : ''} ${isEditingProjId === p.id ? 'bg-[#2a2a2a]' : ''}`}>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-0.5 border ${p.status === '已完工' ? 'border-[#444444] text-[#888888]' : p.status === '進行中' ? 'border-[#666666] text-[#cccccc] bg-[#333333]' : 'border-[#444444] text-[#888888]'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[#e5e5e5]">{p.name}</div>
                      {p.techNotes && (
                        <div className="text-[#888888] text-xs mt-1 truncate max-w-xs" title={p.techNotes}>{p.techNotes}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs text-[#888888] mb-1">{p.needleSize || '未指定工具'}</div>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.yarnUsed?.map((yId, idx) => {
                          const yInfo = yarn.find(y => y.id === yId);
                          return yInfo ? (
                            <span key={yId} className="text-[#666666] text-[10px] border border-[#333333] px-1">{yInfo.name}</span>
                          ) : (
                            <span key={`custom-${idx}`} className="text-[#666666] text-[10px] border border-[#333333] px-1">{yId}</span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#666666] text-xs font-mono">{p.startDate?.split('T')[0]}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditProject(p)} className="text-[#888888] hover:text-[#cccccc] transition-colors" title="編輯">
                          <Edit2 size={16} />
                        </button>
                        {p.status !== '已完工' && (
                          <button onClick={() => updateProject(p.id, { status: '已完工', endDate: new Date().toISOString() })} className="text-[#bbbbbb] hover:text-[#ffffbb] transition-colors" title="標記完工">
                            <CheckCircle size={16} className="font-light" />
                          </button>
                        )}
                        <button onClick={() => removeProject(p.id)} className="text-[#666666] hover:text-[#ff9999] transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {projects.length === 0 && !isAddingProject && <div className="border-t border-dashed border-[#333333] p-12 text-center text-[#555555] tracking-widest">尚無進行中的專案</div>}
          </div>
        </section>
      )}

    </div>
  );
};
export default Knitting;
