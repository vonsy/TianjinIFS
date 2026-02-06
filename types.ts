
export enum Faction {
  ENLIGHTENED = 'Enlightened',
  RESISTANCE = 'Resistance'
}

export interface Agent {
  id: string;
  name: string;
  faction: Faction;
  createdAt: number;
}

export interface InventoryItem {
  id: string;
  agentId: string;
  itemName: string;
  quantity: number;
  type: 'HAVE' | 'NEED';
  status: 'PENDING' | 'COMPLETED';
}

export interface Prize {
  id: string;
  name: string;
  quantity: number;
  donorName: string; // Added field
  winners: string[]; // Agent IDs
}

export interface Exchange {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  itemName: string;
  status: 'PENDING' | 'COMPLETED';
}
