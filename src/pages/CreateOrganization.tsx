import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Building2, DollarSign, FileText, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';

const CreateOrganization = () => {
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    budget: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({ title: "Error", description: "Organization name is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Organization Created! 🎄",
        description: `${formData.name} is ready for Secret Santa!`,
      });
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-display text-primary flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              Create Organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Organization Name"
                placeholder="e.g., Tech Corp Christmas Party"
                value={formData.name}
                onChange={handleChange('name')}
                icon={<Building2 className="h-4 w-4" />}
              />

              <div className="space-y-2">
                <Label>Organization Photo</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>

              <FormInput
                label="Default Budget ($)"
                type="number"
                placeholder="50"
                value={formData.budget}
                onChange={handleChange('budget')}
                icon={<DollarSign className="h-4 w-4" />}
              />

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add some holiday cheer..."
                  value={formData.description}
                  onChange={handleChange('description')}
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Snowflake className="h-5 w-5 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    'Save Organization'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateOrganization;
