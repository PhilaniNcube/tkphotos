const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function generateFavicons() {
  const logoPath = path.join(__dirname, "../public/logo.webp");
  const publicDir = path.join(__dirname, "../public");

  // Check if logo exists
  if (!fs.existsSync(logoPath)) {
    console.error("Logo file not found at:", logoPath);
    return;
  }

  console.log("Generating favicons from logo.webp...");

  try {
    // Generate favicon.ico (16x16, 32x32, 48x48)
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, "favicon-32x32.png"));

    await sharp(logoPath)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, "favicon-16x16.png"));

    // Generate Apple Touch Icons
    await sharp(logoPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, "apple-touch-icon.png"));

    await sharp(logoPath)
      .resize(120, 120)
      .png()
      .toFile(path.join(publicDir, "apple-touch-icon-120x120.png"));

    await sharp(logoPath)
      .resize(152, 152)
      .png()
      .toFile(path.join(publicDir, "apple-touch-icon-152x152.png"));

    // Generate Android Chrome Icons
    await sharp(logoPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, "android-chrome-192x192.png"));

    await sharp(logoPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, "android-chrome-512x512.png"));

    // Generate favicon.ico using the 32x32 as base
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, "favicon.ico"));

    // Generate additional sizes for web app manifest
    await sharp(logoPath)
      .resize(144, 144)
      .png()
      .toFile(path.join(publicDir, "icon-144x144.png"));

    await sharp(logoPath)
      .resize(72, 72)
      .png()
      .toFile(path.join(publicDir, "icon-72x72.png"));

    await sharp(logoPath)
      .resize(96, 96)
      .png()
      .toFile(path.join(publicDir, "icon-96x96.png"));

    console.log("✅ All favicons generated successfully!");
    console.log("Generated files:");
    console.log("- favicon.ico");
    console.log("- favicon-16x16.png");
    console.log("- favicon-32x32.png");
    console.log("- apple-touch-icon.png");
    console.log("- apple-touch-icon-120x120.png");
    console.log("- apple-touch-icon-152x152.png");
    console.log("- android-chrome-192x192.png");
    console.log("- android-chrome-512x512.png");
    console.log("- icon-72x72.png");
    console.log("- icon-96x96.png");
    console.log("- icon-144x144.png");
  } catch (error) {
    console.error("Error generating favicons:", error);
  }
}

generateFavicons();
