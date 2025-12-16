import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'


const DOCS_PATH = path.join(
  process.cwd(),
  'src',
  'content',
  'docs'
)

export function getDocBySlug(slug?: string[]) {
  const realSlug = slug && slug.length > 0 ? slug : ['index']

  let filePath = path.join(
    DOCS_PATH,
    `${realSlug.join('/')}.md`
  )

  if (!fs.existsSync(filePath)) {
    filePath = path.join(
      DOCS_PATH,
      realSlug.join('/'),
      'index.md'
    )
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Doc not found: ${realSlug.join('/')}`)
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  return matter(raw)
}



export function getAllDocs(dir = DOCS_PATH, baseSlug: string[] = []) {
const entries = fs.readdirSync(dir, { withFileTypes: true })


return entries.flatMap(entry => {
if (entry.isDirectory()) {
return getAllDocs(path.join(dir, entry.name), [...baseSlug, entry.name])
}
if (!entry.name.endsWith('.md')) return []


const slug = [...baseSlug, entry.name.replace(/\.md$/, '')]
return [{ slug }]
})
}