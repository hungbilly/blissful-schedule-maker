import { AuthForm } from "@/components/auth/AuthForm";

const Auth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;