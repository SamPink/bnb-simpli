import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          try {
            // Exchange the token with our backend
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/exchange`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1'
              },
              body: JSON.stringify({
                access_token: session.access_token,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to exchange token');
            }

            navigate("/");
          } catch (error) {
            console.error('Token exchange error:', error);
            toast.error('Authentication failed. Please try again.');
            await supabase.auth.signOut();
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signInWithAzure = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email offline_access',
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Azure sign in error:', error);
      toast.error('Failed to sign in with Azure. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-foreground">
          Welcome to Chat
        </h1>
        <Button 
          onClick={signInWithAzure}
          className="w-full"
          variant="outline"
        >
          Sign in with Azure
        </Button>
      </div>
    </div>
  );
};

export default Login;