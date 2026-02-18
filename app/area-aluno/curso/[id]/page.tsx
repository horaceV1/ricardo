"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  CheckCircle,
  Clock,
  Loader2,
  ArrowLeft,
  Home,
  Trophy
} from 'lucide-react'

interface CourseNode {
  nid: string
  title: string
  body?: {
    value: string
    summary: string
  }
  field_parent?: string
  children?: CourseNode[]
  created: string
}

interface CourseHierarchy {
  parent: CourseNode
  children: CourseNode[]
  currentIndex: number
}

interface PurchasedProduct {
  product_id: string
  title?: string
  curso?: {
    id: string
    nid: string
    title: string
  }
}

interface CourseProgress {
  course_uuid: string
  course_nid: number
  status: string
  current_module: number
  total_modules: number
  progress_percent: number
  completed_at: string | null
  created: string
  changed: string
}

export default function CourseViewerPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [courseData, setCourseData] = useState<CourseHierarchy | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasAccess, setHasAccess] = useState<boolean>(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/entrar')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (params.id && user) {
      verifyAccessAndFetchCourse()
    }
  }, [params.id, user])

  const verifyAccessAndFetchCourse = async () => {
    try {
      setCheckingAccess(true)
      
      // Get JWT token from localStorage
      const tokensStr = localStorage.getItem('drupal_auth_tokens')
      const tokens = tokensStr ? JSON.parse(tokensStr) : null
      const token = tokens?.access_token

      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      
      // Check if user has purchased this course
      const response = await fetch(`${baseUrl}/api/auth/purchases`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        console.error('[Course Viewer] Failed to verify access, status:', response.status)
        throw new Error('Failed to verify access')
      }

      const data = await response.json()
      const purchases: PurchasedProduct[] = data.data || []
      
      console.log('[Course Viewer] Purchases:', purchases)
      console.log('[Course Viewer] Number of purchases:', purchases.length)
      console.log('[Course Viewer] Checking access for curso ID:', params.id)
      
      // Debug each purchase
      purchases.forEach(product => {
        console.log('[Course Viewer] Product:', product.title, 'Curso ID:', product.curso?.id, 'Curso Title:', product.curso?.title)
      })
      
      // Check if user purchased a product linked to this curso
      const hasPurchased = purchases.some(product => {
        const matches = product.curso?.id === params.id
        console.log('[Course Viewer] Comparing:', product.curso?.id, 'with', params.id, '=', matches)
        return matches
      })
      
      console.log('[Course Viewer] Final access decision:', hasPurchased)
      
      setHasAccess(hasPurchased)
      setCheckingAccess(false)
      
      if (hasPurchased) {
        fetchCourseHierarchy()
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Error verifying access:', error)
      setHasAccess(false)
      setCheckingAccess(false)
      setLoading(false)
    }
  }

  const fetchCourseHierarchy = async () => {
    try {
      setLoading(true)
      const baseUrl = 'https://darkcyan-stork-408379.hostingersite.com'
      
      // Fetch the parent course node
      const parentResponse = await fetch(
        `${baseUrl}/jsonapi/node/cursos/${params.id}`,
        {
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        }
      )

      if (!parentResponse.ok) {
        throw new Error('Failed to fetch course')
      }

      const parentData = await parentResponse.json()
      const parent = parentData.data

      // Fetch all cursos to find children
      const allArticlesResponse = await fetch(
        `${baseUrl}/jsonapi/node/cursos`,
        {
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        }
      )

      if (!allArticlesResponse.ok) {
        throw new Error('Failed to fetch articles')
      }

      const allArticlesData = await allArticlesResponse.json()
      const allArticles = allArticlesData.data
      
      console.log('[Course Viewer] Looking for children of course:', params.id)
      console.log('[Course Viewer] Total articles:', allArticles.length)
      
      // Find children that reference this parent via cursos_ref (entity_hierarchy)
      const children: CourseNode[] = allArticles
        .filter((article: any) => {
          const parentId = article.relationships?.cursos_ref?.data?.id
          const isChild = parentId === params.id
          if (isChild) {
            console.log('[Course Viewer] Found child:', article.attributes.title)
          }
          return isChild
        })
        .sort((a: any, b: any) => {
          // Sort by weight from entity_hierarchy
          const weightA = a.relationships?.cursos_ref?.data?.meta?.weight ?? 0
          const weightB = b.relationships?.cursos_ref?.data?.meta?.weight ?? 0
          return weightA - weightB
        })
        .map((article: any) => ({
          nid: article.id,
          title: article.attributes.title,
          body: article.attributes.body_curso,
          created: article.attributes.created,
        }))

      console.log('[Course Viewer] Found', children.length, 'children for course:', parent.attributes.title)

      setCourseData({
        parent: {
          nid: parent.id,
          title: parent.attributes.title,
          body: parent.attributes.body_curso,
          created: parent.attributes.created,
          children: children,
        },
        children: children,
        currentIndex: 0,
      })
      setCurrentPage(0)
    } catch (error) {
      console.error('Error fetching course hierarchy:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAuthToken = () => {
    const tokensStr = localStorage.getItem('drupal_auth_tokens')
    const tokens = tokensStr ? JSON.parse(tokensStr) : null
    return tokens?.access_token
  }

  const fetchCourseProgress = async (courseUuid: string) => {
    try {
      const token = getAuthToken()
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      const res = await fetch(`${baseUrl}/api/auth/course-progress?course_uuid=${courseUuid}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })
      if (res.ok) {
        const data = await res.json()
        if (data.data) {
          const progress: CourseProgress = data.data
          if (progress.status === 'completed') {
            setCourseCompleted(true)
          }
          // Restore the user's last position if they haven't completed the course
          if (progress.status === 'in_progress' && progress.current_module > 0) {
            setCurrentPage(progress.current_module)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching course progress:', error)
    }
  }

  const updateCourseProgress = async (moduleIndex: number, status: string = 'in_progress') => {
    try {
      if (!courseData) return
      const token = getAuthToken()
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      await fetch(`${baseUrl}/api/auth/course-progress`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          course_uuid: params.id,
          course_nid: 0,
          current_module: moduleIndex,
          total_modules: courseData.children.length,
          status,
        }),
      })
    } catch (error) {
      console.error('Error updating course progress:', error)
    }
  }

  const handleCompleteCourse = async () => {
    if (!courseData) return
    setCompleting(true)
    try {
      await updateCourseProgress(courseData.children.length - 1, 'completed')
      setCourseCompleted(true)
      setShowCompletionModal(true)
    } catch (error) {
      console.error('Error completing course:', error)
    } finally {
      setCompleting(false)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (courseData && currentPage < courseData.children.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Track progress when navigating modules
  useEffect(() => {
    if (courseData && !courseCompleted) {
      updateCourseProgress(currentPage, 'in_progress')
    }
  }, [currentPage, courseData])

  // Fetch existing progress when course data loads
  useEffect(() => {
    if (courseData && params.id) {
      fetchCourseProgress(params.id as string)
    }
  }, [courseData])

  const getCurrentContent = () => {
    if (!courseData) return null
    return courseData.children[currentPage]
  }

  if (checkingAccess || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#009999] mx-auto mb-4" />
          <p className="text-gray-600">Carregando curso...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-6">
            Você precisa comprar este curso para acessar o conteúdo.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-[#009999] hover:bg-[#007a7a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Cursos
            </Link>
            <Link
              href="/conta"
              className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-[#009999] text-gray-700 hover:text-[#009999] px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Minha Conta
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Erro ao carregar curso</p>
        </div>
      </div>
    )
  }

  const currentContent = getCurrentContent()
  const progress = ((currentPage + 1) / courseData.children.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/area-aluno"
                className="flex items-center gap-2 text-gray-600 hover:text-[#009999] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Voltar</span>
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-1">
                  {courseData.parent.title}
                </h1>
                <p className="text-sm text-gray-600">
                  Página {currentPage + 1} de {courseData.children.length}
                </p>
              </div>
            </div>
            <Link
              href="/area-aluno"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Ir para Área do Aluno"
            >
              <Home className="h-5 w-5 text-gray-600" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Progresso do Curso</span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#009999] to-[#007a7a] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Content Header */}
          <div className="bg-gradient-to-r from-[#009999] to-[#007a7a] text-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    Módulo {currentPage + 1}
                  </span>
                  {currentPage === courseData.children.length - 1 && (
                    <span className="text-sm font-medium bg-green-500/80 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Último
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">{currentContent?.title}</h2>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-8">
            {currentContent?.body && (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: currentContent.body.value }}
              />
            )}

            {!currentContent?.body && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Este módulo não tem conteúdo disponível.</p>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentPage === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-[#009999] hover:bg-gray-100 border-2 border-[#009999]'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                Anterior
              </button>

              <div className="flex items-center gap-2">
                {courseData.children.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentPage
                        ? 'bg-[#009999] w-8'
                        : index < currentPage
                        ? 'bg-green-500'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    title={`Ir para página ${index + 1}`}
                  />
                ))}
              </div>

              {currentPage === courseData.children.length - 1 ? (
                // Last module: show completion button
                courseCompleted ? (
                  <div className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-green-100 text-green-700 border-2 border-green-500">
                    <CheckCircle className="h-5 w-5" />
                    Curso Concluído
                  </div>
                ) : (
                  <button
                    onClick={handleCompleteCourse}
                    disabled={completing}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {completing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        A concluir...
                      </>
                    ) : (
                      <>
                        <Trophy className="h-5 w-5" />
                        Concluir Curso
                      </>
                    )}
                  </button>
                )
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-[#009999] to-[#007a7a] text-white hover:shadow-lg"
                >
                  Próximo
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Page Info */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {courseCompleted ? (
                  <span className="flex items-center justify-center gap-2 text-green-600 font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Parabéns! Você concluiu este curso!
                  </span>
                ) : currentPage === courseData.children.length - 1 ? (
                  <span className="flex items-center justify-center gap-2 text-amber-600 font-medium">
                    <Trophy className="h-4 w-4" />
                    Último módulo — clique em &quot;Concluir Curso&quot; para finalizar
                  </span>
                ) : (
                  `${courseData.children.length - currentPage - 1} módulo${
                    courseData.children.length - currentPage - 1 !== 1 ? 's' : ''
                  } restante${courseData.children.length - currentPage - 1 !== 1 ? 's' : ''}`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Parabéns! 🎉
            </h2>
            <p className="text-gray-600 mb-2 text-lg">
              Você concluiu o curso
            </p>
            <p className="text-[#009999] font-bold text-xl mb-6">
              {courseData.parent.title}
            </p>
            <p className="text-gray-500 mb-8 text-sm">
              O seu progresso foi guardado. Pode voltar a rever o conteúdo a qualquer momento.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/area-aluno"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#009999] to-[#007a7a] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Home className="h-5 w-5" />
                Voltar à Área do Aluno
              </Link>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-[#009999] hover:text-[#009999] px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Continuar a Rever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
