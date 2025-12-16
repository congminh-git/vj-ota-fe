import { Download } from 'lucide-react'

type Props = {
  title: string
  file: string
  size?: string
}

export function DownloadCard({ title, file, size }: Props) {
  return (
    <a
      href={file}
      download
      className="download-card not-prose flex items-center gap-4 border rounded-lg p-4 hover:bg-slate-50"
    >
      <Download className="h-5 w-5 text-slate-500 shrink-0" />
      <div>
        <div className="font-medium text-slate-900">{title}</div>
        {size && <div className="text-sm text-slate-500">{size}</div>}
      </div>
    </a>
  )
}
