import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUser } from '../hooks/useUser';
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
import { Voucher } from '../types/vouchers';
import { availableVouchers } from '../data/voucherdata';
import { toast } from 'sonner';
import { useThemeStore } from '../store/themeStore';

// --- Helper Function ---
// Moved outside the main component to be accessible by the card components.
const getIcon = (iconName: string) => {
  const icons: { [key: string]: React.ElementType } = {
    DollarSign, Tag, Percent, Gift, Sparkles, Coffee, Star, Crown,
  };
  return icons[iconName] || Gift;
};

// --- Child Components ---

// CARD FOR AVAILABLE VOUCHERS
const AvailableVoucherCard = ({ 
  voucher, 
  onRedeem, 
  canAfford,
  isDarkMode,
  styles 
}: { 
  voucher: Voucher; 
  onRedeem: () => void; 
  canAfford: boolean;
  isDarkMode: boolean;
  styles: any;
}) => {
  const Icon = getIcon(voucher.icon);
  return (
    <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: styles.cardBgColor, borderColor: styles.borderColor }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${voucher.color}20` }}>
            <Icon className="w-6 h-6" style={{ color: voucher.color }} />
          </div>
          {voucher.isPopular && (
            <Badge className="bg-[#FFA1A3] text-white"><TrendingUp className="w-3 h-3 mr-1" />Popular</Badge>
          )}
        </div>
        <CardTitle className="mt-3" style={{ color: styles.textColor }}>{voucher.title}</CardTitle>
        <CardDescription style={{ color: styles.secondaryTextColor }}>{voucher.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {voucher.minSpend && (
            <div className="flex items-center gap-2 text-sm" style={{ color: styles.secondaryTextColor }}><AlertCircle className="w-4 h-4" /><span>Min. spend: ${voucher.minSpend}</span></div>
          )}
          <div className="flex items-center gap-2 text-sm" style={{ color: styles.secondaryTextColor }}><Clock className="w-4 h-4" /><span>Valid for {voucher.expiryDays} days after redemption</span></div>
        </div>
        <Separator style={{ backgroundColor: styles.borderColor }} />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm" style={{ color: styles.secondaryTextColor }}>Points Required</p>
            <p className="text-2xl" style={{ color: styles.textColor }}>{voucher.pointsCost}</p>
          </div>
          <Button onClick={onRedeem} disabled={!canAfford} className="bg-[#FFA1A3] hover:bg-[#FF8A8C] text-white disabled:opacity-50">
            {canAfford ? 'Redeem' : 'Not Enough Points'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// CARD FOR VOUCHERS USER OWNS
const UserVoucherCard = ({ 
  voucher,
  isDarkMode,
  styles 
}: { 
  voucher: any;
  isDarkMode: boolean;
  styles: any;
}) => {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };
  return (
    <Card className={voucher.status !== 'issued' ? 'opacity-60' : ''} style={{ backgroundColor: styles.cardBgColor, borderColor: styles.borderColor }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 161, 163, 0.2)' }}>
            <DollarSign className="w-6 h-6 text-[#FFA1A3]" />
          </div>
          <Badge className={
            voucher.status === 'used' ? 'bg-green-600 text-white' :
            voucher.status === 'expired' ? 'bg-gray-600 text-white' :
            voucher.status === 'revoked' ? 'bg-red-600 text-white' :
            'bg-[#FFA1A3] text-white'
          }>
            {voucher.status === 'used' && <CheckCircle2 className="w-3 h-3 mr-1" />}
            {voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1)}
          </Badge>
        </div>
        <CardTitle className="mt-3" style={{ color: styles.textColor }}>${voucher.amount} Voucher</CardTitle>
        <CardDescription style={{ color: styles.secondaryTextColor }}>{voucher.title || 'Reward Voucher'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm" style={{ color: styles.secondaryTextColor }}>Voucher Code</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-lg text-center tracking-wider text-sm" style={{ backgroundColor: styles.accentBgColor, color: styles.textColor }}>
              {voucher.referralCode || `#${voucher.id}`}
            </code>
            <Button variant="outline" size="sm" onClick={() => copyCode(voucher.code || `#${voucher.id}`)} disabled={voucher.status !== 'issued'}>
              <Copy className="w-4 h-4" />
            </Button>
          </div> 
        </div>
        <div className="flex items-center justify-between text-sm">
          <div style={{ color: styles.secondaryTextColor }}>
            <p>Issued: {new Date(voucher.issuedAt).toLocaleDateString()}</p>
            {voucher.expiresAt && <p>Expires: {new Date(voucher.expiresAt).toLocaleDateString()}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


// --- MAIN VOUCHERS PAGE COMPONENT ---
export function VouchersPage({ initialTab = 'available' }: { initialTab?: 'available' | 'my-vouchers' }) {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);
  const { stats, mutate: mutateUser } = useUser(userId);
  const currentPoints = stats?.loyaltyPoints || 0;

  
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [myVouchers, setMyVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyVouchers = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      setLoading(true);
      const data = await getVouchers({ userId, status: 'issued', limit: 100 });
      setMyVouchers(data.vouchers || []);
    } catch (error) {
      console.error('Error fetching voucherfs:', error);
      toast.error('Failed to load your vouchers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyVouchers(); }, [userId]);

  const styles = {
    bgColor: isDarkMode ? '#3a3a3a' : '#f9fafb',
    cardBgColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    textColor: isDarkMode ? '#ffffff' : '#000000',
    secondaryTextColor: isDarkMode ? '#a3a3a3' : '#6b7280',
    borderColor: isDarkMode ? '#404040' : '#e5e7eb',
    accentBgColor: isDarkMode ? '#4a4a4a' : '#f3f4f6',
  };

  if (role !== 'user') {
    return (
        <div className="min-h-screen p-4 md:p-6 flex items-center justify-center" style={{ backgroundColor: styles.bgColor }}>
          <Card className="max-w-md w-full" style={{ backgroundColor: styles.cardBgColor, borderColor: styles.borderColor }}>
            <CardContent className="p-12 text-center">
              <Gift className="w-16 h-16 mx-auto mb-4 text-[#FFA1A3]" />
              <h2 className="text-2xl font-semibold mb-2" style={{ color: styles.textColor }}>Access Restricted</h2>
              <p className="mb-6" style={{ color: styles.secondaryTextColor }}>Vouchers are only for users.</p>
              <Button onClick={() => navigate(-1)} className="bg-[#FFA1A3] hover:bg-[#FF8A8C] text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      );
  }

  const handleRedeemVoucher = async (voucher: Voucher) => {
    if (!userId) { toast.error("You must be logged in."); return; }
    if (currentPoints < voucher.pointsCost) {
      toast.error('Not enough points');
      return;
    }

    const redemptionPromise = async () => {
      // Call the backend API to perform the redemption.
      await redeemVoucherOnBackend({ userId, voucherId: voucher.id, pointsCost: voucher.pointsCost });
      
      // ✅ After success, trigger a re-fetch of BOTH the voucher list AND the user data (for points).
      // `Promise.all` runs these in parallel for efficiency.
      await Promise.all([
        fetchMyVouchers(),
        mutateUser() // This tells the useUser hook to re-fetch its data.
      ]);
    };

    toast.promise(redemptionPromise, {
      loading: 'Redeeming voucher...',
      success: 'Voucher redeemed! Check the "My Vouchers" tab.',
      error: (err) => err.response?.data?.message || 'Failed to redeem voucher.',
    });
    
    setActiveTab('my-vouchers');
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: styles.bgColor }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} style={{ color: styles.textColor, borderColor: styles.borderColor }} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <div>
              <h1 className="text-3xl" style={{ color: styles.textColor }}>Vouchers</h1>
              <p style={{ color: styles.secondaryTextColor }}>Redeem vouchers with your loyalty points</p>
            </div>
          </div>
          <Card style={{ backgroundColor: styles.cardBgColor, borderColor: styles.borderColor }}>
            <CardContent className="p-4">
              <p className="text-sm mb-1" style={{ color: styles.secondaryTextColor }}>Your Points</p>
              <p className="text-2xl text-[#FFA1A3]">{currentPoints}</p>
            </CardContent>
          </Card>
        </div>
        
        <Alert style={{ backgroundColor: styles.cardBgColor, borderColor: styles.borderColor }}>
          <AlertCircle className="w-4 h-4 text-[#FFA1A3]" />
          <AlertDescription style={{ color: styles.textColor }}>Use these vouchers at any participating business by showing your code at checkout.</AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available ({availableVouchers.length})</TabsTrigger>
            <TabsTrigger value="my-vouchers">My Vouchers ({myVouchers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableVouchers.map((voucher) => (
                <AvailableVoucherCard 
                  key={voucher.id} 
                  voucher={voucher}
                  onRedeem={() => handleRedeemVoucher(voucher)}
                  canAfford={currentPoints >= voucher.pointsCost}
                  isDarkMode={isDarkMode}
                  styles={styles}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-vouchers" className="space-y-6 mt-6">
            {loading ? (
              <p className="text-center py-12" style={{color: styles.secondaryTextColor}}>Loading your vouchers...</p>
            ) : myVouchers.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myVouchers.map((voucher) => (
                  <UserVoucherCard 
                    key={voucher.id} 
                    voucher={voucher}
                    isDarkMode={isDarkMode}
                    styles={styles}
                  />
                ))}
              </div>
            ) : (
              <Card style={{ backgroundColor: styles.cardBgColor, borderColor: styles.borderColor }}>
                <CardContent className="p-12 text-center">
                    <Gift className="w-16 h-16 mx-auto mb-4" style={{ color: styles.secondaryTextColor }} />
                    <h3 className="text-xl mb-2" style={{ color: styles.textColor }}>No Vouchers Yet</h3>
                    <p className="mb-4" style={{ color: styles.secondaryTextColor }}>Redeem new items from the 'Available Vouchers' tab.</p>
                    <Button onClick={() => setActiveTab('available')} className="bg-[#FFA1A3] hover:bg-[#FF8A8C] text-white">Browse Vouchers</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
