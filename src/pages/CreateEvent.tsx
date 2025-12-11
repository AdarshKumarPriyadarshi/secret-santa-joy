import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, DollarSign, Users, Plus, Trash2, Snowflake, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  name: string;
  phone: string;
  email: string;
}

const maskPhone = (phone: string) => {
  if (phone.length < 4) return phone;
  return phone.slice(0, 2) + '*****' + phone.slice(-3);
};

const maskEmail = (email: string) => {
  const [name, domain] = email.split('@');
  if (!domain) return email;
  return name.slice(0, 2) + '***@' + domain;
};

const CreateEvent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    orgId: searchParams.get('org') || '',
    budget: '50',
    eventDate: '',
  });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: '', phone: '', email: '', userId: '' });
  const [bulkInput, setBulkInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const addParticipant = () => {
    if (!newParticipant.name) return;
    setParticipants(prev => [
      ...prev,
      { ...newParticipant, id: `P${Date.now()}` }
    ]);
    setNewParticipant({ name: '', phone: '', email: '', userId: '' });
    setDialogOpen(false);
    toast({ title: "Participant added! 🎉" });
  };

  const addBulkParticipants = () => {
    const lines = bulkInput.split('\n').filter(l => l.trim());
    const newParticipants = lines.map((line, i) => {
      const parts = line.split(',').map(p => p.trim());
      return {
        id: `P${Date.now()}-${i}`,
        name: parts[0] || '',
        phone: parts[1] || '',
        email: parts[2] || '',
      };
    });
    setParticipants(prev => [...prev, ...newParticipants]);
    setBulkInput('');
    setDialogOpen(false);
    toast({ title: `${newParticipants.length} participants added! 🎄` });
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveDraft = () => {
    toast({ title: "Draft saved!", description: "You can continue editing later." });
  };

  const handleProceed = () => {
    if (participants.length < 3) {
      toast({ 
        title: "Not enough participants", 
        description: "You need at least 3 participants for Secret Santa.",
        variant: "destructive"
      });
      return;
    }
    navigate(`/events/draw`, { state: { formData, participants } });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-display text-primary flex items-center gap-3">
              <Calendar className="h-8 w-8" />
              Create Secret Santa Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Event Name"
                placeholder="Christmas Party 2024"
                value={formData.name}
                onChange={handleChange('name')}
              />
              <div className="space-y-2">
                <Label>Organization</Label>
                <Select value={formData.orgId} onValueChange={(v) => setFormData(prev => ({ ...prev, orgId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tech Corp</SelectItem>
                    <SelectItem value="2">Design Team</SelectItem>
                    <SelectItem value="3">Family Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormInput
                label="Budget ($)"
                type="number"
                placeholder="50"
                value={formData.budget}
                onChange={handleChange('budget')}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <FormInput
                label="Event Date"
                type="date"
                value={formData.eventDate}
                onChange={handleChange('eventDate')}
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Participants ({participants.length})
                </h3>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Participants
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Participants</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="manual" className="mt-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="userid">By User ID</TabsTrigger>
                        <TabsTrigger value="manual">Manual</TabsTrigger>
                        <TabsTrigger value="bulk">Bulk Add</TabsTrigger>
                      </TabsList>
                      <TabsContent value="userid" className="space-y-4 mt-4">
                        <FormInput
                          label="User ID"
                          placeholder="USR-XXXXXX"
                          value={newParticipant.userId}
                          onChange={(e) => setNewParticipant(prev => ({ ...prev, userId: e.target.value }))}
                        />
                        <Button onClick={addParticipant} className="w-full">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add by User ID
                        </Button>
                      </TabsContent>
                      <TabsContent value="manual" className="space-y-4 mt-4">
                        <FormInput
                          label="Name"
                          placeholder="Santa Claus"
                          value={newParticipant.name}
                          onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <FormInput
                          label="Phone"
                          placeholder="+1234567890"
                          value={newParticipant.phone}
                          onChange={(e) => setNewParticipant(prev => ({ ...prev, phone: e.target.value }))}
                        />
                        <FormInput
                          label="Email"
                          placeholder="santa@northpole.com"
                          value={newParticipant.email}
                          onChange={(e) => setNewParticipant(prev => ({ ...prev, email: e.target.value }))}
                        />
                        <Button onClick={addParticipant} className="w-full">Add Participant</Button>
                      </TabsContent>
                      <TabsContent value="bulk" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Bulk Add (Name, Phone, Email per line)</Label>
                          <Textarea
                            placeholder="John Doe, +1234567890, john@example.com&#10;Jane Smith, +0987654321, jane@example.com"
                            value={bulkInput}
                            onChange={(e) => setBulkInput(e.target.value)}
                            rows={6}
                          />
                        </div>
                        <Button onClick={addBulkParticipants} className="w-full">Add All Participants</Button>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>

              {participants.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell className="text-muted-foreground font-mono text-sm">
                            {maskPhone(p.phone)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {maskEmail(p.email)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeParticipant(p.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No participants added yet</p>
                  <p className="text-sm">Click "Add Participants" to get started</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
                Save as Draft
              </Button>
              <Button onClick={handleProceed} className="flex-1 bg-secondary hover:bg-secondary/90">
                Proceed to Draw 🎄
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateEvent;
