import { Outlet, Link } from "react-router-dom";
import { ShoppingCart, Home, TrendingUp, ArrowLeft } from "lucide-react";

const buyerNav = [
  { title: "Browse Auctions", url: "/buyer", icon: Home },
  { title: "Market Prices", url: "/buyer/market", icon: TrendingUp },
];

export default function BuyerLayout() {

  return (

    <div className="min-h-screen flex">

      {/* Sidebar */}

      <div className="w-64 bg-white border-r">

        <div className="p-4 border-b flex items-center gap-2 font-bold">

          <ShoppingCart className="h-5 w-5 text-green-600" />

          Buyer Panel

        </div>

        <nav className="p-3 space-y-2">

          {buyerNav.map((item) => {

            const Icon = item.icon;

            return (

              <Link
                key={item.title}
                to={item.url}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
              >

                <Icon className="h-4 w-4" />

                {item.title}

              </Link>

            );

          })}

        </nav>

      </div>

      {/* Main Content */}

      <div className="flex-1 flex flex-col">

        {/* Header */}

        <header className="h-14 flex items-center gap-3 border-b px-4 bg-white">

          <Link
            to="/"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-black"
          >

            <ArrowLeft className="h-4 w-4" />

            Home

          </Link>

          <span className="text-sm font-semibold">

            Buyer Dashboard

          </span>

        </header>

        {/* Page Content */}

        <main className="flex-1 p-4 md:p-6 bg-gray-50">

          <Outlet />

        </main>

      </div>

    </div>

  );
}