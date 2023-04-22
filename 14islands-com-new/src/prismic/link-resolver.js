exports.linkResolver = ({ type, href, uid }) => {
  if (type === 'home') return '/'
  if (type === 'about') return '/about'
  if (type === 'contact') return '/contact'
  if (type === 'work') return '/'
  if (type === 'work_project' && href) return `/preview-project/${uid}` // Preview path
  if (type === 'work_project') return `/${uid}` // Normal path
  if (type === 'lab') return '/lab'
  if (type === 'lab_project') return '/lab' // no individual page for lab projects right?
  if (type === 'blog') return '/blog'
  if (type === 'blog_post' && href) return `/preview-post/${uid}` // Preview path
  if (type === 'blog_post') return `/blog/${uid}` // Normal path
  if (type === 'careers') return '/careers'
  if (type === 'job' && href) return `/preview-job/${uid}` // Preview path
  if (type === 'job') return `/job/${uid}` // Normal path
  if (type === 'error_page') return '/404'

  return '/'
}
