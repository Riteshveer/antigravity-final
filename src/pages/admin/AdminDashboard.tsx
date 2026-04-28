import { useEffect, useState } from "react";
import { adminApi, type ActivityEvent, type AnalyticsSummary } from "@/lib/adminApi";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, ShoppingBag, IndianRupee, Activity } from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    adminApi.analytics().then(setData);
    adminApi.activity().then(setActivity);
  }, []);

  if (!data) return <div className="p-8 text-muted-foreground">Loading…</div>;

  const stats = [
    { label: "Users", value: data.totals.users.toLocaleString("en-IN"), icon: Users, hint: "+12% this week" },
    { label: "Orders", value: data.totals.orders.toLocaleString("en-IN"), icon: ShoppingBag, hint: "+8% this week" },
    { label: "Revenue", value: `₹${data.totals.revenue.toLocaleString("en-IN")}`, icon: IndianRupee, hint: "Last 14 days" },
    { label: "Avg order", value: `₹${data.totals.avgOrderValue.toLocaleString("en-IN")}`, icon: TrendingUp, hint: "+₹120" },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Real-time view of your store.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
              <s.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.hint}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-display font-semibold mb-4">Top selling products</h3>
          <div className="space-y-3">
            {data.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4">
                <span className="w-6 text-sm text-muted-foreground">#{i + 1}</span>
                <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
                <span className="text-sm text-muted-foreground">{p.units} units</span>
                <span className="text-sm font-display font-bold w-24 text-right">
                  ₹{p.revenue.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4" />
            <h3 className="font-display font-semibold">Recent activity</h3>
          </div>
          <div className="space-y-3">
            {activity.map((a) => (
              <div key={a.id} className="text-sm">
                <div className="font-medium leading-tight">{a.message}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(a.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
