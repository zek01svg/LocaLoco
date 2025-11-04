// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../store/authStore';
// import { useUser } from '../hooks/useUser';
// import { getVouchers } from '../types/ref';
// import { 
//   ArrowLeft, 
//   DollarSign, 
//   Tag, 
//   Percent, 
//   Gift, 
//   Sparkles, 
//   Coffee, 
//   Star,
//   Crown,
//   TrendingUp,
//   CheckCircle2,
//   Clock,
//   Copy,
//   AlertCircle,
// } from 'lucide-react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import { Separator } from './ui/separator';
// import { Alert, AlertDescription } from './ui/alert';
// import { Voucher, RedeemedVoucher } from '../types/vouchers';
// import { toast } from 'sonner';
// import { useThemeStore } from '../store/themeStore';
// import { useUserPointsStore } from '../store/userStore';

// interface VouchersPageProps {
//   initialTab?: 'available' | 'my-vouchers';
// }

// export function VouchersPage({
//   initialTab = 'available',
// }: VouchersPageProps) {
//   const navigate = useNavigate();
//   const role = useAuthStore((state) => state.role);
//   const userId = useAuthStore((state) => state.userId);
//   const { stats } = useUser(userId);
//   const currentPoints = stats.loyaltyPoints;
//   const setZustandPoints = useUserPointsStore((state) => state.setPoints);
//   const deductPoints = useUserPointsStore((state) => state.deductPoints);
//   const isDarkMode = useThemeStore(state => state.isDarkMode);

//   useEffect(() => {
//     setZustandPoints(currentPoints);
//   }, [currentPoints, setZustandPoints]);

//   const [activeTab, setActiveTab] = useState(initialTab);
//   const [myVouchers, setMyVouchers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch user vouchers from database
//   useEffect(() => {
//     const fetchVouchers = async () => {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const data = await getVouchers({
//           userId,
//           status: 'issued',
//           limit: 100
//         });
//         console.log('📦 Fetched vouchers from database:', data);
//         setMyVouchers(data.vouchers || []);
//       } catch (error) {
//         console.error('Error fetching vouchers:', error);
//         toast.error('Failed to load your vouchers');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVouchers();
//   }, [userId]);

// //   const [redeemedVouchers, setRedeemedVouchers] = useState<RedeemedVoucher[]>(mockRedeemedVouchers);

//   // Color variables for dark/light mode
//   const bgColor = isDarkMode ? '#3a3a3a' : '#f9fafb';
//   const cardBgColor = isDarkMode ? '#2a2a2a' : '#ffffff';
//   const textColor = isDarkMode ? '#ffffff' : '#000000';
//   const secondaryTextColor = isDarkMode ? '#a3a3a3' : '#6b7280';
//   const borderColor = isDarkMode ? '#404040' : '#e5e7eb';
//   const accentBgColor = isDarkMode ? '#4a4a4a' : '#f3f4f6';

