import { useRef, useState } from "react"
import { ApplicationSettings } from "../application-manager/add-application-wizard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Image } from "lucide-react"
import { Button } from "../../../../components/ui/button"


export default function ImagesTab({ settings, onSettingsChange }: { settings: ApplicationSettings, onSettingsChange: (settings: ApplicationSettings) => void }) {
    const [selectedLauncherFile, setSelectedLauncherFile] = useState<File | null>(null)
    const [selectedSmallLauncherFile, setSelectedSmallLauncherFile] = useState<File | null>(null) // New state
    const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState<string | false>(false) // Track which upload is happening ('launcher', 'smallLauncher', 'banner', or false)
    const launcherInputRef = useRef<HTMLInputElement>(null)
    const smallLauncherInputRef = useRef<HTMLInputElement>(null) // New ref
    const bannerInputRef = useRef<HTMLInputElement>(null)
  
    // Generic file select handler
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'launcher' | 'smallLauncher' | 'banner') => {
      const file = event.target.files?.[0]
      if (file) {
        if (type === 'launcher') setSelectedLauncherFile(file)
        else if (type === 'smallLauncher') setSelectedSmallLauncherFile(file)
        else if (type === 'banner') setSelectedBannerFile(file)
      }
    }
  
    // Generic upload handler
    const handleUpload = async (type: 'launcher' | 'smallLauncher' | 'banner') => {
      let file: File | null = null
      let stateKey: keyof ApplicationSettings['images'] = 'launcherImage'
      let inputRef: React.RefObject<HTMLInputElement | null> = launcherInputRef
      let setSelectedFile: React.Dispatch<React.SetStateAction<File | null>> = setSelectedLauncherFile
  
      if (type === 'launcher') {
        file = selectedLauncherFile
        stateKey = 'launcherImage'
        inputRef = launcherInputRef
        setSelectedFile = setSelectedLauncherFile
      } else if (type === 'smallLauncher') {
        file = selectedSmallLauncherFile
        stateKey = 'smallLauncherImage'
        inputRef = smallLauncherInputRef
        setSelectedFile = setSelectedSmallLauncherFile
      } else if (type === 'banner') {
        file = selectedBannerFile
        stateKey = 'bannerImage'
        inputRef = bannerInputRef
        setSelectedFile = setSelectedBannerFile
      }
  
      if (!file) return
  
      setIsUploading(type)
      try {
        // Simulate upload using Object URL
        const imageUrl = URL.createObjectURL(file)
  
        onSettingsChange({
          ...settings,
          images: { ...settings.images, [stateKey]: imageUrl }
        })
        setSelectedFile(null) // Clear selection
        if (inputRef.current) {
          inputRef.current.value = '' // Reset file input
        }
      } catch (error) {
        console.error(`Error uploading ${type} image:`, error)
        // TODO: Add user-facing error feedback
      } finally {
        setIsUploading(false)
      }
    }
  
    return (
      <div className="space-y-8">
        {/* Combined Launcher Icons Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Launcher Icons</CardTitle>
            <CardDescription className="text-sm">
              Upload icons displayed in the application launcher (large and small formats).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
  
            {/* Large Launcher Icon Section - Relabeled */}
            <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
              <h3 className="font-medium text-gray-800">Large Launcher Icon</h3>
              <p className="text-xs text-gray-500">Used when space allows (e.g., desktop).</p>
              {/* Preview */}
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-4 min-h-[160px]">
                <div className="relative w-24 h-24">
                  <img
                    src={settings.images.launcherImage}
                    alt="Large launcher icon"
                    className="w-full h-full object-contain"
                  />
                  {settings.images.launcherImage.startsWith('/placeholder') && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 rounded-lg">
                      <Image className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              {/* Upload Controls */}
              <div className="border border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-lg p-3 bg-gray-50/50 hover:bg-blue-50">
                <p className="text-xs text-center text-gray-600 mb-2 truncate px-2">
                  {selectedLauncherFile ? selectedLauncherFile.name : "Select a file (e.g., 80x80px)"}
                </p>
                <input
                  type="file" accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'launcher')}
                  className="hidden"
                  ref={launcherInputRef}
                  aria-label="Upload large launcher icon"
                />
                <div className="flex gap-2">
                  <Button onClick={() => launcherInputRef.current?.click()} variant="outline" size="sm" className="flex-1 text-xs" disabled={isUploading !== false}>Browse</Button>
                  <Button
                    onClick={() => handleUpload('launcher')}
                    size="sm"
                    className="flex-1 text-xs border border-gray-400 bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={isUploading !== false || !selectedLauncherFile}
                  >
                    {isUploading === 'launcher' ? "Uploading..." : "Upload"}
                  </Button>
  
                </div>
              </div>
            </div>
  
            {/* Small Launcher Icon Section - New */}
            <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
              <h3 className="font-medium text-gray-800">Small Launcher Icon</h3>
              <p className="text-xs text-gray-500">Used in compact spaces (e.g., mobile).</p>
              {/* Preview */}
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-4 min-h-[160px]">
                <div className="relative w-16 h-16">
                  <img
                    src={settings.images.smallLauncherImage}
                    alt="Small launcher icon"
                    className="w-full h-full object-contain"
                  />
                  {settings.images.smallLauncherImage.startsWith('/placeholder') && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 rounded-lg">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              {/* Upload Controls */}
              <div className="border border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-lg p-3 bg-gray-50/50 hover:bg-blue-50">
                <p className="text-xs text-center text-gray-600 mb-2 truncate px-2">
                  {selectedSmallLauncherFile ? selectedSmallLauncherFile.name : "Select a file (e.g., 40x40px)"}
                </p>
                <input
                  type="file" accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'smallLauncher')}
                  className="hidden"
                  ref={smallLauncherInputRef}
                  aria-label="Upload small launcher icon"
                />
                <div className="flex gap-2">
                  <Button onClick={() => smallLauncherInputRef.current?.click()} variant="outline" size="sm" className="flex-1 text-xs" disabled={isUploading !== false}>Browse</Button>
                  <Button onClick={() => handleUpload('smallLauncher')} size="sm" className="flex-1 text-xs border border-gray-400 bg-gray-100 hover:bg-gray-200 transition-colors" disabled={isUploading !== false || !selectedSmallLauncherFile}>
                    {isUploading === 'smallLauncher' ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            </div>
  
          </CardContent>
        </Card>
  
        {/* Banner Image Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Banner Image</CardTitle>
            <CardDescription className="text-sm">
              Upload a wide banner image used in detailed application views.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 items-center">
            {/* Preview */}
            <div className="w-full flex items-center justify-center bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[150px]">
              <div className="relative w-full max-w-3xl aspect-[2/1]">
                <img
                  src={settings.images.bannerImage}
                  alt="Banner image"
                  className="w-full h-full object-contain"
                />
                {settings.images.bannerImage.startsWith('/placeholder') && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 rounded-lg">
                    <Image className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            {/* Upload Controls */}
            <div className="w-full max-w-md border border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-lg p-4 bg-gray-50/50 hover:bg-blue-50 flex flex-col items-center justify-center min-h-[100px]">
              <p className="text-sm text-gray-600 mb-3 text-center px-2">
                {selectedBannerFile
                  ? `Selected: ${selectedBannerFile.name}`
                  : "Select file (e.g., 800x400px)"
                }
              </p>
              <input
                type="file" accept="image/*"
                onChange={(e) => handleFileSelect(e, 'banner')}
                className="hidden"
                ref={bannerInputRef}
                aria-label="Upload banner image"
              />
              <div className="flex gap-2 w-full max-w-xs">
                <Button onClick={() => bannerInputRef.current?.click()} variant="outline" className="flex-1" disabled={isUploading !== false}>Browse</Button>
                <Button onClick={() => handleUpload('banner')} className="flex-1 text-xs border border-gray-400 bg-gray-400 hover:bg-gray-200 transition-colors" disabled={isUploading !== false || !selectedBannerFile}>
                  {isUploading === 'banner' ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }