import React, { useState, useRef } from 'react';
import { BusinessOwner } from '../../data/mockBusinessOwnerData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { Upload, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUserBusinesses } from '../../hooks/useUserBusinesses';


interface EditBusinessProfileDialogProps {
  businessOwner: BusinessOwner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedBusiness: BusinessOwner) => void;
}


const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PAYMENT_OPTIONS = ['Cash', 'Credit/Debit Card', 'PayNow', 'Digital Wallets (Apple/Google/Samsung/GrabPay)'];


export function EditBusinessProfileDialog({
  businessOwner,
  open,
  onOpenChange,
  onSave,
}: EditBusinessProfileDialogProps) {
  const [formData, setFormData] = useState<BusinessOwner>(businessOwner);
  const [previewUrl, setPreviewUrl] = useState<string | null>(businessOwner.wallpaper || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setAvatarUrl = useAuthStore((state) => state.setAvatarUrl);
  const businessMode = useAuthStore((state) => state.businessMode);
  const { refetch: refetchBusinesses } = useUserBusinesses();

  // Debug: Log the businessOwner data
  console.log('📦 BusinessOwner data:', businessOwner);
  console.log('🏢 Current Business UEN:', businessMode.currentBusinessUen);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the backend to save business changes
      const response = await fetch('http://localhost:3000/api/update-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uen: businessMode.currentBusinessUen, // ✅ Use the UEN from business mode
          businessName: formData.businessName,
          businessCategory: formData.category,
          description: formData.description,
          address: formData.address,
          email: formData.businessEmail,
          phoneNumber: formData.phone,
          websiteLink: formData.website || '',
          socialMediaLink: formData.socialMedia || '',
          wallpaper: formData.wallpaper || '',
          priceTier: formData.priceTier,
          offersDelivery: formData.offersDelivery,
          offersPickup: formData.offersPickup,
          paymentOptions: formData.paymentOptions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update business');
      }

      // Update avatar in store so sidebar updates
      if (formData.wallpaper) {
        setAvatarUrl(formData.wallpaper);
      }

      // Refetch businesses to update the dropdown
      await refetchBusinesses();

      onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating business:', error);
      alert('Failed to update business profile');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const urlResponse = await fetch(`http://localhost:3000/api/url-generator?filename=${encodeURIComponent(file.name)}`);
      if (!urlResponse.ok) throw new Error('Failed to get upload URL');
      const { uploadUrl } = await urlResponse.json();

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload image');

      const blobUrl = uploadUrl.split('?')[0];
      setPreviewUrl(blobUrl);
      setFormData((prev: BusinessOwner) => ({ ...prev, wallpaper: blobUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveWallpaper = () => {
    setPreviewUrl(null);
    setFormData((prev: BusinessOwner) => ({ ...prev, wallpaper: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };


  const handleChange = (field: keyof BusinessOwner, value: any) => {
    setFormData((prev: BusinessOwner) => ({ ...prev, [field]: value }));
  };


  const handleDayToggle = (day: string) => {
    setFormData((prev: BusinessOwner) => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(day)
        ? prev.operatingDays.filter(d => d !== day)
        : [...prev.operatingDays, day]
    }));
  };


  const handlePaymentToggle = (payment: string) => {
    setFormData((prev: BusinessOwner) => ({
      ...prev,
      paymentOptions: prev.paymentOptions.includes(payment)
        ? prev.paymentOptions.filter(p => p !== payment)
        : [...prev.paymentOptions, payment]
    }));
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Business Profile</DialogTitle>
          <DialogDescription>
            Update your business information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="edit-business-form" className="overflow-hidden flex flex-col">
          <div className="overflow-y-auto pr-4" style={{ maxHeight: 'calc(85vh - 180px)' }}>
            <div className="space-y-6 py-2">
              {/* Business Information */}
              <div className="space-y-3">
                <h3>Business Information</h3>
                <Separator />

                {/* Wallpaper Upload */}
                <div className="space-y-2">
                  <Label>Business Image (Wallpaper)</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-200">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Business preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={triggerFileInput}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : previewUrl ? 'Change' : 'Upload'}
                      </Button>
                      {previewUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveWallpaper}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: Landscape image, max 5MB
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    required
                    className="bg-input-background"
                  />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                    className="bg-input-background"
                  />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="bg-input-background"
                  />
                </div>


                <div className="space-y-2">
                  <Label>Operating Days</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {DAYS_OF_WEEK.map(day => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${day}`}
                          checked={formData.operatingDays.includes(day)}
                          onCheckedChange={() => handleDayToggle(day)}
                        />
                        <label htmlFor={`edit-${day}`} className="text-sm cursor-pointer">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              {/* Contact Information */}
              <div className="space-y-3">
                <h3>Contact Information</h3>
                <Separator />


                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => handleChange('businessEmail', e.target.value)}
                    required
                    className="bg-input-background"
                  />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                    className="bg-input-background"
                  />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="bg-input-background"
                  />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="socialMedia">Social Media</Label>
                  <Input
                    id="socialMedia"
                    type="url"
                    value={formData.socialMedia}
                    onChange={(e) => handleChange('socialMedia', e.target.value)}
                    className="bg-input-background"
                  />
                </div>
              </div>


              {/* Business Settings */}
              <div className="space-y-3">
                <h3>Business Settings</h3>
                <Separator />


                <div className="space-y-2">
                  <Label htmlFor="priceTier">Price Tier</Label>
                  <Select
                    value={formData.priceTier}
                    onValueChange={(value: string) => handleChange('priceTier', value)}
                  >
                    <SelectTrigger className="bg-input-background">
                      <SelectValue placeholder="Select price tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">$ - Budget Friendly</SelectItem>
                      <SelectItem value="$$">$$ - Moderate</SelectItem>
                      <SelectItem value="$$$">$$$ - Upscale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div className="space-y-3">
                  <Label>Service Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-delivery"
                        checked={formData.offersDelivery}
                        onCheckedChange={(checked: boolean) => handleChange('offersDelivery', checked)}
                      />
                      <label htmlFor="edit-delivery" className="cursor-pointer">
                        Offers Delivery
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-pickup"
                        checked={formData.offersPickup}
                        onCheckedChange={(checked: boolean) => handleChange('offersPickup', checked)}
                      />
                      <label htmlFor="edit-pickup" className="cursor-pointer">
                        Offers Pickup
                      </label>
                    </div>
                  </div>
                </div>


                <div className="space-y-3">
                  <Label>Payment Options</Label>
                  <div className="bg-input-background rounded-md p-4">
                    <div className="space-y-3">
                      {PAYMENT_OPTIONS.map(payment => (
                        <div key={payment} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-payment-${payment}`}
                            checked={formData.paymentOptions.includes(payment)}
                            onCheckedChange={() => handlePaymentToggle(payment)}
                          />
                          <label htmlFor={`edit-payment-${payment}`} className="text-sm cursor-pointer flex-1">
                            {payment}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-foreground">
              Cancel
            </Button>
            <Button type="submit" form="edit-business-form">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
