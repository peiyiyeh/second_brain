import { useStore } from '../store/useStore';
import { getDailyQuote } from '../utils/quotes';
import ProgressBar from '../components/ui/ProgressBar';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

const Dashboard = () => {
  const { journals, awareness, inventory, goals } = useStore();

  const inventoryNet = inventory.reduce(
    (acc, item) => acc + (item.type === 'IN' ? item.qty : -item.qty),
    0
  );

  const topGoals = goals.slice(0, 3);
  const recentJournals = [...journals].sort((a, b) => b.id - a.id).slice(0, 3);
  const recentAwareness = [...awareness].sort((a, b) => b.id - a.id).slice(0, 3);
  const recentInventory = [...inventory].sort((a, b) => b.id - a.id).slice(0, 5);

  const today = new Date();
  const dailyQuoteObj = getDailyQuote();

  return (
    <div className="space-y-16 animate-fade-in pb-12">
      {/* 經文輪播卡片 */}
      <section className="text-center space-y-6 py-8 max-w-3xl mx-auto">
        <div className="space-y-4">
          <p className="text-xl md:text-2xl font-light tracking-[0.1em] text-[#e5e5e5] leading-relaxed">
            {dailyQuoteObj.quote}
          </p>
          <p className="text-sm md:text-base text-[#888888] tracking-widest leading-relaxed">
            {dailyQuoteObj.explanation}
          </p>
        </div>
        <div className="text-sm text-[#666666] tracking-widest pt-2">
          {format(today, 'yyyy年 MM月 dd日 EEEE', { locale: zhTW })}
        </div>
      </section>

      {/* 統計卡片 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="zen-panel flex flex-col items-center justify-center space-y-2 h-32 hover:bg-[#222222] transition-colors">
          <span className="text-[#888888] tracking-widest text-sm">隨筆總數</span>
          <span className="text-3xl font-light text-[#e5e5e5]">{journals.length}</span>
        </div>
        <div className="zen-panel flex flex-col items-center justify-center space-y-2 h-32 hover:bg-[#222222] transition-colors">
          <span className="text-[#888888] tracking-widest text-sm">覺察次數</span>
          <span className="text-3xl font-light text-[#e5e5e5]">{awareness.length}</span>
        </div>
        <div className="zen-panel flex flex-col items-center justify-center space-y-2 h-32 hover:bg-[#222222] transition-colors">
          <span className="text-[#888888] tracking-widest text-sm">物質淨變化</span>
          <span className={`text-3xl font-light ${inventoryNet > 0 ? 'text-[#ff9999]' : inventoryNet < 0 ? 'text-[#99ff99]' : 'text-[#e5e5e5]'}`}>
            {inventoryNet > 0 ? '+' : ''}{inventoryNet}
          </span>
        </div>
      </section>

      {/* 年度進度 (微光) */}
      <section className="space-y-8">
        <h2 className="zen-title">微光進度</h2>
        <div className="space-y-6 max-w-2xl">
          {topGoals.length > 0 ? (
            topGoals.map(goal => (
              <ProgressBar key={goal.id} current={goal.current} target={goal.target} label={goal.title} />
            ))
          ) : (
            <p className="text-[#666666] tracking-widest text-sm">尚無設立目標...</p>
          )}
        </div>
      </section>

      {/* 最近活動 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="zen-title">最近隨筆</h2>
          <div className="space-y-4">
            {recentJournals.length > 0 ? (
              recentJournals.map(j => (
                <div key={j.id} className="zen-border p-4 hover:border-[#666666] transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#e5e5e5]">{j.title} {j.mood}</span>
                    <span className="text-[#666666] text-xs">{j.date}</span>
                  </div>
                  <p className="text-[#888888] text-sm line-clamp-2">{j.content}</p>
                </div>
              ))
            ) : (
              <p className="text-[#666666] tracking-widest text-sm">尚無紀錄...</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="zen-title">最近覺察</h2>
          <div className="space-y-4">
            {recentAwareness.length > 0 ? (
              recentAwareness.map(a => (
                <div key={a.id} className="zen-border p-4 hover:border-[#666666] transition-colors flex justify-between items-center">
                  <div className="flex-1 pr-4">
                    <div className="text-[#e5e5e5] mb-1 flex items-center gap-2">
                      <span>{a.bodyPart}</span>
                      {a.practiceItem && a.practiceItem !== '無' && (
                        <span className="text-sm text-[#888888]">· {a.practiceItem}</span>
                      )}
                    </div>
                    <div className="text-[#666666] text-xs line-clamp-1">{a.record}</div>
                  </div>
                  <div className="text-[#666666] text-xs whitespace-nowrap">{a.date.split(' ')[0]}</div>
                </div>
              ))
            ) : (
              <p className="text-[#666666] tracking-widest text-sm">尚無紀錄...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
