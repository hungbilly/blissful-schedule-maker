import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-wedding-purple mb-6">
          ONAIR Wedding Planning Tool
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Your Wedding Journey Starts Here
        </p>
        <Button
          onClick={() => navigate("/auth")}
          className="bg-wedding-purple hover:bg-wedding-purple/90 text-white px-8 py-6 text-lg rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          Start Planning Now
        </Button>
      </div>
    </div>
  );
};