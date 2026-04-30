import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, BookOpen, Activity, Box, Compass, Download, Upload, FileSpreadsheet, LineChart, Briefcase, BookMarked } from 'lucide-react';
import * as XLSX from 'xlsx';

const Sidebar = () => {
  const navItems = [
    { name: '總覽', path: '/', icon: LayoutDashboard },
    { name: '微光', path: '/goals', icon: Target },
    { name: '隨筆', path: '/journal', icon: BookOpen },
    { name: '覺察', path: '/awareness', icon: Activity },
    { name: '流動', path: '/inventory', icon: Box },
    { name: '編織', path: '/knitting', icon: Compass },
    { name: '投資總覽', path: '/invest', icon: LineChart },
    { name: '投資組合', path: '/invest/portfolio', icon: Briefcase },
    { name: '投資日誌', path: '/invest/journal', icon: BookMarked },
  ];

  const handleExport = () => {
    const data = localStorage.getItem('second-brain-storage');
    if (!data) return alert('沒有發現資料可供匯出');
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `second-brain-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExcelExport = () => {
    const dataString = localStorage.getItem('second-brain-storage');
    if (!dataString) return alert('沒有發現資料可供匯出');
    try {
      const data = JSON.parse(dataString);
      const state = data.state;
      if (!state) return alert('資料格式不正確');
      const wb = XLSX.utils.book_new();
      
      const addSheet = (sheetName, dataArray) => {
        if (!dataArray || dataArray.length === 0) return;
        const ws = XLSX.utils.json_to_sheet(dataArray);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      };

      addSheet('Journals', state.journals);
      addSheet('Awareness', state.awareness);
      addSheet('Inventory', state.inventory);
      addSheet('Goals', state.goals);
      addSheet('Yarn', state.yarn);
      addSheet('Projects', state.projects);
      addSheet('Portfolio', state.portfolio);
      addSheet('InvestJournals', state.investJournals);
      
      if (wb.SheetNames.length === 0) {
        return alert('沒有資料可以匯出');
      }

      XLSX.writeFile(wb, `second-brain-backup-${new Date().toISOString().split('T')[0]}.xlsx`);

    } catch (error) {
      alert('匯出 Excel 發生錯誤');
      console.error(error);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.state) {
          if (window.confirm('匯入將會覆蓋您目前的資料，確定要繼續嗎？')) {
            localStorage.setItem('second-brain-storage', JSON.stringify(json));
            window.location.reload();
          }
        } else {
          alert('匯入的檔案格式不正確，找不到 state 結構。');
        }
      } catch (error) {
        alert('解析 JSON 檔案失敗，檔案可能損毀或非可用格式。');
        console.error(error);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <aside className="w-20 md:w-64 border-r border-[#333333] h-screen bg-[#1a1a1a] flex flex-col pt-8">
      <div className="hidden md:block px-8 pb-8 border-b border-[#333333]">
        <h1 className="text-xl tracking-[0.2em] text-[#e5e5e5] font-light">無住</h1>
        <p className="text-xs text-[#666666] mt-2 tracking-widest">Second Brain</p>
      </div>
      
      <nav className="flex-1 py-8 flex flex-col gap-2 px-2 md:px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-none transition-all duration-300 ${
                isActive
                  ? 'text-[#e5e5e5] bg-[#222222] border-l-2 border-[#e5e5e5]'
                  : 'text-[#888888] hover:text-[#cccccc] hover:bg-[#222222]/50 border-l-2 border-transparent'
              }`
            }
          >
            <item.icon size={20} strokeWidth={1.5} />
            <span className="hidden md:block tracking-widest text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-[#333333]">
        <div className="flex flex-col gap-4 mb-4 hidden md:flex">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 text-[#666666] hover:text-[#e5e5e5] transition-colors text-xs tracking-widest"
          >
            <Download size={14} /> 匯出資料 (JSON)
          </button>
          
          <button 
            onClick={handleExcelExport}
            className="flex items-center gap-2 text-[#666666] hover:text-[#e5e5e5] transition-colors text-xs tracking-widest"
          >
            <FileSpreadsheet size={14} /> 匯出資料 (Excel)
          </button>

          <label className="flex items-center gap-2 text-[#666666] hover:text-[#e5e5e5] transition-colors text-xs tracking-widest cursor-pointer">
            <Upload size={14} /> 匯入資料 (JSON)
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
        
        {/* Mobile View Icons */}
        <div className="flex flex-col gap-4 mb-4 md:hidden items-center text-[#666666]">
          <button onClick={handleExport} title="匯出資料 (JSON)"><Download size={18} /></button>
          <button onClick={handleExcelExport} title="匯出資料 (Excel)"><FileSpreadsheet size={18} /></button>
          <label className="cursor-pointer" title="匯入資料">
            <Upload size={18} />
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        <p className="text-[10px] text-[#555555] tracking-widest text-center md:text-left hidden md:block mt-2 pt-2 border-t border-[#222222]">
          應無所住
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
