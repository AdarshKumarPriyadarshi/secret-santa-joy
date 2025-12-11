import { useState } from 'react';
import { RefreshCw, Bell, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';

type NotificationStatus = 'sent' | 'pending' | 'failed';

interface Notification {
  id: string;
  participantName: string;
  method: 'email' | 'sms';
  status: NotificationStatus;
  sentAt?: string;
}

const mockNotifications: Notification[] = [
  { id: '1', participantName: 'John Doe', method: 'email', status: 'sent', sentAt: '2024-12-01 10:30' },
  { id: '2', participantName: 'John Doe', method: 'sms', status: 'sent', sentAt: '2024-12-01 10:31' },
  { id: '3', participantName: 'Jane Smith', method: 'email', status: 'sent', sentAt: '2024-12-01 10:30' },
  { id: '4', participantName: 'Jane Smith', method: 'sms', status: 'pending' },
  { id: '5', participantName: 'Bob Wilson', method: 'email', status: 'failed' },
  { id: '6', participantName: 'Bob Wilson', method: 'sms', status: 'failed' },
  { id: '7', participantName: 'Alice Brown', method: 'email', status: 'sent', sentAt: '2024-12-01 10:32' },
  { id: '8', participantName: 'Charlie Davis', method: 'email', status: 'pending' },
];

const NotificationsStatus = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const { toast } = useToast();

  const handleRetry = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, status: 'pending' as NotificationStatus } : n
      )
    );
    
    setTimeout(() => {
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, status: 'sent' as NotificationStatus, sentAt: new Date().toLocaleString() } : n
        )
      );
      toast({ title: "Notification sent!", description: "Retry successful." });
    }, 1500);
  };

  const sentCount = notifications.filter(n => n.status === 'sent').length;
  const pendingCount = notifications.filter(n => n.status === 'pending').length;
  const failedCount = notifications.filter(n => n.status === 'failed').length;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary font-display flex items-center gap-3">
              <Bell className="h-8 w-8" />
              Notification Status
            </h1>
            <p className="text-muted-foreground mt-1">Track delivery status for all participants</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">{sentCount}</p>
                <p className="text-sm text-muted-foreground">Sent</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{failedCount}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">{notification.participantName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {notification.method === 'email' ? (
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Phone className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="capitalize">{notification.method}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={notification.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {notification.sentAt || '-'}
                      </TableCell>
                      <TableCell>
                        {notification.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRetry(notification.id)}
                            className="gap-1"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Retry
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default NotificationsStatus;
