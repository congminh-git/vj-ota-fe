'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
  children?: Heading[]
}

export default function TableOfContents() {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // Reset state khi pathname thay đổi
  useEffect(() => {
    setHeadings([])
    setActiveId('')
    setExpandedIds(new Set())
  }, [pathname])

  useEffect(() => {
    const extractHeadings = () => {
      const article = document.querySelector('article')
      if (!article) return []

      const elements = article.querySelectorAll('h1, h2, h3, h4, h5')
      const flatHeadings: Heading[] = []

      elements.forEach((element) => {
        const level = parseInt(element.tagName.substring(1))
        const text = element.textContent || ''
        
        let id = element.id
        if (!id) {
          id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
          element.id = id
        }

        flatHeadings.push({ id, text, level })
      })

      const tree: Heading[] = []
      const stack: Heading[] = []

      flatHeadings.forEach((heading) => {
        const newHeading = { ...heading, children: [] }

        while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
          stack.pop()
        }

        if (stack.length === 0) {
          tree.push(newHeading)
        } else {
          const parent = stack[stack.length - 1]
          if (!parent.children) parent.children = []
          parent.children.push(newHeading)
        }

        stack.push(newHeading)
      })

      return tree
    }

    const initialHeadings = extractHeadings()
    if (initialHeadings.length > 0) {
      setHeadings(initialHeadings)
      
      if (initialHeadings.length > 0 && initialHeadings[0].children && initialHeadings[0].children.length > 0) {
        setExpandedIds(new Set([initialHeadings[0].id]))
      }
    }

    // Retry nếu chưa có headings (DOM chưa ready)
    const retryTimeout = setTimeout(() => {
      const retryHeadings = extractHeadings()
      if (retryHeadings.length > 0) {
        setHeadings(retryHeadings)
        if (retryHeadings.length > 0 && retryHeadings[0].children && retryHeadings[0].children.length > 0) {
          setExpandedIds(new Set([retryHeadings[0].id]))
        }
      }
    }, 100)

    const observer = new MutationObserver(() => {
      const newHeadings = extractHeadings()
      if (newHeadings.length > 0) {
        setHeadings(newHeadings)
      }
    })

    const article = document.querySelector('article')
    if (article) {
      observer.observe(article, {
        childList: true,
        subtree: true
      })
    }

    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    if (headings.length === 0) return

    const getAllIds = (headings: Heading[]): string[] => {
      const ids: string[] = []
      headings.forEach(h => {
        ids.push(h.id)
        if (h.children) {
          ids.push(...getAllIds(h.children))
        }
      })
      return ids
    }

    const allIds = getAllIds(headings)
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { 
        rootMargin: '-100px 0px -66%',
        threshold: 0.5
      }
    )

    allIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const renderHeading = (heading: Heading, depth: number = 0) => {
    const hasChildren = heading.children && heading.children.length > 0
    const isExpanded = expandedIds.has(heading.id)
    const isActive = activeId === heading.id

    return (
      <li key={heading.id} className="group">
        <div className="flex items-center gap-1">
          {/* Chevron button */}
          <div className="w-5 flex-shrink-0">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(heading.id)}
                className="p-1 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110"
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                <ChevronRight 
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
            )}
          </div>
          
          {/* Link text */}
          <a
            href={`#${heading.id}`}
            className={`
              block py-1.5 px-2 rounded-md flex-1 
              text-sm font-medium
              transition-all duration-200
              ${isActive
                ? 'text-blue-600 bg-blue-50 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              })
            }}
          >
            {heading.text}
          </a>
        </div>
        
        {/* Children with smooth animation */}
        {hasChildren && (
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <ul className="ml-5 mt-1 space-y-0.5 border-l-2 border-gray-200 pl-3">
              {heading.children!.map(child => renderHeading(child, depth + 1))}
            </ul>
          </div>
        )}
      </li>
    )
  }

  if (headings.length === 0) return null

  return (
    <nav className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 border border-gray-100 shadow-sm">
        <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
          Table of contents
        </h4>
        <ul className="space-y-1">
          {headings.map(heading => renderHeading(heading))}
        </ul>
      </div>
    </nav>
  )
}