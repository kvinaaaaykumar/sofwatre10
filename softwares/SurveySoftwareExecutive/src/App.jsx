import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import RemoveBackground from "./pages/EntryDetails";
import AdvanceChart from "./pages/AdvanceChart";
import Cart from "./pages/Cart";
import CategoryPosts from "./pages/CategoryPosts";
import PostPage from "./pages/PostPage";
import CreateEntry from "./pages/CreateEntry";
import TotalEntry from "./pages/TotalEntry";
import DownloadEntry from "./pages/DownloadEntry";
import EntryDetails from "./pages/EntryDetails";
import Social from "./pages/Social";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="createentry" element={<CreateEntry />} />
          <Route path="totalentry" element={<TotalEntry />} />
          <Route path="downloadentry" element={<DownloadEntry />} />
          <Route path="entrydetails" element={<EntryDetails />} />
          <Route path="postpage" element={<PostPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="postcategory" element={<Social />} />
          <Route path="posts/:categoryName" element={<CategoryPosts />} />
          <Route path="advancechart" element={<AdvanceChart />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
