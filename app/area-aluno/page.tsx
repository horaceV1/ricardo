"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Award,
  Loader2,
  ChevronRight,
  Target,
  Calendar
} from 'lucide-react'

interface EnrolledCourse {
  id: string
  title: string
  image?: string
  totalChapters: number
  completedChapters: number
  currentChapter: number
  progress: number
  lastAccessed?: string
  totalDuration: string
  certificateAvailable: boolean
}

interface CourseArticle {
  id: string
  type: string
  attributes: {
    title: string
    created: string
    changed: string
    body?: {
      value: string
      summary: string
    }
  }
  relationships?: {
    field_parent?: {
      data: { id: string; type: string } | null
    }
    curso?: {
      data: { id: string; type: string } | null
    }
  }
}

interface PurchasedProduct {
  product_id: string
  title: string
  curso?: {
    id: string
    nid: string
    title: string
    path: string
  }
}

export default function StudentAreaPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [purchasedCursoIds, setPurchasedCursoIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/entrar')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchPurchasedCursos()
    }
  }, [user])

  const fetchPurchasedCursos = async () => {
    try {
      // Get JWT token from localStorage
      const tokensStr = localStorage.getItem('drupal_auth_tokens')
      const tokens = tokensStr ? JSON.parse(tokensStr) : null
      const token = tokens?.access_token

      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      const response = await fetch(`${baseUrl}/api/auth/purchases`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        console.error('[Area Aluno] Failed to fetch purchases, status:', response.status)
        throw new Error('Failed to fetch purchases')
      }

      const data = await response.json()
      const purchases: PurchasedProduct[] = data.data || []
      
      console.log('=== AREA ALUNO DEBUG ===')
      console.log('[Area Aluno] Full API response:', JSON.stringify(data, null, 2))
      console.log('[Area Aluno] Number of purchases:', purchases.length)
      
      // Extract curso UUIDs from purchased products
      const cursoIds = new Set<string>()
      purchases.forEach(product => {
        console.log('[Area Aluno] Processing product:', {
          title: product.title,
          product_id: product.product_id,
          has_curso: !!product.curso,
          curso: product.curso
        })
        
        if (product.curso?.id) {
          cursoIds.add(product.curso.id)
          console.log('[Area Aluno] ✓ Added curso ID:', product.curso.id, 'Title:', product.curso.title)
        } else {
          console.log('[Area Aluno] ✗ Product has NO curso linked:', product.title)
        }
      })
      
      console.log('[Area Aluno] Total curso IDs extracted:', cursoIds.size)
      console.log('[Area Aluno] Curso IDs:', Array.from(cursoIds))
      
      setPurchasedCursoIds(cursoIds)
      
      // Only fetch courses if user has purchases
      if (cursoIds.size > 0) {
        console.log('[Area Aluno] User has purchases, fetching courses')
        fetchCourses(cursoIds)
      } else {
        // No purchases, set empty courses and stop loading
        console.log('[Area Aluno] No purchases found, showing empty state')
        setCourses([])
        setLoadingCourses(false)
      }
    } catch (error) {
      console.error('Error fetching purchases:', error)
      setCourses([])
      setLoadingCourses(false)
    }
  }

  const fetchCourses = async (purchasedIds: Set<string>) => {
    try {
      setLoadingCourses(true)
      
      // Safety check: if no purchased IDs, return empty
      if (purchasedIds.size === 0) {
        setCourses([])
        setLoadingCourses(false)
        return
      }
      
      const baseUrl = 'https://darkcyan-stork-408379.hostingersite.com'
      
      // Fetch all cursos to find parent and children
      const response = await fetch(
        `${baseUrl}/jsonapi/node/cursos`,
        {
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }

      const data = await response.json()
      const articles: CourseArticle[] = data.data

      console.log('[Area Aluno] Fetched cursos from API:', articles.length)
      console.log('[Area Aluno] Sample curso:', articles[0])
      console.log('[Area Aluno] All curso UUIDs:', articles.map(a => ({ id: a.id, title: a.attributes.title })))
      console.log('[Area Aluno] Looking for these purchased curso IDs:', Array.from(purchasedIds))

      // Find parent courses (those that are NOT children of others)
      // Check both field_parent and curso relationships
      const parentCourses = articles.filter(article => {
        const hasNoParent = !article.relationships?.field_parent?.data && !article.relationships?.curso?.data
        return hasNoParent
      })

      console.log('[Area Aluno] Found parent courses:', parentCourses.length)
      console.log('[Area Aluno] Parent course details:', parentCourses.map(p => ({ id: p.id, title: p.attributes.title })))

      // Filter to only show purchased courses
      const purchasedParentCourses = parentCourses.filter(course => {
        const isPurchased = purchasedIds.has(course.id)
        console.log('[Area Aluno] Checking if curso is purchased:', {
          curso_id: course.id,
          curso_title: course.attributes.title,
          is_in_purchased_set: isPurchased
        })
        return isPurchased
      })

      console.log('[Area Aluno] Purchased parent courses found:', purchasedParentCourses.length)
      console.log('[Area Aluno] Purchased courses:', purchasedParentCourses.map(c => c.attributes.title))

      console.log('[Area Aluno] Purchased parent courses:', purchasedParentCourses.length)

      // Transform to EnrolledCourse format
      const transformedCourses: EnrolledCourse[] = purchasedParentCourses.map(course => {
        // Count how many articles have this course as parent
        // Check both field_parent and curso relationships
        const childrenCount = articles.filter(a => {
          const parentId = a.relationships?.field_parent?.data?.id || a.relationships?.curso?.data?.id
          return parentId === course.id
        }).length
        
        console.log('[Area Aluno] Course:', course.attributes.title, 'has', childrenCount, 'children')
        
        return {
          id: course.id,
          title: course.attributes.title,
          totalChapters: childrenCount,
          completedChapters: 0, // This would come from user progress data
          currentChapter: 1,
          progress: 0, // This would come from user progress data
          lastAccessed: course.attributes.changed,
          totalDuration: `${childrenCount * 30}min`, // Estimate 30min per chapter
          certificateAvailable: false,
        }
      })

      // Filter to only show courses with children (or show all purchased courses)
      const coursesWithChildren = transformedCourses.filter(c => c.totalChapters > 0)
      console.log('[Area Aluno] Courses with children:', coursesWithChildren.length)
      
      // If no courses have children, show all purchased courses anyway
      setCourses(coursesWithChildren.length > 0 ? coursesWithChildren : transformedCourses)
    } catch (error) {
      console.error('Error fetching courses:', error)
      // Fallback to empty array on error
      setCourses([])
    } finally {
      setLoadingCourses(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#009999] mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const totalProgress = courses.length > 0 
    ? Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)
    : 0

  const completedCourses = courses.filter(c => c.progress === 100).length
  const inProgressCourses = courses.filter(c => c.progress > 0 && c.progress < 100).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Área do Aluno
          </h1>
          <p className="text-gray-600 text-lg">
            Acompanhe seu progresso e continue aprendendo
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#009999]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Cursos Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="h-12 w-12 bg-[#009999]/10 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-[#009999]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Concluídos</p>
                <p className="text-3xl font-bold text-gray-900">{completedCourses}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Em Progresso</p>
                <p className="text-3xl font-bold text-gray-900">{inProgressCourses}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Progresso Geral</p>
                <p className="text-3xl font-bold text-gray-900">{totalProgress}%</p>
              </div>
              <div className="h-12 w-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Meus Cursos</h2>
            <Link 
              href="/courses"
              className="text-[#009999] hover:text-[#007a7a] font-medium text-sm flex items-center gap-2 transition-colors"
            >
              Explorar Mais Cursos
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingCourses ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#009999] mx-auto mb-4" />
              <p className="text-gray-600">Carregando cursos...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum curso matriculado
              </h3>
              <p className="text-gray-600 mb-6">
                Comece sua jornada de aprendizado hoje!
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-[#009999] hover:bg-[#007a7a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Explorar Cursos
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all hover:border-[#009999] group"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Course Image */}
                    <div className="flex-shrink-0">
                      <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-[#009999] to-[#007a7a] rounded-lg flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-white" />
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#009999] transition-colors">
                            {course.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <PlayCircle className="h-4 w-4" />
                              <span>Capítulo {course.currentChapter} de {course.totalChapters}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span>{course.totalDuration}</span>
                            </div>
                            {course.lastAccessed && (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <span>Último acesso: {formatDate(course.lastAccessed)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {course.certificateAvailable && (
                          <div className="flex-shrink-0">
                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              Certificado Disponível
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Progresso do Curso
                          </span>
                          <span className="text-sm font-bold text-[#009999]">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#009999] to-[#007a7a] h-full rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                          <span>{course.completedChapters} de {course.totalChapters} capítulos concluídos</span>
                          {course.progress === 100 && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/area-aluno/curso/${course.id}`}
                          className="flex items-center gap-2 bg-[#009999] hover:bg-[#007a7a] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
                        >
                          <PlayCircle className="h-5 w-5" />
                          {course.progress === 100 ? 'Revisar Curso' : 'Continuar Aprendendo'}
                        </Link>
                        
                        {course.certificateAvailable && (
                          <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors">
                            <Award className="h-5 w-5" />
                            Baixar Certificado
                          </button>
                        )}

                        <Link
                          href={`/area-aluno/curso/${course.id}`}
                          className="flex items-center gap-2 border-2 border-gray-300 hover:border-[#009999] text-gray-700 hover:text-[#009999] px-6 py-2.5 rounded-lg font-semibold transition-colors"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link
            href="/conta"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="h-12 w-12 bg-[#009999]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#009999] transition-colors">
              <BookOpen className="h-6 w-6 text-[#009999] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Minha Conta</h3>
            <p className="text-gray-600 text-sm">
              Gerencie suas informações pessoais e preferências
            </p>
          </Link>

          <Link
            href="/courses"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
              <Target className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Explorar Cursos</h3>
            <p className="text-gray-600 text-sm">
              Descubra novos cursos e expanda seus conhecimentos
            </p>
          </Link>

          <Link
            href="#certificados"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="h-12 w-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors">
              <Award className="h-6 w-6 text-yellow-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Meus Certificados</h3>
            <p className="text-gray-600 text-sm">
              Acesse e baixe seus certificados de conclusão
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
