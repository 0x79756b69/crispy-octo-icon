function newPaper(diameter, color) {
  const container = document.createElement('div');
  container.style.borderRadius = '30px'
  container.style.overflow = 'hidden'
  container.style.padding = '0px'
  container.style.margin = '0px'
  container.style.width = '' + diameter + 'px'
  container.style.height = '' + diameter + 'px'
  container.style.display = 'inline-block'
  container.style.background = color
  return {
    container: container,
  }
}

module.exports = newPaper
