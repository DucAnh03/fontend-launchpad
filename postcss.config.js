const CracoAlias = require('craco-alias');

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: { /* your alias config */ },
    },
  ],
};