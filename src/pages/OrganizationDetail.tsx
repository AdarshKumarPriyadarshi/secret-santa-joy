import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Building2, Users, Calendar, Settings, Plus, Copy, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormInput } from "@/components/ui/form-input";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import {fetchOrganizationById,fetchMembers,addMember,fetchEventsByOrganization,} from "@/services/api";



const OrganizationDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const [org, setOrg] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]); // ✅ FIXED
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMemberId, setNewMemberId] = useState("");

  // Load organization data
  useEffect(() => {
    async function loadOrg() {
      const orgData = await fetchOrganizationById(id!);
  
      if (!orgData) {
        setLoading(false);
        return;
      }
  
      setOrg(orgData);
      setLoading(false);
    }
  
    loadOrg();
  }, [id]);

  // Load organization's events
  useEffect(() => {
    async function loadEvents() {
      if (!id) return;
      const data = await fetchEventsByOrganization(id);
      setEvents(data ?? []);
    }
    loadEvents();
  }, [id]);

  useEffect(() => {
    async function loadMembers() {
      const data = await fetchMembers(id!);
      setMembers(data ?? []);
    }
    loadMembers();
  }, [id]);
  



  // Add a member
  const handleAddMember = async () => {
    if (!newMemberId.trim()) return;

    const newMember = {
      id: newMemberId,
      name: `User ${newMemberId}`,
      email: `${newMemberId}@example.com`,
    };

    const updatedMembers = await addMember(id!, newMember);

    if (updatedMembers) {
      setMembers(updatedMembers);
      toast({
        title: "Member Added! 🎉",
        description: `User ${newMemberId} has been added.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Could not add member.",
        variant: "destructive",
      });
    }

    setNewMemberId("");
  };

  const copyUniqueId = (userId: string) => {
    navigator.clipboard.writeText(userId);
    toast({ title: "Copied!", description: "User ID copied to clipboard" });
  };

  if (loading || !org) {
    return (
      <AppLayout>
        <div className="text-center mt-10 text-lg">Loading organization...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
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
              <Plus className="h-5 w-5" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{members.length}</p>
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
                      <p className="text-2xl font-bold">{events.length}</p>
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

          {/* Members */}
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

                      <Button className="w-full" onClick={handleAddMember}>
                        Add Member
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent>
                {members.length === 0 ? (
                  <p className="text-muted-foreground">No members added yet.</p>
                ) : (
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
                      {members.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell className="font-mono text-sm">{m.id}</TableCell>
                          <TableCell className="text-muted-foreground">{m.email}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => copyUniqueId(m.id)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
              </CardHeader>

              <CardContent>
                {!events || events.length === 0 ? (
                  <p className="text-muted-foreground">No events created yet.</p>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{event.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.date} • {event.participants} participants
                          </p>
                        </div>

                        <span className="px-3 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          {/* Settings */}
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

                <Button variant="outline">Edit Settings (Coming Soon)</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default OrganizationDetail;
