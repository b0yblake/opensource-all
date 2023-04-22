const keysPressed = e => e.metaKey || e.altKey || e.ctrlKey || e.shiftKey
const isCurrentPage = e => e.currentTarget.getAttribute('aria-current') === 'page'
const shouldNavigate = e => !isCurrentPage(e) && !keysPressed(e)

export default shouldNavigate
