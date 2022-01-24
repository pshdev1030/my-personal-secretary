/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
]);

const withPlugins = require("next-compose-plugins");

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `https://dev.aistudios.com/:path*`,
      },
    ];
  },
};

module.exports = withPlugins([withTM({})], nextConfig);