//   // ✅ Restrict access to users only
//   if (role !== 'user') {
//     return (
//       <div className="min-h-screen p-4 md:p-6 flex items-center justify-center" 
//            style={{ backgroundColor: bgColor }}>
//         <Card className="max-w-md w-full" style={{ backgroundColor: cardBgColor, borderColor: borderColor }}>
//           <CardContent className="p-12 text-center">
//             <Gift className="w-16 h-16 mx-auto mb-4 text-[#FFA1A3]" />
//             <h2 className="text-2xl font-semibold mb-2" style={{ color: textColor }}>
//               Access Restricted
//             </h2>
//             <p className="mb-6" style={{ color: secondaryTextColor }}>
//               Vouchers are only available for regular users, not business accounts.
//             </p>
//             <Button
//               onClick={() => navigate(-1)}
//               className="bg-[#FFA1A3] hover:bg-[#FF8A8C] text-white"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Go Back
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const getIcon = (iconName: string) => {
//     const icons: { [key: string]: any } = {
//       DollarSign,
//       Tag,
//       Percent,
//       Gift,
//       Sparkles,
//       Coffee,
//       Star,
//       Crown,
//     };
//     return icons[iconName] || Gift;
//   };

//   const handleRedeemVoucher = (voucher: Voucher) => {
//     console.log('handleRedeemVoucher called:', {
//       voucher: voucher.title,
//       currentPoints,
//       pointsCost: voucher.pointsCost,
//       canAfford: currentPoints >= voucher.pointsCost
//     });

//     if (currentPoints < voucher.pointsCost) {
//       toast.error('Not enough points', {
//         description: `You need ${voucher.pointsCost - currentPoints} more points to redeem this voucher.`,
//       });
//       return;
//     }

//     // Create redemption date and expiry date
//     const redemptionDate = new Date();
//     const expiryDate = new Date();
//     expiryDate.setDate(expiryDate.getDate() + voucher.expiryDays);

//     // Generate a voucher code
//     const code = `LL${voucher.id.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

//     const newRedeemedVoucher: RedeemedVoucher = {
//       id: `r${Date.now()}`,
//       voucherId: voucher.id,
//       voucher,
//       redemptionDate: redemptionDate.toISOString(),
//       expiryDate: expiryDate.toISOString(),
//       code,
//       isUsed: false,
//     };

//     // setRedeemedVouchers([newRedeemedVoucher, ...redeemedVouchers]);
//     deductPoints(voucher.pointsCost);
//     setActiveTab('my-vouchers');
    
//     console.log('Redeeming voucher and showing toast');
//     toast.success('Voucher redeemed!', {
//       description: `${voucher.title} has been added to your vouchers.`,
//     });
//   };

//   const copyVoucherCode = async (code: string) => {
//     try {
//       console.log('🔍 Copy button clicked!', code);

//       // Try modern clipboard API first
//       if (navigator.clipboard && navigator.clipboard.writeText) {
//         await navigator.clipboard.writeText(code);
//         toast.success('Copied!', {
//           description: 'Voucher code copied to clipboard.',
//         });
//       } else {
//         // Fallback for browsers that don't support clipboard API
//         copyToClipboardFallback(code);
//       }
//     } catch (error) {
//       // If clipboard API fails, use fallback method
//       copyToClipboardFallback(code);
//     }
//   };

//   const copyToClipboardFallback = (text: string) => {
//     try {
//       const textArea = document.createElement('textarea');
//       textArea.value = text;
//       textArea.style.position = 'fixed';
//       textArea.style.left = '-999999px';
//       textArea.style.top = '-999999px';
//       document.body.appendChild(textArea);
//       textArea.focus();
//       textArea.select();
      
//       const successful = document.execCommand('copy');
//       document.body.removeChild(textArea);
      
//       if (successful) {
//         toast.success('Copied!', {
//           description: 'Voucher code copied to clipboard.',
//         });
//       } else {
//         toast.error('Copy failed', {
//           description: 'Please manually copy the voucher code.',
//         });
//       }
//     } catch (error) {
//       toast.error('Copy failed', {
//         description: 'Please manually copy the voucher code.',
//       });
//     }
//   };

//   const VoucherCard = ({ voucher }: { voucher: Voucher }) => {
//     const Icon = getIcon(voucher.icon);
//     const canAfford = currentPoints >= voucher.pointsCost;

//     return (
//       <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: cardBgColor, borderColor: borderColor }}>
//         <CardHeader className="pb-3">
//           <div className="flex items-start justify-between">
//             <div 
//               className="p-3 rounded-lg" 
//               style={{ backgroundColor: `${voucher.color}20` }}
//             >
//               <Icon className="w-6 h-6" style={{ color: voucher.color }} />
//             </div>
//             {voucher.isPopular && (
//               <Badge className="bg-[#FFA1A3] text-white">
//                 <TrendingUp className="w-3 h-3 mr-1" />
//                 Popular
//               </Badge>
//             )}
//           </div>
//           <CardTitle className="mt-3" style={{ color: textColor }}>{voucher.title}</CardTitle>
//           <CardDescription style={{ color: secondaryTextColor }}>
//             {voucher.description}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             {voucher.minSpend && (
//               <div className="flex items-center gap-2 text-sm" style={{ color: secondaryTextColor }}>
//                 <AlertCircle className="w-4 h-4" />
//                 <span>Min. spend: ${voucher.minSpend}</span>
//               </div>
//             )}
//             <div className="flex items-center gap-2 text-sm" style={{ color: secondaryTextColor }}>
//               <Clock className="w-4 h-4" />
//               <span>Valid for {voucher.expiryDays} days after redemption</span>
//             </div>
//           </div>

//           <Separator style={{ backgroundColor: borderColor }} />

//           <div className="flex items-center justify-between">
//             <div className="space-y-1">
//               <p className="text-sm" style={{ color: secondaryTextColor }}>Points Required</p>
//               <p className="text-2xl" style={{ color: textColor }}>{voucher.pointsCost}</p>
//             </div>
//             <Button
//               onClick={() => handleRedeemVoucher(voucher)}
//               disabled={!canAfford}
//               className="bg-[#FFA1A3] hover:bg-[#FF8A8C] text-white disabled:opacity-50"
//             >
//               {canAfford ? 'Redeem' : 'Not Enough Points'}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   const RedeemedVoucherCard = ({ redeemedVoucher }: { redeemedVoucher: RedeemedVoucher }) => {
//     const Icon = getIcon(redeemedVoucher.voucher.icon);
//     const isExpired = new Date(redeemedVoucher.expiryDate) < new Date();
//     const daysLeft = Math.ceil(
//       (new Date(redeemedVoucher.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
//     );

//     return (
//       <Card className={redeemedVoucher.isUsed || isExpired ? 'opacity-60' : ''} style={{ backgroundColor: cardBgColor, borderColor: borderColor }}>
//         <CardHeader className="pb-3">
//           <div className="flex items-start justify-between">
//             <div 
//               className="p-3 rounded-lg" 
//               style={{ backgroundColor: `${redeemedVoucher.voucher.color}20` }}
//             >
//               <Icon className="w-6 h-6" style={{ color: redeemedVoucher.voucher.color }} />
//             </div>
//             {redeemedVoucher.isUsed ? (
//               <Badge className="bg-green-600 text-white">
//                 <CheckCircle2 className="w-3 h-3 mr-1" />
//                 Used
//               </Badge>
//             ) : isExpired ? (
//               <Badge variant="destructive">Expired</Badge>
//             ) : (
//               <Badge className="bg-[#FFA1A3] text-white">Active</Badge>
//             )}
//           </div>
//           <CardTitle className="mt-3" style={{ color: textColor }}>{redeemedVoucher.voucher.title}</CardTitle>
//           <CardDescription style={{ color: secondaryTextColor }}>
//             {redeemedVoucher.voucher.description}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {!redeemedVoucher.isUsed && !isExpired && (
//             <Alert className="border-[#FFA1A3]" style={{ backgroundColor: isDarkMode ? 'rgba(255, 161, 163, 0.15)' : 'rgba(255, 161, 163, 0.1)' }}>
//               <AlertCircle className="w-4 h-4 text-[#FFA1A3]" />
//               <AlertDescription style={{ color: textColor }}>
//                 {daysLeft > 0 ? `Expires in ${daysLeft} days` : 'Expires today'}
//               </AlertDescription>
//             </Alert>
//           )}

//           <div className="space-y-2">
//             <p className="text-sm" style={{ color: secondaryTextColor }}>Voucher Code</p>
//             <div className="flex items-center gap-2">
//               <code className="flex-1 px-3 py-2 rounded-lg text-center tracking-wider" style={{ backgroundColor: accentBgColor, color: textColor }}>
//                 {redeemedVoucher.code}
//               </code>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => copyVoucherCode(redeemedVoucher.code)}
//                 disabled={redeemedVoucher.isUsed || isExpired}
//                 style={{ color: textColor, borderColor: borderColor }}
//                 className={isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}
//               >
//                 <Copy className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>

//           {redeemedVoucher.isUsed && redeemedVoucher.businessUsedAt && (
//             <div className="text-sm" style={{ color: secondaryTextColor }}>
//               <p>Used at: <span style={{ color: textColor }}>{redeemedVoucher.businessUsedAt}</span></p>
//               <p>Used on: {new Date(redeemedVoucher.usedDate!).toLocaleDateString()}</p>
//             </div>
//           )}

//           <div className="flex items-center justify-between text-sm">
//             <div style={{ color: secondaryTextColor }}>
//               <p>Redeemed: {new Date(redeemedVoucher.redemptionDate).toLocaleDateString()}</p>
//               <p>Expires: {new Date(redeemedVoucher.expiryDate).toLocaleDateString()}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <div className="min-h-screen p-4 md:p-6 md:pl-6" style={{ backgroundColor: bgColor }}>
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate(-1)}
//               className={`flex items-center gap-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
//               style={{ 
//                 color: isDarkMode ? '#ffffff' : '#000000',
//                 borderColor: isDarkMode ? '#666666' : borderColor,
//                 fontWeight: 500
//               }}
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back
//             </Button>
//             <div>
//               <h1 className="text-3xl" style={{ color: textColor }}>Vouchers</h1>
//               <p style={{ color: secondaryTextColor }}>
//                 Redeem vouchers with your loyalty points
//               </p>
//             </div>
//           </div>
//           <Card style={{ backgroundColor: cardBgColor, borderColor: borderColor }}>
//             <CardContent className="p-4">
//               <p className="text-sm mb-1" style={{ color: secondaryTextColor }}>Your Points</p>
//               <p className="text-2xl text-[#FFA1A3]">{currentPoints}</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Info Alert */}
//         <Alert style={{ backgroundColor: cardBgColor, borderColor: borderColor }}>
//           <AlertCircle className="w-4 h-4 text-[#FFA1A3]" />
//           <AlertDescription style={{ color: textColor }}>
//             These vouchers can be used at any participating local business in the LocalLoco network. 
//             Show your voucher code at checkout to redeem.
//           </AlertDescription>
//         </Alert>

