import { Link } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useState } from 'react';

const mockEvents = [
  { id: '1', name: 'Christmas 2024', org: 'Tech Corp', date: '2024-12-25', participants: 15, status: 'active' },
  { id: '2', name: 'Holiday Party', org: 'Design Team', date: '2024-12-20', participants: 8, status: 'active' },
  { id: '3', name: 'Family Exchange', org: 'Family Group', date: '2024-12-24', participants: 12, status: 'completed' },
];

const Events = () => {
  const [events] = useState(mockEvents);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary font-display flex items-center gap-3">
              <Calendar className="h-8 w-8" />
              Events
            </h1>
            <p className="text-muted-foreground mt-2">All your Secret Santa events</p>
          </div>
          <Link to="/events/create">
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Create Event
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {events.map((event, index) => (
            <Link to={`/events/${event.id}`} key={event.id}>
              <Card 
                className="card-hover cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.org} • {event.date} • {event.participants} participants
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'active' 
                      ? 'bg-secondary/10 text-secondary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {event.status}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Events;
