module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ["@babel/plugin-transform-modules-commonjs", {"strictMode": false}],
    ["@babel/plugin-syntax-dynamic-import"]
  ]
}
