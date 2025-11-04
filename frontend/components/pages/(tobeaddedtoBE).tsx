// const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
  
//     // Validate file
//     if (!file.type.startsWith('image/')) {
//       alert('Please upload an image file');
//       return;
//     }
  
//     if (file.size > 5 * 1024 * 1024) {
//       alert('Image size should be less than 5MB');
//       return;
//     }
  
//     setUploading(true);
  
//     try {
//       // Create FormData for upload
//       const formData = new FormData();
//       formData.append('avatar', file);
//       formData.append('userId', user.id);
  
//       // Upload to your backend
//       const response = await fetch('/api/upload-avatar', {
//         method: 'POST',
//         body: formData,
//       });
  
//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }
  
//       const data = await response.json();
//       const avatarUrl = data.url; // URL returned from backend
  
//       // Update preview and form data
//       setPreviewUrl(avatarUrl);
//       setFormData((prev) => ({ ...prev, avatarUrl }));
//       setUploading(false);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       alert('Failed to upload image');
//       setUploading(false);
//     }
//   };
  