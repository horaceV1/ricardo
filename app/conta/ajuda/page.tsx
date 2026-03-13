"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Loader2,
  Monitor,
  Globe,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react"

interface Video {
  index: number
  title: string
  description: string
  filename: string
  size: number
  size_human: string
  stream_url: string
}

interface Chapter {
  id: string
  title: string
  description: string
  video_count: number
  videos: Video[]
}

interface TutorialData {
  chapters: Chapter[]
  total_videos: number
}

export default function AjudaPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [tutorialData, setTutorialData] = useState<TutorialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Current video state
  const [activeChapter, setActiveChapter] = useState<string | null>(null)
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set())

  const videoRef = useRef<HTMLVideoElement>(null)

  const isAllowed = user?.roles?.includes("administrator") || user?.roles?.includes("tecnico")
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  // Load watched state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tutorial_watched_videos")
    if (saved) {
      try {
        setWatchedVideos(new Set(JSON.parse(saved)))
      } catch (e) {
        // ignore
      }
    }
  }, [])

  // Save watched state
  const markAsWatched = (videoKey: string) => {
    setWatchedVideos((prev) => {
      const next = new Set(prev)
      next.add(videoKey)
      localStorage.setItem("tutorial_watched_videos", JSON.stringify([...next]))
      return next
    })
  }

  // Fetch tutorial data
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/entrar")
      return
    }
    if (!authLoading && user && !isAllowed) {
      router.push("/conta")
      return
    }
    if (isAuthenticated && isAllowed) {
      fetchTutorials()
    }
  }, [authLoading, isAuthenticated, user, isAllowed, router])

  const fetchTutorials = async () => {
    try {
      setLoading(true)
      const tokensStr = localStorage.getItem("drupal_auth_tokens")
      if (!tokensStr) {
        setError("Sessão expirada.")
        return
      }
      const tokens = JSON.parse(tokensStr)

      const res = await fetch(`${baseUrl}/api/tutorials`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })

      if (!res.ok) throw new Error("Erro ao carregar tutoriais")
      const data = await res.json()
      setTutorialData(data)

      // Auto-select first chapter and video
      if (data.chapters?.length > 0) {
        const firstChapter = data.chapters[0]
        setActiveChapter(firstChapter.id)
        setActiveVideoIndex(0)
        setExpandedChapters(new Set([firstChapter.id]))
      }
    } catch (err) {
      console.error(err)
      setError("Erro ao carregar tutoriais. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev)
      if (next.has(chapterId)) {
        next.delete(chapterId)
      } else {
        next.add(chapterId)
      }
      return next
    })
  }

  const selectVideo = (chapterId: string, videoIndex: number) => {
    setActiveChapter(chapterId)
    setActiveVideoIndex(videoIndex)
    setExpandedChapters((prev) => new Set(prev).add(chapterId))
    // Scroll to top of video player on mobile
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getActiveChapter = (): Chapter | null => {
    return tutorialData?.chapters.find((c) => c.id === activeChapter) || null
  }

  const getActiveVideo = (): Video | null => {
    const chapter = getActiveChapter()
    return chapter?.videos[activeVideoIndex] || null
  }

  const getVideoKey = (chapterId: string, videoIndex: number): string => {
    return `${chapterId}_${videoIndex}`
  }

  const handleVideoEnded = () => {
    if (activeChapter !== null) {
      markAsWatched(getVideoKey(activeChapter, activeVideoIndex))
    }

    // Auto-advance to next video
    const chapter = getActiveChapter()
    if (chapter && activeVideoIndex < chapter.videos.length - 1) {
      setActiveVideoIndex(activeVideoIndex + 1)
    } else {
      // Move to next chapter
      const chapters = tutorialData?.chapters || []
      const currentIdx = chapters.findIndex((c) => c.id === activeChapter)
      if (currentIdx >= 0 && currentIdx < chapters.length - 1) {
        const nextChapter = chapters[currentIdx + 1]
        setActiveChapter(nextChapter.id)
        setActiveVideoIndex(0)
        setExpandedChapters((prev) => new Set(prev).add(nextChapter.id))
      }
    }
  }

  const goToNextVideo = () => {
    const chapter = getActiveChapter()
    if (chapter && activeVideoIndex < chapter.videos.length - 1) {
      setActiveVideoIndex(activeVideoIndex + 1)
    } else {
      const chapters = tutorialData?.chapters || []
      const currentIdx = chapters.findIndex((c) => c.id === activeChapter)
      if (currentIdx >= 0 && currentIdx < chapters.length - 1) {
        const nextChapter = chapters[currentIdx + 1]
        setActiveChapter(nextChapter.id)
        setActiveVideoIndex(0)
        setExpandedChapters((prev) => new Set(prev).add(nextChapter.id))
      }
    }
  }

  const goToPrevVideo = () => {
    if (activeVideoIndex > 0) {
      setActiveVideoIndex(activeVideoIndex - 1)
    } else {
      const chapters = tutorialData?.chapters || []
      const currentIdx = chapters.findIndex((c) => c.id === activeChapter)
      if (currentIdx > 0) {
        const prevChapter = chapters[currentIdx - 1]
        setActiveChapter(prevChapter.id)
        setActiveVideoIndex(prevChapter.videos.length - 1)
        setExpandedChapters((prev) => new Set(prev).add(prevChapter.id))
      }
    }
  }

  // Calculate progress
  const totalVideos = tutorialData?.total_videos || 0
  const watchedCount = watchedVideos.size
  const progressPercent = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0

  const getChapterIcon = (chapterId: string) => {
    switch (chapterId) {
      case "backend":
        return <Monitor className="h-5 w-5" />
      case "frontend":
        return <Globe className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#009999] mx-auto mb-4" />
          <p className="text-gray-500">A carregar tutoriais...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchTutorials}
            className="px-4 py-2 bg-[#009999] text-white rounded-lg hover:bg-[#008080] transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  const activeVideo = getActiveVideo()
  const activeChapterData = getActiveChapter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/conta"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Centro de Ajuda</h1>
                <p className="text-white/80 text-sm mt-1">
                  Tutoriais em vídeo para aprender a utilizar a plataforma
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 bg-white/10 rounded-full p-1">
            <div className="flex items-center gap-3 px-3">
              <span className="text-xs font-medium whitespace-nowrap">
                {watchedCount}/{totalVideos} vídeos
              </span>
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold whitespace-nowrap">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Video Player Area */}
          <div className="flex-1 min-w-0">
            {activeVideo && activeChapterData ? (
              <div className="space-y-4">
                {/* Video Player */}
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                  <video
                    ref={videoRef}
                    key={`${activeChapter}-${activeVideoIndex}`}
                    className="w-full aspect-video"
                    controls
                    autoPlay
                    onEnded={handleVideoEnded}
                    onPlay={() => {
                      if (activeChapter) {
                        markAsWatched(getVideoKey(activeChapter, activeVideoIndex))
                      }
                    }}
                  >
                    <source
                      src={`${baseUrl}${activeVideo.stream_url}`}
                      type="video/mp4"
                    />
                    O seu browser não suporta a reprodução de vídeos.
                  </video>
                </div>

                {/* Video Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-[#6366f1] font-medium mb-2">
                        {getChapterIcon(activeChapterData.id)}
                        <span>{activeChapterData.title}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">
                          Vídeo {activeVideoIndex + 1} de {activeChapterData.videos.length}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {activeVideo.title}
                      </h2>
                      <p className="text-gray-600 text-sm">{activeVideo.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {activeVideo.size_human}
                        </span>
                        {watchedVideos.has(getVideoKey(activeChapter!, activeVideoIndex)) && (
                          <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle2 className="h-3 w-3" />
                            Visto
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={goToPrevVideo}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <SkipBack className="h-4 w-4" />
                      Anterior
                    </button>
                    <button
                      onClick={goToNextVideo}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-lg transition-colors"
                    >
                      Próximo
                      <SkipForward className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Play className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecione um vídeo
                </h3>
                <p className="text-gray-500">
                  Escolha um tutorial da lista ao lado para começar
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Chapter List */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-6">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#6366f1]" />
                  Conteúdo do Tutorial
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {tutorialData?.chapters.length} capítulos • {totalVideos} vídeos
                </p>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {tutorialData?.chapters.map((chapter, chapterIdx) => {
                  const isExpanded = expandedChapters.has(chapter.id)
                  const chapterWatched = chapter.videos.filter((_, vIdx) =>
                    watchedVideos.has(getVideoKey(chapter.id, vIdx))
                  ).length

                  return (
                    <div key={chapter.id} className="border-b border-gray-100 last:border-0">
                      {/* Chapter Header */}
                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <div className={`p-2 rounded-lg ${
                          activeChapter === chapter.id
                            ? "bg-[#6366f1]/10 text-[#6366f1]"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {getChapterIcon(chapter.id)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-900 truncate">
                              Capítulo {chapterIdx + 1}
                            </h4>
                            <ChevronDown
                              className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <p className="text-xs text-gray-500 truncate">{chapter.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#6366f1] rounded-full transition-all"
                                style={{
                                  width: `${chapter.videos.length > 0 ? (chapterWatched / chapter.videos.length) * 100 : 0}%`,
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {chapterWatched}/{chapter.videos.length}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Video List */}
                      {isExpanded && (
                        <div className="pb-2">
                          {chapter.videos.map((video, vIdx) => {
                            const isActive = activeChapter === chapter.id && activeVideoIndex === vIdx
                            const isWatched = watchedVideos.has(getVideoKey(chapter.id, vIdx))

                            return (
                              <button
                                key={vIdx}
                                onClick={() => selectVideo(chapter.id, vIdx)}
                                className={`w-full text-left pl-10 pr-6 py-3 flex items-center gap-3 transition-colors ${
                                  isActive
                                    ? "bg-[#6366f1]/5 border-l-2 border-[#6366f1]"
                                    : "hover:bg-gray-50 border-l-2 border-transparent"
                                }`}
                              >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isActive
                                    ? "bg-[#6366f1] text-white"
                                    : isWatched
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-400"
                                }`}>
                                  {isWatched && !isActive ? (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  ) : (
                                    <Play className="h-3 w-3" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-medium truncate ${
                                    isActive ? "text-[#6366f1]" : "text-gray-700"
                                  }`}>
                                    {video.title}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    {video.size_human}
                                  </p>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
