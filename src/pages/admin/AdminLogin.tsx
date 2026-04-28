import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/lib/adminApi";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import { ShieldCheck, Mail, Phone, Loader2 } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { refresh } = useAdminAuth();

  const [emailForm, setEmailForm] = useState({ email: "", password: "" });
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState<"" | "email" | "otp-start" | "otp-verify" | "google">("");

  const finish = () => {
    refresh();
    toast.success("Welcome back, admin");
    navigate("/admin");
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy("email");
    try {
      await adminApi.loginEmail(emailForm.email, emailForm.password);
      finish();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const handleStartOtp = async () => {
    setBusy("otp-start");
    try {
      await adminApi.startOtp(phone);
      setOtpSent(true);
      toast.success("OTP sent. (Demo code: 123456)");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy("otp-verify");
    try {
      await adminApi.verifyOtp(phone, otp);
      finish();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const handleGoogle = async () => {
    setBusy("google");
    try {
      await adminApi.loginGoogleMock();
      finish();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-12 bg-gradient-hero">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-foreground text-background mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Admin access</h1>
          <p className="text-sm text-muted-foreground mt-1">Restricted area. Authorized accounts only.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="email"><Mail className="w-4 h-4 mr-1.5" />Email</TabsTrigger>
              <TabsTrigger value="phone"><Phone className="w-4 h-4 mr-1.5" />Phone</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm((s) => ({ ...s, email: e.target.value }))}
                    placeholder="riteshveer0326@gmail.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={emailForm.password}
                    onChange={(e) => setEmailForm((s) => ({ ...s, password: e.target.value }))}
                    placeholder="••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy === "email"}>
                  {busy === "email" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Sign in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone">
              <form onSubmit={otpSent ? handleVerifyOtp : (e) => { e.preventDefault(); handleStartOtp(); }} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 74xxxxxxxx"
                    disabled={otpSent}
                    required
                  />
                </div>
                {otpSent && (
                  <div>
                    <Label htmlFor="otp">6-digit code</Label>
                    <Input
                      id="otp"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      required
                    />
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={busy === "otp-start" || busy === "otp-verify"}>
                  {(busy === "otp-start" || busy === "otp-verify") && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {otpSent ? "Verify & sign in" : "Send OTP"}
                </Button>
                {otpSent && (
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(""); }}
                    className="text-xs text-muted-foreground hover:text-foreground w-full text-center"
                  >
                    Use a different number
                  </button>
                )}
              </form>
            </TabsContent>

            <TabsContent value="google" className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Sign in with the authorized Google admin account.
              </p>
              <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={busy === "google"}>
                {busy === "google" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                )}
                Continue with Google
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Demo build — auth runs locally. Wire <code className="bg-muted px-1.5 py-0.5 rounded">src/lib/adminApi.ts</code> to your Cloudflare Worker for production.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
