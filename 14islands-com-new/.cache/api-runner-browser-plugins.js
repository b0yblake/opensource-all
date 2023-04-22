module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-image/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-prismic-previews/gatsby-browser.js'),
      options: {"plugins":[],"repositoryName":"14islands","promptForAccessToken":true,"apiEndpoint":"https://14islands.cdn.prismic.io/api/v2","lang":"*","pageSize":100,"imageImgixParams":{"auto":"compress,format","fit":"max","q":50},"imagePlaceholderImgixParams":{"w":100,"blur":15},"toolbar":"new"},
    },{
      plugin: require('../node_modules/gatsby-plugin-transition-link/gatsby-browser.js'),
      options: {"plugins":[],"injectPageProps":false},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"14islands","short_name":"14islands","start_url":"/","background_color":"#fff","display":"minimal-ui","icon":"src/assets/favicon/favicon.png","include_favicon":true,"cache_busting_mode":"none","legacy":true,"theme_color_in_head":true,"crossOrigin":"anonymous","cacheDigest":null},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
