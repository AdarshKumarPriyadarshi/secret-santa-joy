import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Users, Calendar, Settings, Plus, Copy, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormInput } from '@/components/ui/form-input';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';

const mockOrg = {
  id: '1',
  name: 'Tech Corp',
  photo: '',
  budget: 50,
  description: 'Annual company Secret Santa event',
  members: [
    { id: 'USR-001', name: 'John Doe', email: 'john@example.com' },
    { id: 'USR-002', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 'USR-003', name: 'Bob Wilson', email: 'bob@example.com' },
  ],
  events: [
    { id: '1', name: 'Christmas 2024', date: '2024-12-25', participants: 15, status: 'active' },
    { id: '2', name: 'Holiday Party 2023', date: '2023-12-20', participants: 12, status: 'completed' },
  ],
};

const OrganizationDetail = () => {
  const { id } = useParams();
  const [org] = useState(mockOrg);
  const [newMemberId, setNewMemberId] = useState('');
  const { toast } = useToast();

  const handleAddMember = () => {
    if (!newMemberId) return;
    toast({
      title: "Member Added! 🎉",
      description: `User ${newMemberId} has been added to the organization.`,
    });
    setNewMemberId('');
  };

  const copyUniqueId = (userId: string) => {
    navigator.clipboard.writeText(userId);
    toast({ title: "Copied!", description: "User ID copied to clipboard" });
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary font-display">{org.name}</h1>
              <p className="text-muted-foreground">{org.description}</p>
            </div>
          </div>
          <Link to={`/events/create?org=${id}`}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{org.members.length}</p>
                      <p className="text-sm text-muted-foreground">Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <Calendar className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{org.events.length}</p>
                      <p className="text-sm text-muted-foreground">Events</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${org.budget}</p>
                      <p className="text-sm text-muted-foreground">Budget</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Members</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Member by User ID</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <FormInput
                        label="User ID"
                        placeholder="USR-XXXXXX"
                        value={newMemberId}
                        onChange={(e) => setNewMemberId(e.target.value)}
                      />
                      <Button onClick={handleAddMember} className="w-full">
                        Add Member
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {org.members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell className="font-mono text-sm">{member.id}</TableCell>
                        <TableCell className="text-muted-foreground">{member.email}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => copyUniqueId(member.id)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {org.events.map((event) => (
                    <Link key={event.id} to={`/events/${event.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{event.name}</p>
                            <p className="text-sm text-muted-foreground">{event.date} • {event.participants} participants</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'active' 
                            ? 'bg-secondary/10 text-secondary' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Organization Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput label="Organization Name" value={org.name} readOnly />
                <FormInput label="Default Budget ($)" value={String(org.budget)} readOnly />
                <Button variant="outline">Edit Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default OrganizationDetail;
