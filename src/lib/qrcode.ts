import QRCode from 'qrcode'

export interface QRCodeOptions {
  width?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

export async function generateQRCode(
  text: string, 
  options: QRCodeOptions = {}
): Promise<string> {
  try {
    const defaultOptions = {
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const,
      ...options
    }

    const qrCodeDataUrl = await QRCode.toDataURL(text, defaultOptions)
    return qrCodeDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

export async function generateQRCodeSVG(
  text: string, 
  options: QRCodeOptions = {}
): Promise<string> {
  try {
    const defaultOptions = {
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const,
      ...options
    }

    const qrCodeSVG = await QRCode.toString(text, { 
      type: 'svg',
      ...defaultOptions 
    })
    return qrCodeSVG
  } catch (error) {
    console.error('Error generating QR code SVG:', error)
    throw new Error('Failed to generate QR code SVG')
  }
}