module.exports = (ctx) => {
  if (ctx.env === 'development') {
    return {};
  }
  return {
    plugins: [
      require('autoprefixer')({
        browsers: ["Chrome >= 50", "Firefox >= 45"],
      }),
    ],
  };
}
