import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { AuthForm } from "./auth/AuthForm";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-wedding-pink flex items-center">
      <main className="container mx-auto px-4 flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-serif text-wedding-purple mb-6">
            ONAIR<br />
            Wedding Planning<br />
            Tool
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            Your Wedding Journey Starts Here
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-wedding-purple hover:bg-wedding-purple/90 text-white px-8 py-6 rounded-full text-lg">
                Create new wedding project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <AuthForm />
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};