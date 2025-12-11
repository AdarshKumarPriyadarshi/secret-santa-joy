import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { generatePairs } from "@/services/api";

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      const data = await fetchEvents();
      setEvents(data);
      setLoading(false);
    }
    loadEvents();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <p className="text-center mt-10">Loading events...</p>
      </AppLayout>
    );
  }

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
          {events.map((event: any, index: number) => (
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === "active"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
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
