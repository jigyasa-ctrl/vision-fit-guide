
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4 text-center">
      <div className="mb-8">
        <Dumbbell className="h-16 w-16 text-fit-blue mx-auto" />
      </div>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Oops! We couldn't find the page you're looking for.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
