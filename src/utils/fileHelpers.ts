// File upload and download helpers for study materials and homework submissions

export const readFileAsBase64 = (file: File): Promise<{ base64: string; name: string; size: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const sizeInMB = file.size / (1024 * 1024);
      const sizeStr = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
      resolve({
        base64,
        name: file.name,
        size: sizeStr,
      });
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export const fileToBase64 = async (file: File): Promise<string> => {
  const result = await readFileAsBase64(file);
  return result.base64;
};

export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 KB';
  const sizeInMB = bytes / (1024 * 1024);
  if (sizeInMB >= 1) return `${sizeInMB.toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
};

export const downloadFile = (fileNameOrUrl: string, explicitFileName?: string) => {
  // If first param is data URL and second is file name
  const dataUrl = explicitFileName ? fileNameOrUrl : undefined;
  const fileName = explicitFileName || fileNameOrUrl;

  if (!dataUrl) {
    // Generate a downloadable text/document representation if dummy file
    const sampleText = `AVNEET MATHS HUB - OFFLINE MATHEMATICS COACHING
Teacher: Mr. Avneet Chauhan (B.Ed, M.Sc Mathematics, CTET)
Location: Rohalki Kishanpur, Bahadrabad (PIN: 249402)
Phone/WhatsApp: +91 9528665136

Document: ${fileName}
Generated for student study & offline practice.

“The only way to learn mathematics is to do mathematics.”`;
    const blob = new Blob([sampleText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.pdf') ? fileName.replace('.pdf', '.txt') : fileName;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  // Real data URL
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const generateWhatsAppLink = (phone: string, text: string): string => {
  // Clean phone number (strip spaces, dashes, +)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};
