export interface BusinessRequirement {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'Draft' | 'Review' | 'Approved';
  priority: 'P0' | 'P1' | 'P2';
  owner: string;
  riceScore?: number;
}

export interface SystemRequirement {
  id: string;
  code: string;
  brId: string;
  title: string;
  atomicSystem: string;
  uiChange: boolean;
}

export interface Task {
  id: string;
  srId: string;
  title: string;
  type: 'Development' | 'QA' | 'Design';
  assignee: string;
  estimate: number; // hours
  status: 'Todo' | 'In Progress' | 'Done';
}

export interface TableNode {
  id: string;
  name: string;
  x: number;
  y: number;
  columns: { name: string; type: string; isPk?: boolean; isFk?: boolean }[];
}

export interface RelationLink {
  source: string;
  target: string;
  label?: string;
}

export enum ViewMode {
  EDITOR = 'EDITOR',
  DECOMPOSITION = 'DECOMPOSITION',
  DESIGN = 'DESIGN'
}