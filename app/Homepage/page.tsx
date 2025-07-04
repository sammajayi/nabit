"use client"

import React, { useState } from "react";
import BottomNav from "../components/BottomNav";
import ProductUpload from "../components/products/ProductUpload";
import ProductList from "../components/Home/ProductList";
import Profile from "../components/products/Profile"
import Shop from "../components/products/Shop"


export default function Homepage() {
  const [activePage, setActivePage] = useState("Home");

  let content;
  if (activePage === "Create") {
    content = <ProductUpload />;
  } else if (activePage === "Profile") {
    content = <Profile address="0x1234...abcd" soldCount={5} boughtCount={3} />;
  } else if((activePage === "Shop")) {
    content = <Shop/>;
  } else  {
    content = <ProductList />;
  }

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <div className="relative flex flex-col min-h-screen max-w-md mx-auto bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-16">
          {content}
        </div>
        <BottomNav onNavigate={setActivePage} active={activePage} />
      </div>
    </div>
  );
}