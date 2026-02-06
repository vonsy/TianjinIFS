
import React, { useState, useEffect } from 'react';
import { Repeat, ArrowRightLeft, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { storage } from '../services/storage';
import { Agent, InventoryItem, Exchange } from '../types';
import { FACTION_NAMES, FACTION_LOGOS } from '../constants';

const ExchangeBoard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    setAgents(storage.getAgents());
    setInventory(storage.getInventory());
    setExchanges(storage.getExchanges());
  }, []);

  useEffect(() => {
    const findMatches = () => {
      const haves = inventory.filter(i => i.type === 'HAVE');
      const needs = inventory.filter(i => i.type === 'NEED');
      const found: any[] = [];

      haves.forEach(h => {
        needs.forEach(n => {
          if (h.itemName === n.itemName && h.agentId !== n.agentId) {
            const existing = exchanges.find(e => 
              (e.fromAgentId === h.agentId && e.toAgentId === n.agentId && e.itemName === h.itemName)
            );

            found.push({
              id: `${h.id}-${n.id}`,
              fromAgent: agents.find(a => a.id === h.agentId),
              toAgent: agents.find(a => a.id === n.agentId),
              itemName: h.itemName,
              fromQty: h.quantity,
              toQty: n.quantity,
              status: existing ? existing.status : 'PENDING'
            });
          }
        });
      });
      setMatches(found);
    };

    if (agents.length && inventory.length) {
      findMatches();
    }
  }, [agents, inventory, exchanges]);

  const toggleStatus = (match: any) => {
    const isCompleted = match.status === 'COMPLETED';
    const newStatus = isCompleted ? 'PENDING' : 'COMPLETED';

    let updatedExchanges = [...exchanges];
    const existingIndex = updatedExchanges.findIndex(e => 
      e.fromAgentId === match.fromAgent.id && 
      e.toAgentId === match.toAgent.id && 
      e.itemName === match.itemName
    );

    if (existingIndex > -1) {
      updatedExchanges[existingIndex].status = newStatus;
    } else {
      updatedExchanges.push({
        id: crypto.randomUUID(),
        fromAgentId: match.fromAgent.id,
        toAgentId: match.toAgent.id,
        itemName: match.itemName,
        status: newStatus
      });
    }

    setExchanges(updatedExchanges);
    storage.setExchanges(updatedExchanges);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-glass p-8 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Repeat className="text-emerald-400 w-8 h-8" />
              智能匹配
            </h1>
            <p className="text-slate-400 mt-2">系统已为您找到以下可能的物资交换方案。</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <RefreshCcw className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="space-y-6">
          {matches.map((match) => {
            const isCompleted = match.status === 'COMPLETED';
            return (
              <div 
                key={match.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isCompleted 
                  ? 'bg-emerald-900/10 border-emerald-500/30' 
                  : 'bg-slate-900/50 border-white/10 hover:border-blue-500/50'
                }`}
              >
                <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  {/* From Agent */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                      <img src={FACTION_LOGOS[match.fromAgent.faction]} className="w-4 h-4 object-contain" alt="" />
                      <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">供方 (我有)</p>
                    </div>
                    <h3 className={`text-xl font-bold ${match.fromAgent.faction === 'Enlightened' ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {match.fromAgent.name}
                    </h3>
                    <p className="text-sm text-slate-400">{match.fromQty} × {match.itemName}</p>
                  </div>

                  {/* Visual Connector */}
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-full border-2 transition-all ${
                      isCompleted ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-white/10 text-slate-500'
                    }`}>
                      <ArrowRightLeft className="w-6 h-6" />
                    </div>
                    <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isCompleted ? '交换完成' : '待交换'}
                    </div>
                  </div>

                  {/* To Agent */}
                  <div className="flex-1 text-center md:text-right">
                    <div className="flex items-center gap-2 justify-center md:justify-end mb-1">
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">需方 (我要)</p>
                      <img src={FACTION_LOGOS[match.toAgent.faction]} className="w-4 h-4 object-contain" alt="" />
                    </div>
                    <h3 className={`text-xl font-bold ${match.toAgent.faction === 'Enlightened' ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {match.toAgent.name}
                    </h3>
                    <p className="text-sm text-slate-400">{match.toQty} × {match.itemName}</p>
                  </div>

                  {/* Action */}
                  <div className="md:ml-4">
                    <button 
                      onClick={() => toggleStatus(match)}
                      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                        isCompleted 
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {isCompleted ? (
                        <><AlertCircle className="w-4 h-4" /> 撤销</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /> 确认完成</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Decorative background visual */}
                <div className={`absolute inset-0 opacity-10 transition-opacity ${isCompleted ? 'bg-emerald-500' : 'bg-transparent'}`} />
              </div>
            );
          })}

          {matches.length === 0 && (
            <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <RefreshCcw className="w-16 h-16 mx-auto mb-6 text-slate-800 animate-spin-slow" />
              <h2 className="text-2xl font-bold text-slate-600">正在扫描匹配项...</h2>
              <p className="text-slate-500 max-w-sm mx-auto mt-2">请在“物资清单”中添加更多条目，系统将自动发现特工间的交换需求。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeBoard;
