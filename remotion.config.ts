import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// NOTE: Remotion 4.0.545 has no Config.setChromiumOptions. Software WebGL is
// selected on the render command instead:
//   npx remotion render ... --gl angle --chromium-flags='{"enable-unsafe-swiftshader":true}'
