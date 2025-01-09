import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export const AuthForm = () => {
  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-serif text-wedding-purple text-center mb-6">
        Welcome Back
      </h2>
      <Auth
        supabaseClient={supabase}
        view="sign_up"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#6B4E71',
                brandAccent: '#5d4361',
              },
            },
          },
          className: {
            container: 'auth-container',
            button: 'auth-button',
            input: 'auth-input',
          },
        }}
        localization={{
          variables: {
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              email_input_placeholder: 'Your email address',
              password_input_placeholder: 'Your password',
              button_label: 'Sign up',
              confirmation_text: 'Please confirm your password',
            },
          },
        }}
        providers={[]}
        showLinks={true}
      />
    </div>
  );
};