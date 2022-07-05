module.exports = {
  style: {
    postcss: {
      loaderOptions: (postcssLoaderOptions) => {
        postcssLoaderOptions.postcssOptions.plugins = [
          require("tailwindcss/nesting"),
          require("tailwindcss"),
          // require("postcss-mixins"),
          "postcss-flexbugs-fixes",
          [
            "postcss-preset-env",
            {
              autoprefixer: {
                flexbox: "no-2009"
              },
              stage: 0
            }
          ]
        ]

        return postcssLoaderOptions
      }
    }
  }
}
