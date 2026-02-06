
import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Search } from 'lucide-react';
import { Agent, Faction } from '../types';
import { storage } from '../services/storage';
import { FACTION_NAMES, FACTION_LOGOS } from '../constants';

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [name, setName] = useState('');
  const [faction, setFaction] = useState<Faction>(Faction.ENLIGHTENED);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setAgents(storage.getAgents());
  }, []);

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAgent: Agent = {
      id: crypto.randomUUID(),
      name: name.trim(),
      faction,
      createdAt: Date.now()
    };

    const updated = [...agents, newAgent];
    setAgents(updated);
    storage.setAgents(updated);
    setName('');
  };

  const handleDelete = (id: string) => {
    const updated = agents.filter(a => a.id !== id);
    setAgents(updated);
    storage.setAgents(updated);
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enlAgents = filteredAgents.filter(a => a.faction === Faction.ENLIGHTENED);
  const resAgents = filteredAgents.filter(a => a.faction === Faction.RESISTANCE);

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5 group hover:border-white/20 transition-all">
      <div className="flex items-center gap-3">
        <img 
          src={FACTION_LOGOS[agent.faction]} 
          alt={agent.faction} 
          className="w-6 h-6 object-contain"
        />
        <span className={`font-bold ${agent.faction === Faction.ENLIGHTENED ? 'text-emerald-400' : 'text-blue-400'}`}>
          {agent.name}
        </span>
      </div>
      <button 
        onClick={() => handleDelete(agent.id)}
        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-900/30 text-red-400 rounded-lg transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="w-full lg:w-1/4">
          <div className="bg-glass p-6 rounded-2xl border border-white/10 sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserPlus className="text-emerald-400 w-5 h-5" />
              登记特工
            </h2>
            <form onSubmit={handleAddAgent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Agent Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                  placeholder="例如: Agent007"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">阵营</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setFaction(Faction.ENLIGHTENED)}
                    className={`flex items-center gap-3 p-3 rounded-lg border font-bold text-sm transition-all ${
                      faction === Faction.ENLIGHTENED 
                      ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : 'bg-slate-900 border-white/5 text-slate-400'
                    }`}
                  >
                    <img src={FACTION_LOGOS.Enlightened} className="w-5 h-5 object-contain" alt="" />
                    {FACTION_NAMES.Enlightened}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFaction(Faction.RESISTANCE)}
                    className={`flex items-center gap-3 p-3 rounded-lg border font-bold text-sm transition-all ${
                      faction === Faction.RESISTANCE 
                      ? 'bg-blue-900/40 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                      : 'bg-slate-900 border-white/5 text-slate-400'
                    }`}
                  >
                    <img src={FACTION_LOGOS.Resistance} className="w-5 h-5 object-contain" alt="" />
                    {FACTION_NAMES.Resistance}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-900/20"
              >
                登记入场
              </button>
            </form>
          </div>
        </div>

        {/* Grouped Lists */}
        <div className="w-full lg:w-3/4 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold">现场特工名录</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="搜索特工..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Enlightened Group */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                <div className="flex items-center gap-2">
                  <img src={FACTION_LOGOS.Enlightened} className="w-8 h-8 object-contain" alt="" />
                  <h3 className="text-lg font-bold text-emerald-400">{FACTION_NAMES.Enlightened}</h3>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                  {enlAgents.length} 人
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {enlAgents.map(a => <AgentCard key={a.id} agent={a} />)}
                {enlAgents.length === 0 && <p className="text-center py-8 text-slate-600 italic">暂无启蒙军特工</p>}
              </div>
            </div>

            {/* Resistance Group */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-blue-500/30 pb-2">
                <div className="flex items-center gap-2">
                  <img src={FACTION_LOGOS.Resistance} className="w-8 h-8 object-contain" alt="" />
                  <h3 className="text-lg font-bold text-blue-400">{FACTION_NAMES.Resistance}</h3>
                </div>
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                  {resAgents.length} 人
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {resAgents.map(a => <AgentCard key={a.id} agent={a} />)}
                {resAgents.length === 0 && <p className="text-center py-8 text-slate-600 italic">暂无抵抗军特工</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;
