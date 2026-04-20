import { Link } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useEffect, useState } from 'react';
import { fetchOrganizations } from "@/services/api";

const Organizations = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrgs() {
      const data = await fetchOrganizations();
      setOrganizations(data);
      setLoading(false);
    }
    loadOrgs();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto text-center mt-10">
          <p>Loading organizations...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary font-display flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              Organizations
            </h1>
            <p className="text-muted-foreground mt-2">Manage all your organizations</p>
          </div>
          <Link to="/organizations/create">
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Create New
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {organizations.map((org: any, index: number) => (
            <Link to={`/organizations/${org.id}`} key={org.id}>
              <Card
                className="card-hover cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-8 w-8 text-primary/50" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-display">{org.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {org.budget} budget
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Organizations;
