const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      const sourceMapLoaderRule = webpackConfig.module.rules.find((rule) =>
        Array.isArray(rule.oneOf)
      );

      if (sourceMapLoaderRule) {
        sourceMapLoaderRule.oneOf = sourceMapLoaderRule.oneOf.map((rule) => {
          // Đây là rule của source-map-loader
          if (
            rule.enforce === "pre" &&
            rule.use &&
            rule.use.some((loader) =>
              typeof loader === "string"
                ? loader.includes("source-map-loader")
                : loader.loader?.includes("source-map-loader")
            )
          ) {
            return {
              ...rule,
              exclude: /node_modules\/face-api\.js/,
            };
          }
          return rule;
        });
      }

      return webpackConfig;
    },
  },
};
