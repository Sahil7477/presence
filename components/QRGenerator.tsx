"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Download, Trash2, Plus, Settings } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

import { Toaster} from "@/components/ui/toaster"


// Types
interface QRCode {
  id: string
  content: string
  name: string
  createdAt: Date
  backgroundColor: string
  foregroundColor: string
  includeMargin: boolean
  size: number
}

export default function QRCodeGenerator() {
  // State for form
  const [content, setContent] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF")
  const [foregroundColor, setForegroundColor] = useState<string>("#000000")
  const [includeMargin, setIncludeMargin] = useState<boolean>(true)
  const [size, setSize] = useState<number>(128)

  // State for QR codes
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  // Load saved QR codes from localStorage on component mount
  useEffect(() => {
    const savedQRCodes = localStorage.getItem("qrCodes")
    if (savedQRCodes) {
      try {
        const parsedQRCodes = JSON.parse(savedQRCodes)
        // Convert string dates back to Date objects
        const formattedQRCodes = parsedQRCodes.map((qr: any) => ({
          ...qr,
          createdAt: new Date(qr.createdAt),
        }))
        setQrCodes(formattedQRCodes)
      } catch (error) {
        console.error("Error parsing saved QR codes:", error)
      }
    }
  }, [])

  // Save QR codes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("qrCodes", JSON.stringify(qrCodes))
  }, [qrCodes])

  // Generate QR code
  const generateQRCode = () => {
    if (!content) {
      toast({
        title: "Error",
        description: "Please enter content for the QR code",
        variant: "destructive",
      })
      return
    }

    const newQRCode: QRCode = {
      id: uuidv4(),
      content,
      name: name || `QR Code ${qrCodes.length + 1}`,
      createdAt: new Date(),
      backgroundColor,
      foregroundColor,
      includeMargin,
      size,
    }

    setQrCodes([newQRCode, ...qrCodes])
    setSelectedQR(newQRCode)

    toast({
      title: "Success",
      description: "QR code generated successfully",
    })
  }

  // Download QR code as SVG
  const downloadQRCode = (qrCode: QRCode) => {
    const svg = document.getElementById(`qr-svg-${qrCode.id}`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    const downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = `${qrCode.name.replace(/\s+/g, "-")}.svg`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(svgUrl)
  }

  // Delete QR code
  const deleteQRCode = (id: string) => {
    setQrCodes(qrCodes.filter((qr) => qr.id !== id))
    if (selectedQR?.id === id) {
      setSelectedQR(null)
    }
    toast({
      title: "Deleted",
      description: "QR code deleted successfully",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-muted-foreground">Generate, customize, and manage your QR codes</p>
      </header>

      <Tabs defaultValue="generate" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="generate">Generate QR Code</TabsTrigger>
          <TabsTrigger value="history">QR Code History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Code Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create New QR Code</CardTitle>
                <CardDescription>Enter the content and customize your QR code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Input
                    id="content"
                    placeholder="Enter URL or text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    placeholder="Name your QR code"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Customization Options
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fgColor">Foreground Color</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 border rounded" style={{ backgroundColor: foregroundColor }} />
                        <Input
                          id="fgColor"
                          type="color"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="w-full h-8"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bgColor">Background Color</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 border rounded" style={{ backgroundColor: backgroundColor }} />
                        <Input
                          id="bgColor"
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-full h-8"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select value={size.toString()} onValueChange={(value) => setSize(Number.parseInt(value))}>
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="128">Small (128px)</SelectItem>
                        <SelectItem value="256">Medium (256px)</SelectItem>
                        <SelectItem value="512">Large (512px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="margin" checked={includeMargin} onCheckedChange={setIncludeMargin} />
                    <Label htmlFor="margin">Include Margin</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={generateQRCode} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>
              </CardFooter>
            </Card>

            {/* QR Code Preview */}
            <Card>
              <CardHeader>
                <CardTitle>QR Code Preview</CardTitle>
                <CardDescription>{selectedQR ? selectedQR.name : "Your QR code will appear here"}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                {selectedQR ? (
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg inline-block mb-4">
                      <QRCodeSVG
                        id={`qr-svg-${selectedQR.id}`}
                        value={selectedQR.content}
                        size={selectedQR.size}
                        bgColor={selectedQR.backgroundColor}
                        fgColor={selectedQR.foregroundColor}
                        includeMargin={selectedQR.includeMargin}
                        level="H"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 break-all max-w-[300px] mx-auto">
                      {selectedQR.content}
                    </p>
                    <p className="text-xs text-muted-foreground">Created: {formatDate(selectedQR.createdAt)}</p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 mb-4">
                      <div className="w-32 h-32 mx-auto bg-gray-100 flex items-center justify-center">
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <p>Generate a QR code to see the preview</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                {selectedQR && (
                  <Button variant="outline" onClick={() => downloadQRCode(selectedQR)} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>QR Code History</CardTitle>
              <CardDescription>
                {qrCodes.length > 0
                  ? `You have ${qrCodes.length} saved QR code${qrCodes.length > 1 ? "s" : ""}`
                  : "Your generated QR codes will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {qrCodes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {qrCodes.map((qr) => (
                    <Card key={qr.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base truncate">{qr.name}</CardTitle>
                        <CardDescription className="text-xs">{formatDate(qr.createdAt)}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex justify-center">
                        <div
                          className="bg-white p-2 rounded cursor-pointer"
                          onClick={() => {
                            setSelectedQR(qr)
                            setIsDialogOpen(true)
                          }}
                        >
                          <QRCodeSVG
                            id={`qr-svg-${qr.id}`}
                            value={qr.content}
                            size={128}
                            bgColor={qr.backgroundColor}
                            fgColor={qr.foregroundColor}
                            includeMargin={qr.includeMargin}
                            level="H"
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => downloadQRCode(qr)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedQR(qr)
                            setIsDialogOpen(true)
                          }}
                        >
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteQRCode(qr.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No QR codes yet</h3>
                  <p>Generate your first QR code to see it here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Code Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedQR?.name}</DialogTitle>
            <DialogDescription>Created on {selectedQR && formatDate(selectedQR.createdAt)}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center py-4">
            {selectedQR && (
              <>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QRCodeSVG
                    id={`qr-detail-svg-${selectedQR.id}`}
                    value={selectedQR.content}
                    size={256}
                    bgColor={selectedQR.backgroundColor}
                    fgColor={selectedQR.foregroundColor}
                    includeMargin={selectedQR.includeMargin}
                    level="H"
                  />
                </div>
                <div className="w-full">
                  <h4 className="text-sm font-medium mb-1">Content:</h4>
                  <p className="text-sm text-muted-foreground mb-4 break-all">{selectedQR.content}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Colors:</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-sm mr-1"
                            style={{ backgroundColor: selectedQR.foregroundColor }}
                          />
                          <span className="text-xs">{selectedQR.foregroundColor}</span>
                        </div>
                        <span className="text-xs">/</span>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-sm border mr-1"
                            style={{ backgroundColor: selectedQR.backgroundColor }}
                          />
                          <span className="text-xs">{selectedQR.backgroundColor}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Size:</h4>
                      <p className="text-sm text-muted-foreground">{selectedQR.size}px</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (selectedQR) downloadQRCode(selectedQR)
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedQR) {
                  deleteQRCode(selectedQR.id)
                  setIsDialogOpen(false)
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
