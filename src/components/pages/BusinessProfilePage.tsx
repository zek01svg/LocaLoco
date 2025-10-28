import React, { useState } from 'react';
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Instagram, 
  Edit2,
  DollarSign,
  Truck,
  ShoppingBag,
  CreditCard,
  Clock
} from 'lucide-react';
import { BusinessOwner } from '../../data/mockBusinessOwnerData';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { EditBusinessProfileDialog } from './EditBusinessProfileDialog';
import { toast } from 'sonner@2.0.3';

interface BusinessProfilePageProps {
  businessOwner: BusinessOwner;
  onBack: () => void;
  onUpdateBusiness: (updatedBusiness: BusinessOwner) => void;
  isDarkMode?: boolean;
}

export function BusinessProfilePage({
  businessOwner,
  onBack,
  onUpdateBusiness,
  isDarkMode = true,
}: BusinessProfilePageProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleSave = (updatedBusiness: BusinessOwner) => {
    onUpdateBusiness(updatedBusiness);
    toast.success('Business profile updated successfully!');
  };

  const bgColor = isDarkMode ? '#3a3a3a' : '#f9fafb';

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <Card className="p-8 mb-6" style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000' }}>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {getInitials(businessOwner.businessName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl mb-2">{businessOwner.businessName}</h1>
                  <div className="flex flex-col gap-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{businessOwner.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{businessOwner.businessEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{businessOwner.phone}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                  className={isDarkMode ? 'border-white/20 text-white hover:bg-white/10' : 'text-foreground'}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {businessOwner.description && (
                <>
                  <Separator className="my-4" />
                  <p className="text-muted-foreground">{businessOwner.description}</p>
                </>
              )}
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Business Details */}
          <Card className="p-6" style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000' }}>
            <h2 className="mb-4">Business Details</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Price Tier</span>
                </div>
                <Badge variant="secondary" className={isDarkMode ? 'bg-[#3a3a3a] text-white' : ''}>
                  {businessOwner.priceTier} - {
                    businessOwner.priceTier === '$' ? 'Budget Friendly' :
                    businessOwner.priceTier === '$$' ? 'Moderate' :
                    businessOwner.priceTier === '$$$' ? 'Upscale' :
                    'Fine Dining'
                  }
                </Badge>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Operating Days</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {businessOwner.operatingDays.map(day => (
                    <Badge key={day} variant="outline" className={isDarkMode ? 'border-white/20 text-white' : ''}>
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3">Service Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    <span className={businessOwner.offersDelivery ? '' : 'text-muted-foreground line-through'}>
                      Delivery {businessOwner.offersDelivery ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                    <span className={businessOwner.offersPickup ? '' : 'text-muted-foreground line-through'}>
                      Pickup {businessOwner.offersPickup ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact & Links */}
          <Card className="p-6" style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000' }}>
            <h2 className="mb-4">Contact & Links</h2>
            <div className="space-y-4">
              {businessOwner.website && (
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">Website</span>
                  </div>
                  <a 
                    href={businessOwner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {businessOwner.website}
                  </a>
                </div>
              )}

              {businessOwner.socialMedia && (
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Instagram className="w-4 h-4" />
                    <span className="text-sm">Social Media</span>
                  </div>
                  <a 
                    href={businessOwner.socialMedia} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {businessOwner.socialMedia}
                  </a>
                </div>
              )}

              <Separator />

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Payment Options</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {businessOwner.paymentOptions.map(payment => (
                    <Badge key={payment} variant="secondary" className={isDarkMode ? 'bg-[#3a3a3a] text-white' : ''}>
                      {payment}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Business Wallpaper Preview */}
        {businessOwner.wallpaper && (
          <Card className="p-6 mt-6" style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000' }}>
            <h2 className="mb-4">Business Wallpaper</h2>
            <div className="rounded-lg overflow-hidden">
              <img 
                src={businessOwner.wallpaper} 
                alt={`${businessOwner.businessName} wallpaper`}
                className="w-full h-64 object-cover"
              />
            </div>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <EditBusinessProfileDialog
        businessOwner={businessOwner}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
}
