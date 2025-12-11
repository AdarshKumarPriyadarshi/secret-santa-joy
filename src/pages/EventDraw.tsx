import { generatePairs } from "../services/api";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Gift, AlertTriangle, Snowflake, CheckCircle, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const EventDraw = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 💥 Ensure these are inside the component
  const [isDrawing, setIsDrawing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [pairs, setPairs] = useState<any[]>([]);

  // 👇 FIX: Access participants INSIDE component
  const participants = location.state?.participantNames || [];

  const handleDraw = async () => {
    setIsDrawing(true);

    if (participants.length < 3) {
      alert("Not enough participants!");
      setIsDrawing(false);
      return;
    }

    const result = await generatePairs(participants);
    setPairs(result);

    setIsDrawing(false);
    setIsComplete(true);
  };


  if (isComplete) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-12">
            <CardContent className="space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-secondary/10 rounded-full mb-4 reveal-animation">
                <CheckCircle className="h-12 w-12 text-secondary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-secondary font-display flex items-center justify-center gap-3">
                  <PartyPopper className="h-8 w-8" />
                  Success!
                  <PartyPopper className="h-8 w-8" />
                </h1>
                <p className="text-xl text-muted-foreground">
                  Assignments generated and notifications sent!
                </p>
                <div className="mt-6 text-left">
                  <h3 className="text-lg font-semibold mb-2">Generated Secret Santa Pairs:</h3>
                  <ul className="space-y-1">
                    {pairs.map((p, i) => (
                      <li key={i} className="text-muted-foreground">
                        🎁 {p.giver} ➜ {p.receiver}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-secondary/5 rounded-lg p-6 text-left space-y-2">
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  All participants have been assigned their Secret Santa recipient
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  Email and SMS notifications are being sent
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  Participants can now view their assignments
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => navigate('/events/1/notifications')} className="flex-1">
                  View Notification Status
                </Button>
                <Button onClick={() => navigate('/dashboard')} className="flex-1">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (isDrawing) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-16">
            <CardContent className="space-y-8">
              <div className="relative">
                <Gift className="h-24 w-24 mx-auto text-primary gift-bounce" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-primary font-display">
                  🎄 Assigning Secret Santas... 🎄
                </h2>
                <p className="text-muted-foreground">
                  The elves are working their magic!
                </p>
              </div>
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Snowflake 
                    key={i}
                    className="h-6 w-6 text-primary/50 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
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
        <Card className="animate-fade-in">
          <CardHeader className="text-center pb-2">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4">
              <Gift className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-display text-primary">
              Ready to Draw? 🎅
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Important Notice</p>
                <p className="text-sm text-muted-foreground">
                  Once you click "Assign Secret Santas," all participants will be assigned 
                  randomly, and notifications will be sent automatically. This action cannot 
                  be undone!
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">What happens next?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Each participant gets a unique Secret Santa recipient</li>
                <li>• Email notifications are sent to all participants</li>
                <li>• SMS notifications are sent to those with phone numbers</li>
                <li>• Participants can log in to see their assignment</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Cancel / Back
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-lg h-12">
                    🎄 Assign Secret Santas
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      Confirm Secret Santa Draw
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to proceed? All participants will receive their 
                      assignments via email and SMS. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDraw} className="bg-primary">
                      Yes, Assign Now!
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default EventDraw;
