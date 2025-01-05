import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export const AuthForm = () => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-serif text-wedding-purple text-center mb-6">
        Wedding Planner
      </h2>
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#9F7AEA',
                brandAccent: '#805AD5',
              },
            },
          },
        }}
        providers={[]}
      />
    </div>
  );
};