//         {/* Tabs */}
//         <Tabs 
//           value={activeTab} 
//           onValueChange={(value) => setActiveTab(value as 'available' | 'my-vouchers')}
//           >
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="available">
//               Available Vouchers ({availableVouchers.length})
//             </TabsTrigger>
//             <TabsTrigger value="my-vouchers">
//               My Vouchers ({redeemedVouchers.length})
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="available" className="space-y-6 mt-6">
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {availableVouchers.map((voucher) => (
//                 <VoucherCard key={voucher.id} voucher={voucher} />
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="my-vouchers" className="space-y-6 mt-6">
//             {loading ? (
//               <Card style={{ backgroundColor: cardBgColor, borderColor: borderColor }}>
//                 <CardContent className="p-12 text-center">
//                   <p style={{ color: secondaryTextColor }}>Loading your vouchers...</p>
//                 </CardContent>
//               </Card>
//             ) : myVouchers.length > 0 ? (
//               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {myVouchers.map((voucher, index) => {
//                   console.log('🎫 Voucher data:', voucher);
//                   return (
//                   <Card key={voucher.id || index} style={{ backgroundColor: cardBgColor, borderColor: borderColor }}>
//                     <CardHeader className="pb-3">
//                       <div className="flex items-start justify-between">
//                         <div
//                           className="p-3 rounded-lg"
//                           style={{ backgroundColor: 'rgba(255, 161, 163, 0.2)' }}
//                         >
//                           <DollarSign className="w-6 h-6 text-[#FFA1A3]" />
//                         </div>
//                         <Badge className={
//                           voucher.status === 'used' ? 'bg-green-600 text-white' :
//                           voucher.status === 'expired' ? 'bg-gray-600 text-white' :
//                           voucher.status === 'revoked' ? 'bg-red-600 text-white' :
//                           'bg-[#FFA1A3] text-white'
//                         }>
//                           {voucher.status === 'used' && <CheckCircle2 className="w-3 h-3 mr-1" />}
//                           {voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1)}
//                         </Badge>
//                       </div>
//                       <CardTitle className="mt-3" style={{ color: textColor }}>
//                         ${voucher.amount} Voucher
//                       </CardTitle>
//                       <CardDescription style={{ color: secondaryTextColor }}>
//                         Referral reward voucher
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="space-y-2">
//                         <p className="text-sm" style={{ color: secondaryTextColor }}>
//                           {voucher.referralCode ? 'Referral Code Used' : 'Voucher ID'}
//                         </p>
//                         <div className="flex items-center gap-2">
//                           <code className="flex-1 px-3 py-2 rounded-lg text-center tracking-wider text-sm"
//                                 style={{ backgroundColor: accentBgColor, color: textColor }}>
//                             {voucher.referralCode || `#${voucher.id}`}
//                           </code>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               navigator.clipboard.writeText(voucher.referralCode || `#${voucher.id}`);
//                               toast.success('Code copied to clipboard!');
//                             }}
//                             disabled={voucher.status === 'used' || voucher.status === 'expired'}
//                             style={{ color: textColor, borderColor: borderColor }}
//                             className={isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}
//                           >
//                             <Copy className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between text-sm">
//                         <div style={{ color: secondaryTextColor }}>
//                           <p>Issued: {new Date(voucher.issuedAt).toLocaleDateString()}</p>
//                           {voucher.expiresAt && (
//                             <p>Expires: {new Date(voucher.expiresAt).toLocaleDateString()}</p>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//                 })}
//               </div>
//             ) : (
//               <Card style={{ backgroundColor: cardBgColor, borderColor: borderColor }}>
//                 <CardContent className="p-12 text-center">
//                   <Gift className="w-16 h-16 mx-auto mb-4" style={{ color: secondaryTextColor }} />
//                   <h3 className="text-xl mb-2" style={{ color: textColor }}>No Vouchers Yet</h3>
//                   <p className="mb-4" style={{ color: secondaryTextColor }}>
//                     Redeem vouchers from the Available Vouchers tab to get started!
//                   </p>
//                   <Button 
//                     onClick={() => setActiveTab('available')}
//                     className="bg-[#FFA1A3] hover:bg-[#FF8A8C] text-white"
//                   >
//                     Browse Vouchers
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>
//         </Tabs>

//       </div>
//     </div>
//   );
// }
