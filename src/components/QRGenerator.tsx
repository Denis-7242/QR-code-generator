import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Palette, Square, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface QRGeneratorProps {}

const QRGenerator: React.FC<QRGeneratorProps> = () => {
  const [inputText, setInputText] = useState('https://lovable.dev');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [size, setSize] = useState<string>('256');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text or URL');
      return;
    }

    setIsGenerating(true);
    
    try {
      const options = {
        width: parseInt(size),
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      };

      const dataUrl = await QRCode.toDataURL(inputText, options);
      setQrCodeDataUrl(dataUrl);
      toast.success('QR Code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) {
      toast.error('Please generate a QR code first');
      return;
    }

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded!');
  };

  const copyQRCode = async () => {
    if (!qrCodeDataUrl) {
      toast.error('Please generate a QR code first');
      return;
    }

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();
      
      // Copy to clipboard using the Clipboard API
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      toast.success('QR Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy QR code:', error);
      // Fallback: copy the data URL as text
      try {
        await navigator.clipboard.writeText(qrCodeDataUrl);
        toast.success('QR Code image data copied as text!');
      } catch (fallbackError) {
        toast.error('Failed to copy QR code to clipboard');
      }
    }
  };

  const shareQRCode = async () => {
    if (!qrCodeDataUrl) {
      toast.error('Please generate a QR code first');
      return;
    }

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        // Convert data URL to blob for sharing
        const response = await fetch(qrCodeDataUrl);
        const blob = await response.blob();
        const file = new File([blob], `qr-code-${Date.now()}.png`, { type: 'image/png' });

        await navigator.share({
          title: 'QR Code',
          text: `QR Code for: ${inputText}`,
          files: [file]
        });
        
        toast.success('QR Code shared successfully!');
      } else {
        // Fallback: copy share text to clipboard
        const shareText = `Check out this QR code for: ${inputText}\n\nGenerated with QR Code Generator`;
        await navigator.clipboard.writeText(shareText);
        toast.success('Share text copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share QR code:', error);
      toast.error('Failed to share QR code');
    }
  };

  // Auto-generate QR code when inputs change
  useEffect(() => {
    if (inputText.trim()) {
      const debounceTimer = setTimeout(() => {
        generateQRCode();
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [inputText, size, foregroundColor, backgroundColor]);

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            QR Code Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Create beautiful QR codes instantly. Enter your text, customize the appearance, and download your QR code.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-qr-primary" />
                Customize Your QR Code
              </CardTitle>
              <CardDescription>
                Enter your content and customize the appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <Label htmlFor="text-input">Text or URL</Label>
                <Input
                  id="text-input"
                  placeholder="Enter text, URL, or any data..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>

              {/* Size Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  Size
                </Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">Small (128px)</SelectItem>
                    <SelectItem value="256">Medium (256px)</SelectItem>
                    <SelectItem value="512">Large (512px)</SelectItem>
                    <SelectItem value="1024">Extra Large (1024px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Customization */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fg-color">Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fg-color"
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-16 h-12 p-1 cursor-pointer"
                    />
                    <Input
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-16 h-12 p-1 cursor-pointer"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateQRCode}
                disabled={isGenerating || !inputText.trim()}
                className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {isGenerating ? 'Generating...' : 'Generate QR Code'}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Preview & Download</CardTitle>
              <CardDescription>
                Your generated QR code will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              {/* QR Code Preview */}
              <div className="w-full flex justify-center">
                {qrCodeDataUrl ? (
                  <div className="p-4 bg-white rounded-lg shadow-inner">
                    <img
                      src={qrCodeDataUrl}
                      alt="Generated QR Code"
                      className="max-w-full h-auto rounded"
                      style={{ maxWidth: '300px' }}
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-lg opacity-20"></div>
                      <p>Your QR code will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-3">
                <Button
                  onClick={downloadQRCode}
                  disabled={!qrCodeDataUrl}
                  className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={copyQRCode}
                    disabled={!qrCodeDataUrl}
                    variant="outline"
                    className="h-12 border-qr-primary text-qr-primary hover:bg-qr-primary hover:text-white transition-all duration-300"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  
                  <Button
                    onClick={shareQRCode}
                    disabled={!qrCodeDataUrl}
                    variant="outline"
                    className="h-12 border-qr-secondary text-qr-secondary hover:bg-qr-secondary hover:text-white transition-all duration-300"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Info */}
              {qrCodeDataUrl && (
                <div className="text-center text-sm text-muted-foreground">
                  <p>Size: {size}x{size} pixels</p>
                  <p>Format: PNG</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-muted-foreground">
          <p>Create QR codes for URLs, text, contact info, Wi-Fi passwords, and more!</p>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;