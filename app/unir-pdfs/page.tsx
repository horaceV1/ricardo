"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Upload, X, FileText, ArrowUpDown, Download, Loader2, CheckCircle, AlertCircle, ChevronUp, ChevronDown } from "lucide-react"
import type { Metadata } from "next"

interface PDFFile {
  id: string
  file: File
  name: string
  size: number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export default function UnirPDFsPage() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [merging, setMerging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((incoming: FileList | File[]) => {
    setError(null)
    setSuccess(false)
    const arr = Array.from(incoming)
    const pdfs = arr.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))
    if (pdfs.length < arr.length) {
      setError("Alguns ficheiros foram ignorados — apenas ficheiros PDF são suportados.")
    }
    if (pdfs.length === 0) return
    setFiles((prev) => [
      ...prev,
      ...pdfs.map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        name: f.name,
        size: f.size,
      })),
    ])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      addFiles(e.dataTransfer.files)
    },
    [addFiles]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ""
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setSuccess(false)
  }

  const moveFile = (index: number, direction: "up" | "down") => {
    setFiles((prev) => {
      const next = [...prev]
      const swapIndex = direction === "up" ? index - 1 : index + 1
      if (swapIndex < 0 || swapIndex >= next.length) return prev
      ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
      return next
    })
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Adicione pelo menos 2 ficheiros PDF para unir.")
      return
    }
    setMerging(true)
    setError(null)
    setSuccess(false)

    try {
      const { PDFDocument } = await import("pdf-lib")
      const merged = await PDFDocument.create()

      for (const pdfFile of files) {
        const arrayBuffer = await pdfFile.file.arrayBuffer()
        const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false })
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach((page) => merged.addPage(page))
      }

      const mergedBytes = await merged.save()
      const blob = new Blob([mergedBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "documento_unido.pdf"
      a.click()
      URL.revokeObjectURL(url)
      setSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes("encrypted")) {
        setError("Um ou mais ficheiros PDF estão encriptados/protegidos com palavra-passe e não podem ser unidos.")
      } else {
        setError("Ocorreu um erro ao unir os PDFs. Verifique se os ficheiros não estão corrompidos.")
      }
    } finally {
      setMerging(false)
    }
  }

  const totalSize = files.reduce((acc, f) => acc + f.size, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-12 px-4">
      {/* Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center pt-10 pb-6 px-8 border-b border-gray-100">
          <div className="mb-5">
            <Image
              src="/brand/logo-horizontal.png"
              alt="Clínica do Empresário"
              width={200}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">Unir Documentos PDF</h1>
          <p className="text-gray-400 text-sm text-center mt-2 max-w-md">
            Junte vários ficheiros PDF num único documento de forma rápida e segura. Tudo é processado no seu navegador.
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all select-none ${
              dragging
                ? "border-[#009999] bg-[#e6f7f7] scale-[1.01]"
                : "border-gray-300 bg-gray-50 hover:border-[#009999] hover:bg-[#f0fafa]"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              multiple
              className="hidden"
              onChange={handleInputChange}
            />
            <Upload className={`w-10 h-10 mb-3 transition-colors ${dragging ? "text-[#009999]" : "text-gray-300"}`} />
            <p className="font-semibold text-gray-600 text-base">
              {dragging ? "Solte os seus PDFs aqui" : "Arraste e largue os seus PDFs aqui"}
            </p>
            <p className="text-sm text-gray-400 mt-1">ou clique para selecionar os ficheiros</p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {files.length} {files.length === 1 ? "ficheiro" : "ficheiros"} · {formatBytes(totalSize)}
                </p>
                <button
                  onClick={() => { setFiles([]); setSuccess(false) }}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Remover todos
                </button>
              </div>

              {files.map((f, index) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 group"
                >
                  {/* Order controls */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                      className="text-gray-300 hover:text-[#009999] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="Mover para cima"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveFile(index, "down")}
                      disabled={index === files.length - 1}
                      className="text-gray-300 hover:text-[#009999] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="Mover para baixo"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Order number */}
                  <span className="text-xs font-bold text-gray-300 w-4 text-center select-none">{index + 1}</span>

                  <FileText className="w-5 h-5 text-[#009999] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                    <p className="text-xs text-gray-400">{formatBytes(f.size)}</p>
                  </div>
                  <button
                    onClick={() => removeFile(f.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    title="Remover"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Add more */}
              <button
                onClick={() => inputRef.current?.click()}
                className="w-full py-2.5 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 hover:border-[#009999] hover:text-[#009999] transition-colors"
              >
                + Adicionar mais ficheiros
              </button>
            </div>
          )}

          {/* Feedback */}
          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2.5 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>PDF unido com sucesso! O download foi iniciado automaticamente.</span>
            </div>
          )}

          {/* Merge button */}
          <button
            onClick={handleMerge}
            disabled={merging || files.length < 2}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#009999] hover:bg-[#007a7a] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-base transition-all shadow-md hover:shadow-lg hover:shadow-[#009999]/25"
          >
            {merging ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                A unir PDFs…
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Unir PDFs
              </>
            )}
          </button>
        </div>
      </div>

      {/* Privacy note */}
      <p className="mt-6 text-xs text-gray-400 text-center max-w-sm">
        Privacidade garantida: Os seus ficheiros nunca saem do seu computador. Todo o processamento é feito localmente no seu navegador.
      </p>
    </div>
  )
}
