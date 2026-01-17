import { ConfigNode } from './types';

export const INITIAL_DATA: ConfigNode[] = [
  {
    id: 'sys-1',
    parentId: null,
    name: 'Accounting System',
    type: 'SYSTEM',
    description: 'Central processing engine for high-volume ledger transactions and global fiscal reporting.',
    expanded: true,
    children: [
      {
        id: 'sub-1-1',
        parentId: 'sys-1',
        name: 'Accounting Frontend',
        type: 'SUBSYSTEM',
        description: 'Web dashboard for ledger management.',
        gitUrl: 'https://github.com/company/acc-web-client.git',
        ownerName: 'Sarah Jenkins',
        ownerRole: 'Frontend Lead',
        ownerAvatar: 'https://picsum.photos/200?random=1',
        language: 'React / TypeScript'
      },
      {
        id: 'sub-1-2',
        parentId: 'sys-1',
        name: 'Accounting Backend',
        type: 'SUBSYSTEM',
        description: 'Core microservice handling real-time ledger updates.',
        gitUrl: 'https://github.com/company/acc-core-api.git',
        ownerName: 'Marcus Thorne',
        ownerRole: 'Principal Engineer',
        ownerAvatar: 'https://picsum.photos/200?random=2',
        language: 'Go v1.21'
      },
      {
        id: 'sub-1-3',
        parentId: 'sys-1',
        name: 'Accounting Batch',
        type: 'SUBSYSTEM',
        description: 'Nightly settlement processing jobs.',
        gitUrl: 'https://github.com/company/acc-batch-worker.git',
        ownerName: 'David Kim',
        ownerRole: 'Backend Engineer',
        ownerAvatar: 'https://picsum.photos/200?random=3',
        language: 'Java / Spring Batch'
      }
    ]
  },
  {
    id: 'sys-2',
    parentId: null,
    name: 'Global Clearing',
    type: 'SYSTEM',
    description: 'Real-time settlement gateway for cross-border transactions.',
    expanded: false,
    children: [
      {
        id: 'sub-2-1',
        parentId: 'sys-2',
        name: 'Clearing Gateway',
        type: 'SUBSYSTEM',
        description: 'External API gateway for bank integrations.',
        gitUrl: 'https://github.com/company/clearing-gateway.git',
        ownerName: 'Elena Rodriguez',
        ownerRole: 'Tech Lead',
        ownerAvatar: 'https://picsum.photos/200?random=4',
        language: 'Rust'
      }
    ]
  },
  {
    id: 'sys-3',
    parentId: null,
    name: 'Risk Analytics',
    type: 'SYSTEM',
    description: 'Machine learning driven risk assessment and fraud detection platform.',
    expanded: false,
    children: []
  }
];
