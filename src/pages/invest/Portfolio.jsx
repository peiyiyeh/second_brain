import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const Portfolio = () => {
  const { portfolio, addPortfolio, updatePortfolio, removePortfolio, cashBalance, updateCashBalance } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    shares: '',
    avgCost: '',
    currentPrice: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.symbol || !formData.shares || !formData.avgCost) return;

    addPortfolio({
      symbol: formData.symbol.toUpperCase(),
      shares: Number(formData.shares),
      avgCost: Number(formData.avgCost),
      currentPrice: formData.currentPrice ? Number(formData.currentPrice) : Number(formData.avgCost)
    });

    setFormData({ symbol: '', shares: '', avgCost: '', currentPrice: '' });
    setIsAdding(false);
  };

  const handleUpdatePrice = (id, newPrice) => {
    updatePortfolio(id, { currentPrice: Number(newPrice) });
  };

  const fetchRealTimePrices = async () => {
    setIsUpdating(true);
    try {
      const symbolsToUpdate = portfolio.filter(p => !!p.symbol);
      for (const item of symbolsToUpdate) {
        try {
          let querySymbol = item.symbol;
          let isTaiwanAutoAppended = false;
          if (/^\d[A-Za-z0-9]{3,5}$/.test(querySymbol) && !querySymbol.includes('.')) {
            querySymbol = `${querySymbol}.TW`;
            isTaiwanAutoAppended = true;
          }
          
          let response = await fetch(`/api/yahoo/v8/finance/chart/${querySymbol}?interval=1d&range=1d`);
          let price = null;
          
          if (response.ok) {
            const data = await response.json();
            price = data.chart?.result?.[0]?.meta?.regularMarketPrice;
          }

          // Fallback to OTC (.TWO) if TWSE (.TW) has no data
          if (!price && isTaiwanAutoAppended) {
            querySymbol = `${item.symbol}.TWO`;
            response = await fetch(`/api/yahoo/v8/finance/chart/${querySymbol}?interval=1d&range=1d`);
            if (response.ok) {
              const data = await response.json();
              price = data.chart?.result?.[0]?.meta?.regularMarketPrice;
            }
          }

          if (price) {
            updatePortfolio(item.id, { currentPrice: Number(price) });
          }
        } catch (err) {
          console.error(`Failed to fetch price for ${item.symbol}`, err);
        }
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 flex flex-col h-[calc(100vh-2rem)]">
      <header className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#333333] pb-4">
        <div>
          <h1 className="text-2xl font-light text-[#e5e5e5] tracking-widest">投資組合</h1>
          <p className="text-sm text-[#888888] mt-2 tracking-wider">Portfolio Management</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 text-[#888888] text-sm">
            <span>現金:</span>
            <input 
              type="number" 
              value={cashBalance}
              onChange={(e) => updateCashBalance(Number(e.target.value))}
              className="bg-transparent border-b border-[#555555] w-24 text-[#e5e5e5] focus:outline-none focus:border-[#e5e5e5]"
            />
          </div>
          <button 
            onClick={fetchRealTimePrices}
            disabled={isUpdating || portfolio.length === 0}
            className={`flex items-center gap-2 px-4 py-2 bg-[#222222] border border-[#333333] text-[#cccccc] text-sm tracking-widest transition-colors ${
              isUpdating || portfolio.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#333333] hover:text-[#e5e5e5]'
            }`}
          >
            <RefreshCw size={16} className={isUpdating ? 'animate-spin' : ''} /> 
            {isUpdating ? '更新中...' : '更新報價'}
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-[#e5e5e5] text-[#111111] text-sm tracking-widest hover:bg-[#cccccc] transition-colors"
          >
            <Plus size={16} /> 新增標的
          </button>
        </div>
      </header>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-[#333333] p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-[#888888] tracking-widest mb-2">標的 (Symbol)</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                className="w-full bg-[#222222] border border-[#333333] p-2 text-[#e5e5e5] focus:outline-none focus:border-[#555555]"
                placeholder="e.g. AAPL"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-[#888888] tracking-widest mb-2">股數 (Shares)</label>
              <input
                type="number"
                step="any"
                value={formData.shares}
                onChange={(e) => setFormData({...formData, shares: e.target.value})}
                className="w-full bg-[#222222] border border-[#333333] p-2 text-[#e5e5e5] focus:outline-none focus:border-[#555555]"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-[#888888] tracking-widest mb-2">平均成本 (Avg Cost)</label>
              <input
                type="number"
                step="any"
                value={formData.avgCost}
                onChange={(e) => setFormData({...formData, avgCost: e.target.value})}
                className="w-full bg-[#222222] border border-[#333333] p-2 text-[#e5e5e5] focus:outline-none focus:border-[#555555]"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-[#888888] tracking-widest mb-2">現價 (Current Price)</label>
              <input
                type="number"
                step="any"
                value={formData.currentPrice}
                onChange={(e) => setFormData({...formData, currentPrice: e.target.value})}
                className="w-full bg-[#222222] border border-[#333333] p-2 text-[#e5e5e5] focus:outline-none focus:border-[#555555]"
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-[#333333] text-[#e5e5e5] text-sm tracking-widest hover:bg-[#444444] transition-colors">
              儲存
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-auto bg-[#1a1a1a] border border-[#333333]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#333333] text-xs tracking-widest text-[#888888]">
              <th className="p-4 font-normal">標的</th>
              <th className="p-4 font-normal">股數</th>
              <th className="p-4 font-normal">成本</th>
              <th className="p-4 font-normal">現價</th>
              <th className="p-4 font-normal">市值</th>
              <th className="p-4 font-normal">未實現損益</th>
              <th className="p-4 font-normal text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item) => {
              const marketValue = item.shares * (item.currentPrice || item.avgCost);
              const costBasis = item.shares * item.avgCost;
              const pnl = marketValue - costBasis;
              const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
              const isProfit = pnl >= 0;

              return (
                <tr key={item.id} className="border-b border-[#222222] hover:bg-[#222222]/50 transition-colors">
                  <td className="p-4 text-[#e5e5e5] font-medium">{item.symbol}</td>
                  <td className="p-4 text-[#cccccc]">{item.shares}</td>
                  <td className="p-4 text-[#cccccc]">${item.avgCost.toLocaleString()}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      step="any"
                      value={item.currentPrice || item.avgCost}
                      onChange={(e) => handleUpdatePrice(item.id, e.target.value)}
                      className="w-24 bg-transparent border-b border-[#444444] text-[#e5e5e5] focus:outline-none focus:border-[#888888] px-1 py-0.5"
                    />
                  </td>
                  <td className="p-4 text-[#cccccc]">${marketValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className={`p-4 flex items-center gap-2 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                    {isProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {isProfit ? '+' : ''}${pnl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                    <span className="text-xs opacity-80">({isProfit ? '+' : ''}{pnlPercent.toFixed(2)}%)</span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => removePortfolio(item.id)}
                      className="text-[#666666] hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {portfolio.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-[#666666] tracking-widest text-sm">
                  尚未建立投資組合
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
