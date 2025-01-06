import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { AuthForm } from "./auth/AuthForm";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-wedding-pink">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-wedding-purple text-2xl font-serif">WA</div>
        <div className="flex items-center gap-4">
          <Link to="/vendors" className="text-wedding-purple hover:text-wedding-purple/80">
            Find vendor or venue
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-wedding-purple hover:text-wedding-purple/80">
                Login | Register
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <AuthForm />
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-serif text-wedding-purple mb-6">
            ONAIR<br />
            Wedding Planning<br />
            Tool
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            Your one-stop wedding planning website, with all the tools you'll need to create the dream celebration.
            No hidden fees! No sign-up required!
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
        <div className="relative">
          <img 
            src="/lovable-uploads/bac421a9-4f52-442b-b5fd-636babee1ca8.png" 
            alt="Wedding Planning Illustration" 
            className="w-full"
          />
        </div>
      </main>

      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-wedding-purple max-w-4xl mx-auto leading-relaxed">
          Our service has assisted tens of thousands of couples worldwide in planning their dream weddings!
        </h2>
      </div>
    </div>
  );
};