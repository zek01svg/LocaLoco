import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUser } from '../hooks/useUser';
// ✅ 1. Import the new API function we will create
import { getVouchers, redeemVoucherOnBackend } from '../types/ref'; 
import { 
  ArrowLeft, DollarSign, Tag, Percent, Gift, Sparkles, Coffee, Star,
  Crown, TrendingUp, CheckCircle2, Clock, Copy, AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Voucher } from '../types/vouchers'; // Note: RedeemedVoucher type is no longer needed here
import { availableVouchers } from '../data/voucherdata';
import { toast } from 'sonner';
import { useThemeStore } from '../store/themeStore';
import { useUserPointsStore } from '../store/userStore';

interface VouchersPageProps {
  initialTab?: 'available' | 'my-vouchers';
}

export function VouchersPage({ initialTab = 'available' }: VouchersPageProps) {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);
  const { stats, mutate: mutateUser } = useUser(userId); // ✅ Get the mutate function to refresh points
  const currentPoints = stats?.loyaltyPoints || 0;
  const deductPoints = useUserPointsStore((state) => state.deductPoints);
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [myVouchers, setMyVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Renamed to a more generic fetch function
  const fetchMyVouchers = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getVouchers({
        userId,
        status: 'issued', // You can change this to fetch all statuses if needed
        limit: 100
      });
      setMyVouchers(data.vouchers || []);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Failed to load your vouchers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVouchers();
  }, [userId]);

  // Color variables... (no changes here)
  const bgColor = isDarkMode ? '#3a3a3a' : '#f9fafb';
  const cardBgColor = isDarkMode ? '#2a2a2a' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const secondaryTextColor = isDarkMode ? '#a3a3a3' : '#6b7280';
  const borderColor = isDarkMode ? '#404040' : '#e5e7eb';
  const accentBgColor = isDarkMode ? '#4a4a4a' : '#f3f4f6';

  // Access restriction... (no changes here)
  if (role !== 'user') {
    // ... return restricted access component
  }

  const getIcon = (iconName: string) => {
    // ... no changes here
  };

  // ✅ 2. COMPLETELY REPLACED handleRedeemVoucher
  const handleRedeemVoucher = async (voucher: Voucher) => {
    if (!userId) {
      toast.error("You must be logged in to redeem vouchers.");
      return;
    }
    if (currentPoints < voucher.pointsCost) {
      toast.error('Not enough points', {
        description: `You need ${voucher.pointsCost - currentPoints} more points.`,
      });
      return;
    }

    const redemptionPromise = async () => {
      // This calls the API function you need to add to ref.ts
      await redeemVoucherOnBackend({
        userId: userId,
        voucherId: voucher.id,
        pointsCost: voucher.pointsCost,
      });
      
      // After success, re-fetch the data to update the UI
      await fetchMyVouchers();
      // Also re-fetch user stats to update points display
      mutateUser();
    };

    toast.promise(redemptionPromise, {
      loading: 'Redeeming voucher...',
      success: 'Voucher redeemed successfully! Check the "My Vouchers" tab.',
      error: (err) => err.response?.data?.message || 'Failed to redeem voucher.',
    });
    
    setActiveTab('my-vouchers');
  };

  // copyVoucherCode functions... (no changes here)

  // VoucherCard component... (no changes here)
  
  // ❌ RedeemedVoucherCard component is no longer needed because the main card now handles all statuses.

  return (
    <div className="min-h-screen p-4 md:p-6 md:pl-6" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header... (no changes here, it will update automatically) */}
        
        {/* Info Alert... (no changes here) */}
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">
              Available ({availableVouchers.length})
            </TabsTrigger>
            <TabsTrigger value="my-vouchers">
              My Vouchers ({myVouchers.length}) {/* ✅ Uses the correct length */}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableVouchers.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-vouchers" className="space-y-6 mt-6">
            {loading ? (
              <p>Loading your vouchers...</p>
            ) : myVouchers.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* ✅ 3. This now maps over the single source of truth: myVouchers */}
                {myVouchers.map((voucher, index) => (
                  <Card key={voucher.id || index} style={{ backgroundColor: cardBgColor, borderColor: borderColor }}>
                    {/* This is the rendering logic from your original code */}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 161, 163, 0.2)' }}>
                          <DollarSign className="w-6 h-6 text-[#FFA1A3]" />
                        </div>
                        <Badge className={
                          voucher.status === 'used' ? 'bg-green-600 text-white' :
                          voucher.status === 'expired' ? 'bg-gray-600 text-white' :
                          'bg-[#FFA1A3] text-white'
                        }>
                          {voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1)}
                        </Badge>
                      </div>
                      <CardTitle className="mt-3" style={{ color: textColor }}>
                        ${voucher.amount} Voucher
                      </CardTitle>
                      <CardDescription style={{ color: secondaryTextColor }}>
                        {voucher.title || 'Reward Voucher'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm" style={{ color: secondaryTextColor }}>Voucher Code</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 rounded-lg text-center tracking-wider text-sm" style={{ backgroundColor: accentBgColor, color: textColor }}>
                            {voucher.code || `#${voucher.id}`}
                          </code>
                          <Button
                            variant="outline" size="sm"
                            onClick={() => copyVoucherCode(voucher.code || `#${voucher.id}`)}
                            disabled={voucher.status !== 'issued'}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div style={{ color: secondaryTextColor }}>
                          <p>Issued: {new Date(voucher.issuedAt).toLocaleDateString()}</p>
                          {voucher.expiresAt && <p>Expires: {new Date(voucher.expiresAt).toLocaleDateString()}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // No Vouchers Yet... component
              <Card style={{ backgroundColor: cardBgColor, borderColor: borderColor }}>
                <CardContent className="p-12 text-center">
                    <Gift className="w-16 h-16 mx-auto mb-4" style={{ color: secondaryTextColor }} />
                    <h3 className="text-xl mb-2" style={{ color: textColor }}>No Vouchers Yet</h3>
                    <p className="mb-4" style={{ color: secondaryTextColor }}>
                        Redeem new items from the 'Available Vouchers' tab.
                    </p>
                    <Button onClick={() => setActiveTab('available')} className="bg-[#FFA1A3] hover:bg-[#FF8A8C] text-white">
                        Browse Vouchers
                    </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
