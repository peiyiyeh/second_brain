import React from 'react';
import { useStore } from '../../store/useStore';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Percent, Wallet } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const InvestDashboard = () => {
  const { portfolio, cashBalance } = useStore();

  const totalInvested = portfolio.reduce((acc, item) => acc + ((item.shares || 0) * (item.avgCost || 0)), 0);
  const totalMarketValue = portfolio.reduce((acc, item) => acc + ((item.shares || 0) * (item.currentPrice || item.avgCost || 0)), 0);
  const netWorth = totalMarketValue + cashBalance;
  
  const totalProfit = totalMarketValue - totalInvested;
  const returnRate = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(2) : 0;

  const pieData = portfolio.map(item => ({
    name: item.symbol,
    value: (item.shares || 0) * (item.currentPrice || item.avgCost || 0)
  }));
  
  if (cashBalance > 0) {
    pieData.push({ name: 'Cash', value: cashBalance });
  }

  const mockTrendData = [
    { name: 'Jan', value: totalInvested > 0 ? totalInvested * 0.95 : 1000 },
    { name: 'Feb', value: totalInvested > 0 ? totalInvested * 0.98 : 1050 },
    { name: 'Mar', value: totalInvested > 0 ? totalInvested * 1.02 : 1020 },
    { name: 'Apr', value: totalMarketValue > 0 ? totalMarketValue : 1100 }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <header className="mb-8 border-b border-[#333333] pb-4">
        <h1 className="text-2xl font-light text-[#e5e5e5] tracking-widest">投資總覽</h1>
        <p className="text-sm text-[#888888] mt-2 tracking-wider">Dashboard</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-none relative overflow-hidden group">
          <div className="flex items-center justify-between z-10 relative">
            <div>
              <p className="text-[#888888] text-xs tracking-widest mb-1">總資產 (Net Worth)</p>
              <h3 className="text-2xl text-[#e5e5e5]">${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <DollarSign className="text-[#444444] group-hover:text-[#666666] transition-colors" size={24} />
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-none relative overflow-hidden group">
          <div className="flex items-center justify-between z-10 relative">
            <div>
              <p className="text-[#888888] text-xs tracking-widest mb-1">未實現損益 (PnL)</p>
              <h3 className={`text-2xl ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <TrendingUp className="text-[#444444] group-hover:text-[#666666] transition-colors" size={24} />
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-none relative overflow-hidden group">
          <div className="flex items-center justify-between z-10 relative">
            <div>
              <p className="text-[#888888] text-xs tracking-widest mb-1">報酬率 (Return)</p>
              <h3 className={`text-2xl ${returnRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {returnRate >= 0 ? '+' : ''}{returnRate}%
              </h3>
            </div>
            <Percent className="text-[#444444] group-hover:text-[#666666] transition-colors" size={24} />
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-none relative overflow-hidden group">
          <div className="flex items-center justify-between z-10 relative">
            <div>
              <p className="text-[#888888] text-xs tracking-widest mb-1">現金 (Cash)</p>
              <h3 className="text-2xl text-[#e5e5e5]">${cashBalance.toLocaleString()}</h3>
            </div>
            <Wallet className="text-[#444444] group-hover:text-[#666666] transition-colors" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-none">
          <h2 className="text-[#e5e5e5] text-lg font-light tracking-wide mb-6">資產配置</h2>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#222222', border: '1px solid #444444', color: '#e5e5e5' }}
                    itemStyle={{ color: '#e5e5e5' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center text-xs text-[#888888]">
                    <span className="w-3 h-3 inline-block mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name} ({ ((entry.value / netWorth) * 100).toFixed(1) }%)
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-[#666666] text-sm tracking-widest">
              尚無資產資料
            </div>
          )}
        </div>

        <div className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-none">
          <h2 className="text-[#e5e5e5] text-lg font-light tracking-wide mb-6">損益趨勢</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <XAxis dataKey="name" stroke="#666666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666666" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222222', border: '1px solid #444444', color: '#e5e5e5' }}
                />
                <Line type="monotone" dataKey="value" stroke="#00C49F" strokeWidth={2} dot={{ r: 4, fill: '#00C49F' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestDashboard;
