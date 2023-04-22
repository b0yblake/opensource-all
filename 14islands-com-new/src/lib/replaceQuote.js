const replaceQuote = s => {
  if (typeof s !== 'string') return s
  return s.replace(/"/g, `'`)
}

export default replaceQuote
