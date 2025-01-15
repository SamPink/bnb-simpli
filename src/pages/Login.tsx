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
    <div className="min-h-screen flex flex-col bg-[#1C2127]">
      {/* Top Logo Section */}
      <div className="w-full py-8 flex justify-center border-b border-border/10">
        <img 
          src="https://brownandbrown.simpliautomation.com/assets/bravo-networks-logo-DMrGQqwm.png"
          alt="Bravo Networks Logo"
          className="h-14 object-contain"
        />
      </div>

      {/* Main Content Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">
              Welcome to Support Desk
            </h1>
            <p className="text-lg text-muted-foreground">
              Sign in to access the Brown & Brown Support Desk Agent
            </p>
          </div>

          <Button 
            onClick={signInWithAzure}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-medium"
            size="lg"
          >
            Sign in with Azure
          </Button>
        </div>
      </div>

      {/* Footer Section */}
      <div className="w-full py-8 flex flex-col items-center border-t border-border/10 mt-auto">
        <img 
          src="https://brownandbrown.simpliautomation.com/assets/SimpliLogo.svg"
          alt="Simpli Logo"
          className="h-10 object-contain mb-4"
        />
        <p className="text-sm text-muted-foreground">© 2024 Simpli</p>
      </div>
    </div>
  );
};

export default Login;