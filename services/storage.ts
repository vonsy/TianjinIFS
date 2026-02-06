
import { Agent, InventoryItem, Prize, Exchange } from '../types';

const KEYS = {
  AGENTS: 'tjinfs_agents',
  INVENTORY: 'tjinfs_inventory',
  PRIZES: 'tjinfs_prizes',
  EXCHANGES: 'tjinfs_exchanges',
  AUTH: 'tjinfs_auth_state'
};

export const storage = {
  getAgents: (): Agent[] => JSON.parse(localStorage.getItem(KEYS.AGENTS) || '[]'),
  setAgents: (agents: Agent[]) => localStorage.setItem(KEYS.AGENTS, JSON.stringify(agents)),
  
  getInventory: (): InventoryItem[] => JSON.parse(localStorage.getItem(KEYS.INVENTORY) || '[]'),
  setInventory: (items: InventoryItem[]) => localStorage.setItem(KEYS.INVENTORY, JSON.stringify(items)),
  
  getPrizes: (): Prize[] => JSON.parse(localStorage.getItem(KEYS.PRIZES) || '[]'),
  setPrizes: (prizes: Prize[]) => localStorage.setItem(KEYS.PRIZES, JSON.stringify(prizes)),

  getExchanges: (): Exchange[] => JSON.parse(localStorage.getItem(KEYS.EXCHANGES) || '[]'),
  setExchanges: (exchanges: Exchange[]) => localStorage.setItem(KEYS.EXCHANGES, JSON.stringify(exchanges)),

  clearAll: () => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    window.location.reload();
  }
};
