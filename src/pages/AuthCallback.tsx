import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Handling auth callback...');
        const { searchParams } = new URL(window.location.href);
        const code = searchParams.get('code');
        
        if (code) {
          console.log('Code found, exchanging for session...');
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error exchanging code for session:', error);
            toast.error('Authentication failed. Please try again.');
            navigate('/login');
            return;
          }

          console.log('Successfully exchanged code for session');
          navigate('/');
        } else {
          console.error('No code found in URL');
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-foreground">Authenticating...</div>
    </div>
  );
};

export default AuthCallback;