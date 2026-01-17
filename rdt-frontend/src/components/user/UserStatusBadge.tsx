import { UserStatus } from '@/types/user';
import { cn } from '@/utils/ui';

interface UserStatusBadgeProps {
  status: UserStatus;
}

export const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return {
          label: 'Active',
          containerClass: 'bg-green-500/10 text-green-500 border-green-500/20',
          dotClass: 'bg-green-500',
        };
      case UserStatus.LOCKED:
        return {
          label: 'Locked',
          containerClass: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
          dotClass: 'bg-orange-500',
        };
      case UserStatus.DISABLED:
      default:
        return {
          label: 'Disabled',
          containerClass: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
          dotClass: 'bg-slate-500',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold uppercase',
        config.containerClass
      )}
    >
      <span className={cn('size-1.5 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  );
};
