"use client";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Minus,
  Plus,
  Trash2,
  CreditCard,
  QrCode,
  ShoppingCart,
  Search,
  Package,
  Receipt,
  CheckCircle,
  BanknoteArrowUp,
} from "lucide-react";
import type { ProductType } from "@/Type/product";
import { useProducts } from "@/hooks/product/useProducts";
import { useCategories } from "@/hooks/category/useCategories";
import type { CategoryType } from "@/Type/category";
import { toast } from "sonner";
import type { CartItemType } from "@/Type/cart";
import SharedDialog from "@/components/SharedDialog";
import { useOrder } from "@/hooks/Orders/useOrder";
import {
  useCheckTransaction,
  useCreatePayment,
} from "@/hooks/payment/usePayment";
// End of Import
export default function Page() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [orderItems, setOrderItems] = useState<CartItemType[]>([]);
  const { data: productData } = useProducts("", 1, 100);
  const { data: categoryData } = useCategories();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string>("cash");

  const productFectchForPos = (productData?.data as ProductType[]) ?? [];
  const categoryFecthForPos = (categoryData as CategoryType[]) ?? [];
  console.log("Product:", productFectchForPos);
  console.log("Category:", categoryFecthForPos);

  const addToOrder = (product: ProductType) => {
    if (product.qty <= 0) {
      toast.warning("Product is out of stock");
      return;
    }
    setOrderItems((prev) => {
      const existingItem = prev.find(
        (orderItems) => orderItems.productId === product.id,
      );
      if (existingItem) {
        if (existingItem.qty >= existingItem.stock) {
          toast.warning("Product is out of stock");
          return prev;
        }
        return prev.map((items) =>
          items.productId === product.id
            ? { ...items, qty: items.qty + 1 }
            : items,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          Category: product.category.name,
          price: product.price,
          qty: 1,
          stock: product.qty,
          imageUrl: product.productImages?.[0].imageUrl,
        },
      ];
    });
  };
  // End of addToOrder

  const removeFromOrder = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.productId !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromOrder(id);
    } else {
      setOrderItems(
        orderItems.map((item) =>
          item.productId === id ? { ...item, qty: quantity } : item,
        ),
      );
    }
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  // useEffefct for check transactionus
  const { mutateAsync: checkTransactionMutate } = useCheckTransaction();
  useEffect(() => {
    const tranId = searchParams.get("tranId");
    if (tranId) {
      checkTransactionMutate(tranId);
    }
  }, [searchParams]);

  // Filter products by category and search
  const filteredProducts = productFectchForPos.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category.name === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const { mutate: createOrderMutate } = useOrder();
  const { mutateAsync: createPaymentMutate } = useCreatePayment();
  const totalCartItems = orderItems.reduce((sum, item) => sum + item.qty, 0);
  const handlePlaceOrder = () => {
    const OrderPayload = {
      discount: 0,
      items: orderItems.map((item) => ({
        productId: item.productId,
        qty: item.qty,
      })),
    };
    createOrderMutate(OrderPayload, {
      onSuccess: (res) => {
        console.log("Res", res);
        const orderId = res.data.id;
        createPaymentMutate(orderId, {
          onSuccess: (res) => {
            console.log("Res", res);
            if (res.data) {
              const payway = res.data.payway;
              const form = document.createElement("form");
              form.id = "aba_merchant_request";
              form.method = payway.method;
              form.action = payway.action;
              form.target = payway.target;
              Object.entries(payway.fields).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
              });

              document.body.appendChild(form);

              setIsOpen(false);
              AbaPayway?.checkout();
            }
            toast.success("Order Placed Successfully!");
            setOrderItems([]);
            setIsOpen(false);
          },
        });
      },
      onError: () => {
        toast.error("Failed to place order");
      },
    });
  };

  return (
    <div>
      <div className="flex h-[calc(100vh-5rem)] bg-gray-50/80 rounded-xl overflow-hidden border border-gray-200/80">
        {/* ─────────── Main Content Area ─────────── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* ── Top Header Bar ── */}
          <div className="border-b border-gray-200/80 bg-white px-6 py-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center justify-center flex-col">
                  <h1 className="flex flex-col text-xl font-bold text-gray-900 tracking-tight">
                    Point of Sale
                    <span className="text-xs font-semibold text-gray-500 mt-[-3px]">
                      {filteredProducts.length} products available
                    </span>
                  </h1>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-semibold"
                >
                  <Package className="mr-1 h-3 w-3" />
                  {totalCartItems} items
                </Badge>
              </div>
            </div>
          </div>

          {/* ── Category Tabs ── */}
          <div className="border-b border-gray-200/60 bg-white px-6 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`flex-shrink-0 rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === "All"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 scale-[1.02]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                All
              </button>
              {categoryFecthForPos.map((c, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`flex-shrink-0 rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === c.name
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 scale-[1.02]"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Grid ── */}
          <div className="flex-1 overflow-auto p-6">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Package className="h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm">
                  Try a different category or search term
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((item: ProductType) => (
                  <Card
                    key={item.id}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-0 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 hover:border-emerald-200/60"
                    onClick={() => addToOrder(item)}
                  >
                    <CardContent className="p-0">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <img
                          src={item.productImages?.[0].imageUrl}
                          className="h-full w-full object-contain transition-transform duration-500"
                          alt={item.name}
                        />
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 truncate leading-tight">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.category.name}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-green-800 ">
                            Stock: {item.qty}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <p className="text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            ${Number(item.price).toFixed(2)}
                          </p>
                          {/* Quick add button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToOrder(item);
                            }}
                            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm shadow-lg opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-emerald-500 hover:text-white text-emerald-600"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─────────── Right Sidebar — Cart ─────────── */}
        <div className="flex w-[380px] flex-col border-l border-gray-200/80 bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.04)]">
          {/* Cart Header */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
                  <Receipt className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Current Order
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    {orderItems.length}{" "}
                    {orderItems.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              {orderItems.length > 0 && (
                <button
                  onClick={() => setOrderItems([])}
                  className="h-9 w-9 flex bg-red-50 items-center rounded-lg p-1 text-red-800 font-medium transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-4 w-8" />
                </button>
              )}
            </div>
          </div>

          {/* Cart Items */}
          <ScrollArea className="flex-1 min-h-0 overflow-hidden">
            <div className="p-4 space-y-2">
              {orderItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
                    <ShoppingCart className="h-7 w-7 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    Cart is empty
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Add products to get started
                  </p>
                </div>
              ) : (
                orderItems.map((item: CartItemType, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="group/item flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 transition-all duration-200 hover:bg-white hover:border-gray-200 hover:shadow-sm"
                  >
                    {/* Image */}
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white border border-gray-100 p-1">
                      <img
                        className="h-full w-full object-cover rounded-lg"
                        src={item.imageUrl}
                        alt={item.name}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {item.Category}
                      </p>
                      <p className="text-xs font-bold text-emerald-600 mt-1">
                        ${Number(item.price).toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-sm font-bold text-gray-900">
                        ${(Number(item.price) * item.qty).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.productId, item.qty - 1);
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-gray-800 w-6 text-center tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.qty < item.stock) {
                              updateQuantity(item.productId, item.qty + 1);
                            } else {
                              toast.warning("Cannot exceed available stock");
                            }
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* ── Checkout Footer ── */}
          <div className="border-t border-gray-200/80 bg-gradient-to-t from-gray-50 to-white p-5 space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-700">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (10%)</span>
                <span className="font-medium text-gray-700">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <Separator className="!my-3" />
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            {/* <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm group/pay">
                <div className="flex h-4 w-4 items-center justify-center rounded-lg bg-emerald-50 transition-colors group-hover/pay:bg-emerald-100">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-[11px] font-semibold text-gray-600 group-hover/pay:text-emerald-700">
                  Cash
                </span>
              </button>
              <button className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm group/pay">
                <div className="flex h-4 w-4 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover/pay:bg-blue-100">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-[11px] font-semibold text-gray-600 group-hover/pay:text-blue-700">
                  Card
                </span>
              </button>
              <button className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:shadow-sm group/pay">
                <div className="flex h-4 w-4 items-center justify-center rounded-lg bg-violet-50 transition-colors group-hover/pay:bg-violet-100">
                  <QrCode className="h-4 w-4 text-violet-600" />
                </div>
                <span className="text-[11px] font-semibold text-gray-600 group-hover/pay:text-violet-700">
                  QR Pay
                </span>
              </button>
            </div> */}

            {/* Checkout Button */}
            <Button
              onClick={() => setIsOpen(true)}
              disabled={orderItems.length === 0}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-6 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Checkout — ${total.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
      <SharedDialog
        open={isOpen}
        setOpen={setIsOpen}
        width="720px"
        title={`ORDER CHECKOUT`}
        isCancel={false}
      >
        <div className="space-y-5">
          {/* ── Order Summary Table ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900">Order Summary</h3>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                {orderItems.length} {orderItems.length === 1 ? "item" : "items"}
              </Badge>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-3 px-3 py-2 bg-gray-50 rounded-t-lg border border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Table Body */}
            <div className="border border-t-0 border-gray-200 rounded-b-lg divide-y divide-gray-100 max-h-[280px] overflow-y-auto">
              {orderItems.map((item: CartItemType, index) => (
                <div
                  key={`checkout-${item.productId}-${index}`}
                  className="grid grid-cols-12 gap-3 px-3 py-3 items-center hover:bg-gray-50/80 transition-colors"
                >
                  {/* # */}
                  <div className="col-span-1 text-center text-xs text-gray-400 font-medium">
                    {index + 1}
                  </div>

                  {/* Product Info */}
                  <div className="col-span-5 flex items-center gap-2.5">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white p-0.5">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {item.Category}
                      </p>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-2 text-center text-sm text-gray-600">
                    ${Number(item.price).toFixed(2)}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex justify-center">
                    <span className="inline-flex items-center justify-center h-7 w-8 rounded-md bg-emerald-50 text-sm font-bold text-emerald-700">
                      {item.qty}
                    </span>
                  </div>

                  {/* Line Total */}
                  <div className="col-span-2 text-right text-sm font-bold text-gray-900">
                    ${(Number(item.price) * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Payment Method ── */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: "BanknoteArrowUp",
                  label: "Cash",
                  icon: <BanknoteArrowUp className="h-5 w-5" />,
                  color: "emerald",
                },
                {
                  id: "card",
                  label: "Card",
                  icon: <CreditCard className="h-5 w-5" />,
                  color: "blue",
                },
                {
                  id: "qr",
                  label: "QR Pay",
                  icon: <QrCode className="h-5 w-5" />,
                  color: "violet",
                },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                    selectedPayment === method.id
                      ? method.color === "emerald"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/10"
                        : method.color === "blue"
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10"
                          : "border-violet-500 bg-violet-50 text-violet-700 shadow-sm shadow-violet-500/10"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {selectedPayment === method.id && (
                    <CheckCircle className="absolute top-2 right-2 h-4 w-4" />
                  )}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      selectedPayment === method.id
                        ? method.color === "emerald"
                          ? "bg-emerald-100"
                          : method.color === "blue"
                            ? "bg-blue-100"
                            : "bg-violet-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {method.icon}
                  </div>
                  <span className="text-xs font-semibold">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* ── Price Breakdown ── */}
          <div className="space-y-2.5 bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Subtotal ({orderItems.reduce((s, i) => s + i.qty, 0)} items)
              </span>
              <span className="font-medium text-gray-700">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax (10%)</span>
              <span className="font-medium text-gray-700">
                ${tax.toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center pt-1">
              <span className="text-base font-bold text-gray-900">
                Total Amount
              </span>
              <span className="text-2xl font-extrabold text-emerald-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* ── Confirm Button ── */}
          <Button
            // onClick={() => {
            //   toast.success("Order placed successfully!");
            //   setOrderItems([]);
            //   setIsOpen(false);
            // }}
            onClick={handlePlaceOrder}
            disabled={orderItems.length === 0}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-6 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-40 disabled:shadow-none"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm Order — ${total.toFixed(2)}
          </Button>
        </div>
      </SharedDialog>
    </div>
  );
}
