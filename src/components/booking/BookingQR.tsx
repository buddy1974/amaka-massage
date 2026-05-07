import { useEffect, useState } from 'react'
import { toDataURL } from 'qrcode'

interface Props {
  url: string
  size?: number
}

export const BookingQR = ({ url, size = 150 }: Props) => {
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    toDataURL(url, { width: size, margin: 1 })
      .then(setDataUrl)
      .catch(() => {})
  }, [url, size])

  if (!dataUrl) return null

  return (
    <img
      src={dataUrl}
      alt="Booking QR code"
      width={size}
      height={size}
      className="rounded-xl"
    />
  )
}
