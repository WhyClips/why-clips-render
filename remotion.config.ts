import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Software WebGL (SwiftShader) flags for headless Chrome — needed for
// three.js rendering on CI runners without a GPU.
Config.setChromiumOptions({
  args: [
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
    "--disable-gpu-sandbox",
  ],
});
