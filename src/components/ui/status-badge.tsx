import { cn } from "@/lib/utils";

type BadgeStatus = 'sent' | 'pending' | 'failed';

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

const statusStyles: Record<BadgeStatus, string> = {
  sent: 'bg-secondary/10 text-secondary border-secondary/20',
  pending: 'bg-accent/10 text-accent-foreground border-accent/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusLabels: Record<BadgeStatus, string> = {
  sent: 'Sent',
  pending: 'Pending',
  failed: 'Failed',
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        status === 'sent' && 'bg-secondary',
        status === 'pending' && 'bg-accent',
        status === 'failed' && 'bg-destructive'
      )} />
      {statusLabels[status]}
    </span>
  );
};
