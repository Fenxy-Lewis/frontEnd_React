// import ProductCard from "./components/ProductCard";
import Product from "./page/Product";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
// import {Button} from "./components/ui/button.tsx";
// import {useState} from "react";
import Home from "./page/Home.tsx";
import DashboardLayout from "./layouts/DashboardLayout";
import Category from "./page/category.tsx";
import { LoginForm } from "./components/Login/loginForm.tsx";
import LoginPage from "./page/loginPage.tsx";
import LoginLayout from "./layouts/LoginLayout.tsx";

function App() {
  // const [count, setCount]= useState<number>(0);
  // const handleincrease=()=>{
  //     setCount(count+1)
  //     console.log("Hello Increase: ",count)
  // }
  // const handledecrease=()=>{
  //     if(count<=0){
  //         return;
  //     }
  //     setCount(count-1)
  //     console.log("Hello Decrease: ",count)
  // }
  // <BrowserRouter>
  //     <Routes>
  //         {/* ទំព័រដើម */}
  //         <Route path="/" element={<Home/>}/>
  //
  //         {/* ទំព័របញ្ជីផលិតផល */}
  //         <Route path="/product" element={<Product/>}/>
  //
  //         {/* ទំព័រព័ត៌មានលម្អិតនៃផលិតផល (ប្រើ ID) */}
  //         <Route path="/product/:id" element={<ProductDetail/>}/>
  //
  //         {/* អ្នកអាចបន្ថែម Route សម្រាប់ 404 Not Found នៅទីនេះបាន */}
  //         <div className=" w-[80%] p-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 place-items-center m-auto">
  //             {products.map((items) => (
  //                 <ProductCard
  //                     productId={items.productId}
  //                     productName={items.productName}
  //                     price={items.price}
  //                     imageUrl={items.imageUrl}
  //                     description={items.description}
  //                 />
  //             ))}
  //         </div>
  //     </Routes>
  // </BrowserRouter>
  //
  // <div className="flex place-content-center gap-2">
  //     <Button onClick={()=>handleincrease()} size={"sm"}>+</Button>
  //     <p className="text-red-700 font-bold text-2xl">{count}</p>
  //     <Button onClick={()=>handledecrease()} size={"sm"}>-</Button>
  // </div>
  return (
    <Routes>
        <Route element={<LoginPage />}>
          <Route path="/" element={<LoginForm />} />
        </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/admin/product" element={<Product />} />
        <Route path="/admin/category" element={<Category />} />
      </Route>
    </Routes>
  );
}

export default App;
