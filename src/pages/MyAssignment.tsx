import { useState, useEffect } from 'react';
import { Gift, Calendar, DollarSign, Building2, Snowflake } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';

const MyAssignment = () => {
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);

  const assignment = {
    recipientName: 'Jane Smith',
    organizationName: 'Tech Corp',
    eventName: 'Christmas Party 2024',
    budget: 50,
    eventDate: 'December 25, 2024',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setRevealed(true), 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="py-16 text-center">
            <CardContent className="space-y-6">
              <Gift className="h-20 w-20 mx-auto text-primary gift-bounce" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-display text-primary">
                  Loading your assignment...
                </h2>
                <div className="flex justify-center gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Snowflake
                      key={i}
                      className="h-6 w-6 text-primary/50 animate-pulse"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary via-primary to-secondary p-8 text-center text-primary-foreground">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-5 w-5" />
              <span className="font-medium">{assignment.organizationName}</span>
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">{assignment.eventName}</h1>
            <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
              <Calendar className="h-4 w-4" />
              <span>{assignment.eventDate}</span>
            </div>
          </div>

          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <p className="text-lg text-muted-foreground mb-4">You are Secret Santa for:</p>
              
              <div className={`${revealed ? 'reveal-animation' : 'opacity-0'}`}>
                <div className="inline-flex items-center justify-center w-32 h-32 bg-primary/10 rounded-full mb-4">
                  <Gift className="h-16 w-16 text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-primary font-display">
                  {assignment.recipientName}
                </h2>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 inline-flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-secondary" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-2xl font-bold">${assignment.budget}</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-xl border border-primary/10">
              <p className="text-lg">
                🎄 <span className="font-semibold">Remember:</span> Keep it a secret until gift exchange day! 🤫
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Snowflake className="h-4 w-4" />
            May your gift bring joy and holiday cheer!
            <Snowflake className="h-4 w-4" />
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyAssignment;
