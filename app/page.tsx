import React from "react";
import { AppSidebar } from "@/components/structure/organisms/Sidebar/Sidebar";

const HomePage: React.FC = () => {

  return (
    <AppSidebar>
      <h1 className="p-4 text-3xl">Welcome, user</h1>

    </AppSidebar>
  );
};

export default HomePage;