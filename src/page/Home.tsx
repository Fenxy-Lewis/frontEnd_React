import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Users,
  UserCheck,
  Layers,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ShoppingCart,
  DollarSign,
  Activity,
  BarChart3,
  Clock,
  Plus,
  Eye,
} from "lucide-react";
import { useProducts } from "@/hooks/product/useProducts";
import { useCategories } from "@/hooks/category/useCategories";
import type { ProductType } from "@/Type/product";
import type { CategoryType } from "@/Type/category";
import { Link } from "react-router-dom";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

// --- Chart config ---
const revenueChartConfig = {
  revenue: { label: "Revenue", color: "#3b82f6" },
  orders: { label: "Orders", color: "#8b5cf6" },
} satisfies ChartConfig;

const revenueData = [
  { month: "Jan", revenue: 4200, orders: 120 },
  { month: "Feb", revenue: 5800, orders: 165 },
  { month: "Mar", revenue: 4900, orders: 140 },
  { month: "Apr", revenue: 7200, orders: 210 },
  { month: "May", revenue: 6100, orders: 180 },
  { month: "Jun", revenue: 8400, orders: 245 },
  { month: "Jul", revenue: 7800, orders: 230 },
];

// --- Activity data ---
const recentActivity = [
  {
    id: 1,
    action: "New order placed",
    description: "Order #1042 — 3 items",
    time: "2 min ago",
    icon: ShoppingCart,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 2,
    action: "Product added",
    description: "iPhone 15 Pro Max",
    time: "15 min ago",
    icon: Package,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 3,
    action: "New customer registered",
    description: "Sophea Chea",
    time: "1 hour ago",
    icon: UserCheck,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    id: 4,
    action: "Payment received",
    description: "$1,250.00 via ABA",
    time: "2 hours ago",
    icon: DollarSign,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    id: 5,
    action: "User role updated",
    description: "Admin → Vireakboth Pang",
    time: "3 hours ago",
    icon: Users,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

// --- Component ---
const Home = () => {
  const { data: productData, isLoading: productsLoading } = useProducts(
    "",
    1,
    1000,
  );
  const { data: categoryData, isLoading: categoriesLoading } = useCategories();

  const products = useMemo(
    () => (productData?.data as ProductType[]) ?? [],
    [productData?.data],
  );
  const categories = useMemo(
    () => (categoryData as CategoryType[]) ?? [],
    [categoryData],
  );

  // Derived stats
  const totalStock = useMemo(
    () => products.reduce((sum, p) => sum + p.qty, 0),
    [products],
  );
  const totalValue = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.qty, 0),
    [products],
  );
  const lowStockProducts = useMemo(
    () => products.filter((p) => p.qty > 0 && p.qty <= 5),
    [products],
  );
  const outOfStockProducts = useMemo(
    () => products.filter((p) => p.qty <= 0),
    [products],
  );
  const topProducts = useMemo(
    () => [...products].sort((a, b) => b.price - a.price).slice(0, 5),
    [products],
  );

  // Mock counts
  const totalUsers = 24;
  const totalCustomers = 156;

  // Stat cards data
  const statCards = [
    {
      title: "Total Products",
      value: productsLoading ? "—" : products.length,
      change: "+12%",
      trend: "up" as const,
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/25",
      description: `${totalStock} items in stock`,
    },
    {
      title: "Categories",
      value: categoriesLoading ? "—" : categories.length,
      change: "+3",
      trend: "up" as const,
      icon: Layers,
      gradient: "from-emerald-500 to-emerald-600",
      shadowColor: "shadow-emerald-500/25",
      description: "Active categories",
    },
    {
      title: "Total Users",
      value: totalUsers,
      change: "+8%",
      trend: "up" as const,
      icon: Users,
      gradient: "from-violet-500 to-violet-600",
      shadowColor: "shadow-violet-500/25",
      description: "System users",
    },
    {
      title: "Customers",
      value: totalCustomers,
      change: "+23%",
      trend: "up" as const,
      icon: UserCheck,
      gradient: "from-amber-500 to-amber-600",
      shadowColor: "shadow-amber-500/25",
      description: "Registered customers",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's an overview of your store.
          </p>
        </div>
        <div className="flex gap-2 mt-3 sm:mt-0">
          <Link to="/admin/product">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-medium"
            >
              <Eye className="h-3.5 w-3.5" />
              View Products
            </Button>
          </Link>
          <Link to="/admin/pos">
            <Button
              size="sm"
              className="gap-1.5 text-xs font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Open POS
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {stat.trend === "up" ? (
                      <div className="flex items-center gap-0.5 text-emerald-600">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs font-semibold">
                          {stat.change}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5 text-red-500">
                        <TrendingDown className="h-3 w-3" />
                        <span className="text-xs font-semibold">
                          {stat.change}
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-gray-400">vs last month</span>
                  </div>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} ${stat.shadowColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Second Row: Revenue Overview + Inventory Alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  Revenue Overview
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Monthly revenue & order trends
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-emerald-50 text-emerald-700 border-0 gap-1"
              >
                <TrendingUp className="h-3 w-3" />
                +18.2%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-6 mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">$44,400</p>
                <p className="text-xs text-gray-500">Total Revenue</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-2xl font-bold text-gray-900">1,290</p>
                <p className="text-xs text-gray-500">Total Orders</p>
              </div>
            </div>
            <ChartContainer
              config={revenueChartConfig}
              className="h-[220px] w-full"
            >
              <BarChart data={revenueData} barGap={4}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickMargin={4}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="orders"
                  fill="var(--color-orders)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-900">
                Inventory Alerts
              </CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Out of Stock */}
            <div className="rounded-xl bg-red-50 p-3.5 border border-red-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">
                  Out of Stock
                </span>
                <span className="text-xl font-bold text-red-700">
                  {outOfStockProducts.length}
                </span>
              </div>
              <p className="text-xs text-red-500">Products need restocking</p>
            </div>

            {/* Low Stock */}
            <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Low Stock
                </span>
                <span className="text-xl font-bold text-amber-700">
                  {lowStockProducts.length}
                </span>
              </div>
              <p className="text-xs text-amber-500">Products below 5 units</p>
            </div>

            {/* Total Value */}
            <div className="rounded-xl bg-blue-50 p-3.5 border border-blue-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  Inventory Value
                </span>
                <span className="text-lg font-bold text-blue-700">
                  $
                  {totalValue.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <p className="text-xs text-blue-500">
                Total stock value at retail
              </p>
            </div>

            {/* Quick Actions */}
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/admin/product/create">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs gap-1 h-9"
                  >
                    <Plus className="h-3 w-3" />
                    Add Product
                  </Button>
                </Link>
                <Link to="/admin/category">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs gap-1 h-9"
                  >
                    <Layers className="h-3 w-3" />
                    Categories
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row: Top Products + Recent Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top Products */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Top Products
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Highest priced products in your store
                </p>
              </div>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                >
                  {/* Rank */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      index === 0
                        ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm"
                        : index === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-sm"
                          : index === 2
                            ? "bg-gradient-to-br from-orange-300 to-orange-400 text-white shadow-sm"
                            : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Product Image */}
                  <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {product.productImages?.[0]?.imageUrl ? (
                      <img
                        src={product.productImages[0].imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.category?.name} · {product.qty} in stock
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </div>
              ))}

              {topProducts.length === 0 && !productsLoading && (
                <div className="text-center py-8 text-gray-400">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No products found</p>
                </div>
              )}

              {productsLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 animate-pulse" />
                      <div className="h-10 w-10 rounded-lg bg-gray-100 animate-pulse" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
                        <div className="h-2.5 w-1/3 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Recent Activity
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Latest updates across your store
                </p>
              </div>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivity.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start gap-3 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activity.bg}`}
                    >
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-0.5">
                      {activity.time}
                    </span>
                  </div>
                  {index < recentActivity.length - 1 && (
                    <Separator className="mx-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Stats Bar */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-gray-900 to-gray-800">
        <CardContent className="p-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {productsLoading ? "—" : products.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">Products Listed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {totalStock.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">Items In Stock</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                $
                {totalValue.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-gray-400 mt-1">Inventory Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {categoriesLoading ? "—" : categories.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">Active Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
