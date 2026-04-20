import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar,
  DollarSign,
  Users,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { createEventForOrganization, fetchOrganizations } from "@/services/api";

interface Participant {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface OrganizationOption {
  id: string;
  name: string;
}

const maskPhone = (phone: string) =>
  phone.length < 4 ? phone : phone.slice(0, 2) + "*****" + phone.slice(-3);

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  return domain ? name.slice(0, 2) + "***@" + domain : email;
};

const CreateEvent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    orgId: searchParams.get("org") || "",
    budget: "50",
    eventDate: "",
  });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    phone: "",
    email: "",
    userId: "",
  });
  const [bulkInput, setBulkInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(false);

  useEffect(() => {
    const loadOrgs = async () => {
      setOrgsLoading(true);
      try {
        const data = await fetchOrganizations();
        setOrganizations(
          (data || []).map((o: any) => ({
            id: o.id,
            name: o.name,
          }))
        );
      } catch (err) {
        toast({
          title: "Failed to load organizations",
          description: "Please check your backend connection.",
          variant: "destructive",
        });
      } finally {
        setOrgsLoading(false);
      }
    };

    loadOrgs();
  }, [toast]);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const addParticipant = () => {
      // 🔹 CASE 1: Add by User ID
      if (newParticipant.userId.trim()) {
        const uid = newParticipant.userId.trim();
    
        setParticipants((prev) => [
          ...prev,
          {
            id: `P${Date.now()}`,
            name: `User ${uid}`,
            phone: "",
            email: `${uid.toLowerCase()}@example.com`,
          },
        ]);
    
        setNewParticipant({ name: "", phone: "", email: "", userId: "" });
        setDialogOpen(false);
        toast({ title: "Participant added by User ID 🎉" });
        return;
      }
    
      // 🔹 CASE 2: Manual add
      if (!newParticipant.name.trim()) return;
    
      setParticipants((prev) => [
        ...prev,
        {
          id: `P${Date.now()}`,
          name: newParticipant.name,
          phone: newParticipant.phone,
          email: newParticipant.email,
        },
      ]);
    
      setNewParticipant({ name: "", phone: "", email: "", userId: "" });
      setDialogOpen(false);
      toast({ title: "Participant added! 🎉" });
    };
    

  const addBulkParticipants = () => {
    const lines = bulkInput.split("\n").filter(Boolean);

    const newParticipants = lines.map((line, i) => {
      const parts = line.split(",").map((p) => p.trim());
      return {
        id: `P${Date.now()}-${i}`,
        name: parts[0] || "",
        phone: parts[1] || "",
        email: parts[2] || "",
      };
    });

    setParticipants((prev) => [...prev, ...newParticipants]);
    setBulkInput("");
    setDialogOpen(false);
    toast({ title: `${newParticipants.length} participants added! 🎄` });
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  // ✅ CLEAN & FINAL
  const handleProceed = async () => {
    if (!formData.orgId) {
      toast({
        title: "Organization required",
        description: "Please select an organization before proceeding.",
        variant: "destructive",
      });
      return;
    }
  
    if (participants.length < 3) {
      toast({
        title: "Not enough participants",
        description: "You need at least 3 participants for Secret Santa.",
        variant: "destructive",
      });
      return;
    }
  
    setLoading(true);
    try {
      const created = await createEventForOrganization(formData.orgId, {
        name: formData.name,
        date: formData.eventDate,
        participants: participants.length,
      });
  
      setLoading(false);
  
      if (!created) {
        toast({
          title: "Error",
          description: "Event could not be saved!",
          variant: "destructive",
        });
        return;
      }
  
      toast({
        title: "Event created! 🎉",
        description: "Proceeding to Secret Santa draw...",
      });
  
      // ✅ IMPORTANT FIX HERE
      navigate("/events/draw", {
        state: {
          eventId: created.id,               // 🔥 REQUIRED
          participants,
          participantNames: participants.map((p) => p.name),
        },
      });
  
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Event could not be saved!",
        variant: "destructive",
      });
    }
  };
  
  

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl">
              <Calendar className="h-8 w-8" />
              Create Secret Santa Event
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Event Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Event Name"
                value={formData.name}
                onChange={handleChange("name")}
              />

              <div className="space-y-2">
                <Label>Organization</Label>
                <Select
                  value={formData.orgId}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, orgId: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        orgsLoading
                          ? "Loading organizations..."
                          : organizations.length === 0
                            ? "No organizations found"
                            : "Select organization"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.length === 0 && !orgsLoading ? (
                      <SelectItem value="none" disabled>
                        No organizations available
                      </SelectItem>
                    ) : (
                      organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <FormInput
                label="Budget ($)"
                type="number"
                value={formData.budget}
                onChange={handleChange("budget")}
                icon={<DollarSign className="h-4 w-4" />}
              />

              <FormInput
                label="Event Date"
                type="date"
                value={formData.eventDate}
                onChange={handleChange("eventDate")}
              />
            </div>

            {/* 🔁 ADD PARTICIPANTS — UNCHANGED */}
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
                          onChange={(e) =>
                            setNewParticipant((p) => ({
                              ...p,
                              userId: e.target.value,
                            }))
                          }
                        />
                        <Button onClick={addParticipant} className="w-full">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add by User ID
                        </Button>
                      </TabsContent>

                      <TabsContent value="manual" className="space-y-4 mt-4">
                        <FormInput
                          label="Name"
                          value={newParticipant.name}
                          onChange={(e) =>
                            setNewParticipant((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                        />
                        <FormInput
                          label="Phone"
                          value={newParticipant.phone}
                          onChange={(e) =>
                            setNewParticipant((p) => ({
                              ...p,
                              phone: e.target.value,
                            }))
                          }
                        />
                        <FormInput
                          label="Email"
                          value={newParticipant.email}
                          onChange={(e) =>
                            setNewParticipant((p) => ({
                              ...p,
                              email: e.target.value,
                            }))
                          }
                        />
                        <Button onClick={addParticipant} className="w-full">
                          Add Participant
                        </Button>
                      </TabsContent>

                      <TabsContent value="bulk" className="space-y-4 mt-4">
                        <Label>Bulk Add (Name, Phone, Email)</Label>
                        <Textarea
                          value={bulkInput}
                          onChange={(e) => setBulkInput(e.target.value)}
                          rows={6}
                        />
                        <Button onClick={addBulkParticipants} className="w-full">
                          Add All Participants
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>

              {participants.length === 0 ? (
                <p className="text-muted-foreground text-center">
                  No participants added yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{maskPhone(p.phone)}</TableCell>
                        <TableCell>{maskEmail(p.email)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeParticipant(p.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <Button
              onClick={handleProceed}
              disabled={loading}
              className="w-full bg-secondary"
            >
              {loading ? "Saving..." : "Proceed to Draw 🎄"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateEvent;
