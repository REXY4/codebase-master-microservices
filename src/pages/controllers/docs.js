setInterval(() => {
  document.querySelectorAll('.response .response-col_status').forEach((el, i) => {
    el.style.paddingTop = '17px'
    el.style.fontSize = '14px'
  })
  document.querySelectorAll('.response-col_description__inner .renderedMarkdown > p').forEach((el, i) => {
    el.style.marginTop = '5px'
    el.style.marginBottom = '0px'
  })
  document.querySelectorAll('.swagger-ui .model-title').forEach((el, i) => {
    el.style.fontSize = '14px'
  })
}, 1000)
