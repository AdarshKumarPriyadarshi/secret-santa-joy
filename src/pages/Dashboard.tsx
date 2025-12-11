import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, DollarSign, Building2, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';

const mockOrgs = [
  { id: '1', name: 'Tech Corp', photo: '', members: 25, budget: 50 },
  { id: '2', name: 'Design Team', photo: '', members: 8, budget: 30 },
  { id: '3', name: 'Family Group', photo: '', members: 12, budget: 75 },
];

const Dashboard = () => {
  const [organizations] = useState(mockOrgs);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary font-display flex items-center gap-3">
              <Gift className="h-8 w-8 gift-bounce" />
              My Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage your Secret Santa organizations</p>
          </div>
          <Link to="/organizations/create">
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Create Organization
            </Button>
          </Link>
        </div>

        {organizations.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Organizations Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first organization to start planning Secret Santa events!
            </p>
            <Link to="/organizations/create">
              <Button>Create Your First Organization</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org, index) => (
              <Link to={`/organizations/${org.id}`} key={org.id}>
                <Card 
                  className="card-hover cursor-pointer overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-32 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                    {org.photo ? (
                      <img src={org.photo} alt={org.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="h-12 w-12 text-primary/50" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-xl font-bold mb-3 font-display">{org.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{org.members} members</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4" />
                        <span>${org.budget} budget</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
