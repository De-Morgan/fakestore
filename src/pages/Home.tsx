import { Link } from "react-router";
import { Button } from "../components/ui/button";

export default function HomePage() {
  return (
    <>
      <div>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1>Home page</h1>
          <Button>
            <Link to={"/products"}>Go to Project</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
