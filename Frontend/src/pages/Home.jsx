import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaUsers,
  FaMoneyCheckAlt,
  FaPercentage,
  FaHeadset,
  FaShoppingBag,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const Navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-blue-600">Seller Hub</h1>
        <div className="space-x-4 hidden md:flex">
          <a href="#" className="text-gray-600 hover:text-blue-600">
            Sell Online
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            Fees & Commission
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            Grow
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            Learn
          </a>
        </div>
        <div className="space-x-2">
          <Link to="/Storelogin">
            <Button variant="outline">Login</Button>
          </Link>
          <Button
            onClick={() => Navigate("/Storeregstration1")}
            className="bg-yellow-500 text-white"
          >
            Start Selling{" "}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-10 px-4">
        <h2 className="text-3xl font-bold">Sell Online with Our Platform</h2>
        <p className="text-gray-600 mt-2">
          Reach millions of customers and grow your business.
        </p>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {[
          { icon: FaUsers, text: "45 Crore+ Customers" },
          { icon: FaMoneyCheckAlt, text: "7 Days Secure Payments" },
          { icon: FaPercentage, text: "Low Business Cost" },
          { icon: FaHeadset, text: "One-click Seller Support" },
          { icon: FaShoppingBag, text: "Access to Big Sale Days" },
        ].map((feature, index) => (
          <Card key={index} className="flex items-center p-4 shadow-md">
            <feature.icon className="text-blue-600 text-3xl mr-4" />
            <CardContent>{feature.text}</CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
