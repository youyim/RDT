export type NodeType = 'SYSTEM' | 'SUBSYSTEM';

export interface ConfigNode {
  id: string;
  parentId: string | null;
  name: string;
  type: NodeType;
  description?: string;
  expanded?: boolean;
  
  // Subsystem specific fields
  gitUrl?: string;
  ownerName?: string;
  ownerRole?: string;
  ownerAvatar?: string;
  language?: string;
  
  // Recursive children
  children?: ConfigNode[];
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}
