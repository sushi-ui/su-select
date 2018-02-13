module.exports = {
  sourceMap: false,
  plugins: {
    'postcss-import': {},
    // 'postcss-cssnext': {
    //   warnForDuplicates: false,
    // },
    cssnano: {
      preset: 'advanced',
      autoprefixer: {
        add: true
      }
    },
    autoprefixer: {}
  }
}
