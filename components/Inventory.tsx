
import React, { useState, useEffect } from 'react';
import { Package, Trash2, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Agent, InventoryItem } from '../types';
import { storage } from '../services/storage';
import { INVENTORY_ITEMS, FACTION_NAMES } from '../constants';

const Inventory: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState<number | string>(1);
  const [type, setType] = useState<'HAVE' | 'NEED'>('HAVE');

  useEffect(() => {
    setAgents(storage.getAgents());
    setInventory(storage.getInventory());
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId || !itemName.trim()) return;

    const newItem: InventoryItem = {
      id: crypto.randomUUID(),
      agentId: selectedAgentId,
      itemName: itemName.trim(),
      quantity: Number(quantity) || 1,
      type,
      status: 'PENDING'
    };

    const updated = [newItem, ...inventory];
    setInventory(updated);
    storage.setInventory(updated);
    // Reset item but keep agent for batch adding
    setItemName('');
    setQuantity(1);
  };

  const handleDelete = (id: string) => {
    const updated = inventory.filter(item => item.id !== id);
    setInventory(updated);
    storage.setInventory(updated);
  };

  const getAgentName = (id: string) => agents.find(a => a.id === id)?.name || '未知';
  const getAgentFaction = (id: string) => agents.find(a => a.id === id)?.faction;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-glass p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="text-emerald-400 w-5 h-5" />
              发布物资需求
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">特工</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-emerald-500"
                >
                  <option value="">-- 请选择特工 --</option>
                  {agents.sort((a,b) => a.name.localeCompare(b.name)).map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.faction === 'Enlightened' ? 'ENL' : 'RES'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">物资名称 (可手动输入)</label>
                <input
                  type="text"
                  list="standard-items"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="输入名称或选择常用项"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-emerald-500"
                />
                <datalist id="standard-items">
                  {INVENTORY_ITEMS.map(item => <option key={item} value={item} />)}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">数量</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">意向</label>
                  <div className="flex bg-slate-900 p-1 rounded-lg border border-white/10 h-12">
                    <button
                      type="button"
                      onClick={() => setType('HAVE')}
                      className={`flex-1 text-xs font-bold rounded-md transition-all ${type === 'HAVE' ? 'bg-emerald-600 text-white shadow-inner' : 'text-slate-500'}`}
                    >
                      我有
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('NEED')}
                      className={`flex-1 text-xs font-bold rounded-md transition-all ${type === 'NEED' ? 'bg-red-600 text-white shadow-inner' : 'text-slate-500'}`}
                    >
                      我要
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedAgentId || !itemName}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg font-bold mt-4 shadow-lg transition-transform active:scale-95"
              >
                加入清单
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-glass p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Package className="text-blue-400 w-5 h-5" />
              当前交换清单
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {inventory.map((item) => {
                const faction = getAgentFaction(item.agentId);
                const factionClass = faction === 'Enlightened' ? 'text-emerald-400' : 'text-blue-400';
                
                return (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-white/5 hover:bg-slate-900/60 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${item.type === 'HAVE' ? 'bg-emerald-900/30 text-emerald-500' : 'bg-red-900/30 text-red-500'}`}>
                        {item.type === 'HAVE' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${factionClass}`}>{getAgentName(item.agentId)}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded border ${item.type === 'HAVE' ? 'border-emerald-500/30 text-emerald-500' : 'border-red-500/30 text-red-500'}`}>
                            {item.type === 'HAVE' ? '我有' : '我要'}
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-white">
                          {item.quantity} × <span className="text-slate-200">{item.itemName}</span>
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
              {inventory.length === 0 && (
                <div className="text-center py-20 text-slate-600">
                  <p>暂无物资意向，请在左侧发布。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
