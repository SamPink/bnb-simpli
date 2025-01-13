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
        const error = searchParams.get('error');
        const error_description = searchParams.get('error_description');
        
        if (error || error_description) {
          console.error('Auth error:', error, error_description);
          toast.error(error_description || 'Authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        if (!code) {
          console.error('No code found in URL');
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        console.log('Code found, exchanging for session...');
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (sessionError) {
          console.error('Error exchanging code for session:', sessionError);
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        console.log('Successfully exchanged code for session');
        navigate('/');
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