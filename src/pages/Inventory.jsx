import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const categories = ['衣物', '書籍', '數位', '雜物', '其他'];

const Inventory = () => {
  const { inventory, addInventoryItem, removeInventoryItem } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const [name, setName] = useState('');
  const [type, setType] = useState('IN'); // 'IN' or 'OUT'
  const [qty, setQty] = useState(1);
  const [category, setCategory] = useState(categories[0]);

  const handleSave = () => {
    if (!name.trim() || qty <= 0) return;
    addInventoryItem({
      name,
      type,
      qty: Number(qty),
      category,
      date: format(new Date(), 'yyyy-MM-dd HH:mm')
    });
    setName('');
    setQty(1);
    setIsAdding(false);
  };

  const inItems = inventory.filter(i => i.type === 'IN').sort((a, b) => b.id - a.id);
  const outItems = inventory.filter(i => i.type === 'OUT').sort((a, b) => b.id - a.id);
  
  const inTotal = inItems.reduce((acc, i) => acc + i.qty, 0);
  const outTotal = outItems.reduce((acc, i) => acc + i.qty, 0);

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <header className="space-y-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-wider text-[#e5e5e5]">流動</h1>
          <p className="text-[#888888] tracking-widest text-sm mt-2">斷捨離與物品管理</p>
        </div>
        {!isAdding && (
          <div className="flex gap-4">
            <button 
              onClick={() => { setType('IN'); setIsAdding(true); }}
              className="flex items-center gap-2 text-[#888888] hover:text-[#e5e5e5] transition-colors pb-1 border-b border-transparent hover:border-[#666666]"
            >
              <Plus size={16} /> <span className="tracking-widest text-sm">入庫</span>
            </button>
            <button 
              onClick={() => { setType('OUT'); setIsAdding(true); }}
              className="flex items-center gap-2 text-[#888888] hover:text-[#e5e5e5] transition-colors pb-1 border-b border-transparent hover:border-[#666666]"
            >
              <Minus size={16} /> <span className="tracking-widest text-sm">斷捨</span>
            </button>
          </div>
        )}
      </header>

      {/* 新增紀錄 */}
      {isAdding && (
        <section className={`zen-panel border-l-2 transition-all duration-300 ${type === 'IN' ? 'border-[#888888] bg-[#1a1a1a]' : 'border-[#666666] bg-[#1f1a1a]'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-[#e5e5e5] font-light tracking-widest">{type === 'IN' ? '新增物品' : '丟棄物品'}</h2>
            <div className="flex gap-2">
              <button onClick={() => setType('IN')} className={`px-3 py-1 text-sm tracking-widest ${type === 'IN' ? 'bg-[#333333] text-[#e5e5e5]' : 'text-[#888888]'}`}>IN</button>
              <button onClick={() => setType('OUT')} className={`px-3 py-1 text-sm tracking-widest ${type === 'OUT' ? 'bg-[#333333] text-[#e5e5e5]' : 'text-[#888888]'}`}>OUT</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <input 
              type="text" 
              placeholder="物品名稱..." 
              value={name} onChange={e => setName(e.target.value)}
              className="md:col-span-2 bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] focus:border-[#bbbbbb] focus:outline-none tracking-widest"
              autoFocus
            />
            <input 
              type="number" min="1"
              value={qty} onChange={e => setQty(e.target.value)}
              className="bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] text-center focus:border-[#bbbbbb] focus:outline-none"
            />
            <select 
              value={category} onChange={e => setCategory(e.target.value)}
              className="bg-transparent border-b border-[#333333] p-2 text-[#e5e5e5] focus:border-[#bbbbbb] focus:outline-none focus:bg-[#1a1a1a]"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex justify-end mt-8 gap-4">
            <button onClick={() => setIsAdding(false)} className="text-[#888888] hover:text-[#e5e5e5] text-sm tracking-widest transition-colors">取消</button>
            <button onClick={handleSave} className="text-[#e5e5e5] border border-[#666666] px-6 py-2 hover:bg-[#e5e5e5] hover:text-[#1a1a1a] text-sm tracking-widest transition-colors">確認</button>
          </div>
        </section>
      )}

      {/* 雙欄列表 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 pt-8 border-t border-[#333333]">
        
        {/* IN 欄位 */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-[#333333] pb-2">
            <h2 className="text-[#cccccc] tracking-widest text-lg font-light">入庫 (IN)</h2>
            <span className="text-[#888888] font-mono">{inTotal} 件</span>
          </div>
          <ul className="space-y-4">
            {inItems.map(item => (
              <li key={item.id} className="group flex justify-between items-center py-2 border-b border-[#222222] hover:border-[#444444] transition-colors relative">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#e5e5e5]">{item.name}</span>
                    <span className="text-[#888888] text-xs px-2 py-0 border border-[#333333]">{item.qty}</span>
                  </div>
                  <div className="text-[#666666] text-xs mt-1 flex gap-2">
                    <span>{item.category}</span>
                    <span>·</span>
                    <span>{item.date.split(' ')[0]}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeInventoryItem(item.id)}
                  className="action-hidden text-[#ff6666] hover:text-[#ff9999] p-2"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
            {inItems.length === 0 && <li className="text-[#555555] tracking-widest text-sm pt-4">無入庫紀錄</li>}
          </ul>
        </div>

        {/* OUT 欄位 */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-[#333333] pb-2">
            <h2 className="text-[#cccccc] tracking-widest text-lg font-light">斷捨 (OUT)</h2>
            <span className="text-[#888888] font-mono">{outTotal} 件</span>
          </div>
          <ul className="space-y-4">
            {outItems.map(item => (
              <li key={item.id} className="group flex justify-between items-center py-2 border-b border-[#222222] hover:border-[#444444] transition-colors relative">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#888888] line-through decoration-[#555555]">{item.name}</span>
                    <span className="text-[#666666] text-xs px-2 py-0 border border-[#222222]">{item.qty}</span>
                  </div>
                  <div className="text-[#555555] text-xs mt-1 flex gap-2">
                    <span>{item.category}</span>
                    <span>·</span>
                    <span>{item.date.split(' ')[0]}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeInventoryItem(item.id)}
                  className="action-hidden text-[#ff6666] hover:text-[#ff9999] p-2"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
            {outItems.length === 0 && <li className="text-[#555555] tracking-widest text-sm pt-4">無斷捨紀錄</li>}
          </ul>
        </div>

      </section>
    </div>
  );
};
export default Inventory;
