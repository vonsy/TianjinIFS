
import React, { useState, useEffect } from 'react';
import { Gift, Plus, Trophy, Trash2, Play, RefreshCw, Star, Sparkles } from 'lucide-react';
import { storage } from '../services/storage';
import { Agent, Prize } from '../types';
import { FACTION_NAMES, FACTION_LOGOS } from '../constants';

const LuckyDraw: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  
  const [newPrizeName, setNewPrizeName] = useState('');
  const [newDonorName, setNewDonorName] = useState('');
  const [newPrizeQty, setNewPrizeQty] = useState<number | string>(1);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    setAgents(storage.getAgents());
    setPrizes(storage.getPrizes());
  }, []);

  const handleAddPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrizeName.trim()) return;

    const newPrize: Prize = {
      id: crypto.randomUUID(),
      name: newPrizeName.trim(),
      donorName: newDonorName.trim() || '活动组织方',
      quantity: Number(newPrizeQty) || 1,
      winners: []
    };

    const updated = [...prizes, newPrize];
    setPrizes(updated);
    storage.setPrizes(updated);
    setNewPrizeName('');
    setNewDonorName('');
    setNewPrizeQty(1);
  };

  const handleDrawAll = async () => {
    if (agents.length === 0 || prizes.length === 0) return;
    setIsDrawing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const updatedPrizes = prizes.map(prize => {
      if (prize.winners.length > 0) return prize;
      const pool = [...agents].sort(() => Math.random() - 0.5);
      const winners = pool.slice(0, Math.min(prize.quantity, pool.length)).map(a => a.id);
      return { ...prize, winners };
    });

    setPrizes(updatedPrizes);
    storage.setPrizes(updatedPrizes);
    setIsDrawing(false);
  };

  const handleDrawSingle = async (prizeId: string) => {
    const prize = prizes.find(p => p.id === prizeId);
    if (!prize || agents.length === 0) return;

    setIsDrawing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const pool = [...agents].sort(() => Math.random() - 0.5);
    const winners = pool.slice(0, Math.min(prize.quantity, pool.length)).map(a => a.id);

    const updated = prizes.map(p => 
      p.id === prizeId ? { ...p, winners } : p
    );

    setPrizes(updated);
    storage.setPrizes(updated);
    setIsDrawing(false);
  };

  const handleDeletePrize = (id: string) => {
    const updated = prizes.filter(p => p.id !== id);
    setPrizes(updated);
    storage.setPrizes(updated);
  };

  const resetWinners = (prizeId: string) => {
    const updated = prizes.map(p => 
      p.id === prizeId ? { ...p, winners: [] } : p
    );
    setPrizes(updated);
    storage.setPrizes(updated);
  };

  const getAgentName = (id: string) => agents.find(a => a.id === id)?.name || '未知';
  const getAgentFaction = (id: string) => agents.find(a => a.id === id)?.faction;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Draw All Header */}
      {prizes.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-yellow-400" />
              抽奖中心
            </h2>
            <p className="text-slate-400 text-sm mt-1">当前共有 {agents.length} 位特工参与，可点击按钮一键抽取所有奖项。</p>
          </div>
          <button
            onClick={handleDrawAll}
            disabled={isDrawing || agents.length === 0}
            className="w-full md:w-auto px-10 py-4 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-black rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            <Play className="w-6 h-6 fill-current" />
            全量开奖
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prize Form */}
        <div className="lg:col-span-1">
          <div className="bg-glass p-6 rounded-2xl border border-white/10 sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="text-purple-400 w-5 h-5" />
              添加新奖品
            </h2>
            <form onSubmit={handleAddPrize} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">奖品名称</label>
                <input
                  type="text"
                  value={newPrizeName}
                  onChange={(e) => setNewPrizeName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500"
                  placeholder="例如: NL-1331 徽章"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">捐赠者 (Agent Name)</label>
                <input
                  type="text"
                  value={newDonorName}
                  onChange={(e) => setNewDonorName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500"
                  placeholder="留空默认为组织方"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">数量</label>
                <input
                  type="number"
                  min="1"
                  value={newPrizeQty}
                  onChange={(e) => setNewPrizeQty(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold shadow-lg transition-all"
              >
                录入奖项
              </button>
            </form>
          </div>
        </div>

        {/* Prize Display Area */}
        <div className="lg:col-span-2 space-y-4">
          {prizes.map((prize) => (
            <div 
              key={prize.id}
              className={`bg-glass rounded-2xl border transition-all duration-500 ${
                prize.winners.length > 0 ? 'border-emerald-500/30' : 'border-white/10'
              }`}
            >
              <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 bg-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{prize.name}</h3>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase tracking-wider">
                      数量: {prize.quantity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 italic">由 <span className="text-purple-400 not-italic font-bold">{prize.donorName}</span> 提供</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDeletePrize(prize.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {prize.winners.length > 0 ? (
                    <button 
                      onClick={() => resetWinners(prize.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-xs transition-all"
                    >
                      <RefreshCw className="w-4 h-4" /> 重新开奖
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleDrawSingle(prize.id)}
                      disabled={isDrawing || agents.length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-bold text-xs transition-all shadow-lg"
                    >
                      <Play className="w-4 h-4 fill-current" /> 单项开奖
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {isDrawing ? (
                  <div className="flex flex-col items-center py-8">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-emerald-500 font-bold text-sm animate-pulse">正在匹配幸运特工...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {prize.winners.length > 0 ? (
                      prize.winners.map((wid, idx) => {
                        const faction = getAgentFaction(wid);
                        return (
                          <div key={wid} className={`flex items-center gap-3 p-3 bg-slate-900/60 border rounded-xl animate-in zoom-in duration-300 delay-${idx*100} ${faction === 'Enlightened' ? 'border-emerald-500/20' : 'border-blue-500/20'}`}>
                            <img src={FACTION_LOGOS[faction || 'Enlightened']} className="w-6 h-6 object-contain" alt="" />
                            <div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">中奖特工 #{idx + 1}</p>
                              <p className={`font-bold ${faction === 'Enlightened' ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {getAgentName(wid)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full py-10 text-center text-slate-700 border border-dashed border-white/5 rounded-xl">
                        <Star className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">点击“开奖”揭晓结果</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {prizes.length === 0 && (
            <div className="py-32 text-center bg-slate-900/20 rounded-3xl border-2 border-dashed border-white/5">
              <Gift className="w-16 h-16 mx-auto mb-4 text-slate-800" />
              <h2 className="text-xl font-bold text-slate-600">目前没有任何奖品项</h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">请先在左侧配置奖品信息。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
