import ReactDOM from 'react-dom'

const Portal = ({ children, root = '', inlineOnSSR = false }) => {
  if (typeof document === 'undefined') {
    return inlineOnSSR ? children : null
  }
  const rootEl = document.getElementById(`portal-root${root}`)
  return ReactDOM.createPortal(children, rootEl)
}

export default Portal
