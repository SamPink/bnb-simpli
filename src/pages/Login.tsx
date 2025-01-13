import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
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
      },
    });

    if (error) {
      console.error('Azure sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Logo */}
      <div className="w-full p-6 flex justify-center border-b border-border">
        <img 
          src="https://brownandbrown.simpliautomation.com/assets/bravo-networks-logo-DMrGQqwm.png"
          alt="Bravo Networks Logo"
          className="h-12 object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Welcome to Support Desk
            </h1>
            <p className="text-muted-foreground">
              Sign in to access the Brown & Brown Support Desk Agent
            </p>
          </div>

          <Button 
            onClick={signInWithAzure}
            className="w-full"
            variant="outline"
            size="lg"
          >
            Sign in with Azure
          </Button>
        </div>
      </div>

      {/* Bottom Logo */}
      <div className="w-full p-6 flex flex-col items-center border-t border-border">
        <img 
          src="https://brownandbrown.simpliautomation.com/assets/SimpliLogo.svg"
          alt="Simpli Logo"
          className="h-8 object-contain mb-2"
        />
        <p className="text-sm text-muted-foreground">© 2024 Simpli</p>
      </div>
    </div>
  );
};

export default Login;