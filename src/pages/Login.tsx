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
      <div className="w-full py-6 flex justify-center border-b border-white/[0.06]">
        <img 
          src="https://brownandbrown.simpliautomation.com/assets/bravo-networks-logo-DMrGQqwm.png"
          alt="Bravo Networks Logo"
          className="h-12 object-contain"
        />
      </div>

      {/* Main Content Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[420px] space-y-10">
          <div className="text-center space-y-3">
            <h1 className="text-[32px] font-semibold text-white tracking-tight">
              Welcome to Support Desk
            </h1>
            <p className="text-[18px] text-white/60">
              Sign in to access the Brown & Brown Support Desk Agent
            </p>
          </div>

          <Button 
            onClick={signInWithAzure}
            className="w-full bg-[#2B303B] hover:bg-[#2B303B]/90 text-white py-7 text-[16px] font-medium border border-white/[0.06]"
            size="lg"
          >
            Sign in with Azure
          </Button>
        </div>
      </div>

      {/* Footer Section */}
      <div className="w-full py-8 flex flex-col items-center border-t border-white/[0.06] mt-auto">
        <img 
          src="https://brownandbrown.simpliautomation.com/assets/SimpliLogo.svg"
          alt="Simpli Logo"
          className="h-8 object-contain mb-4"
        />
        <p className="text-sm text-white/40">© 2024 Simpli</p>
      </div>
    </div>
  );
};

export default Login;