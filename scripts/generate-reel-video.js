const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpeg = require('ffmpeg-static');

const SCENE1 = 'C:\\Users\\bunny\\.gemini\\antigravity\\brain\\be99dd99-65b1-4a29-ab73-9f7242be25c7\\vestiq_reel_scene1_hook_1790960313330.jpg';
const SCENE2 = 'C:\\Users\\bunny\\.gemini\\antigravity\\brain\\be99dd99-65b1-4a29-ab73-9f7242be25c7\\vestiq_reel_scene2_mismatch_1790960330155.jpg';
const SCENE3 = 'C:\\Users\\bunny\\.gemini\\antigravity\\brain\\be99dd99-65b1-4a29-ab73-9f7242be25c7\\vestiq_reel_scene3_engine_1790960347845.jpg';
const SCENE4 = 'C:\\Users\\bunny\\.gemini\\antigravity\\brain\\be99dd99-65b1-4a29-ab73-9f7242be25c7\\vestiq_reel_scene4_outro_1790960364612.jpg';

const desktopOut = path.join('C:', 'Users', 'bunny', 'OneDrive', 'Desktop', 'Vestiq_Official_Reel_1.mp4');
const projectOut = path.join(process.cwd(), 'public', 'vestiq_reel_1.mp4');

console.log('--- Generating Official Vestiq Instagram Reel Video (1080x1920) ---');

// Durations
const d1 = 5; // Scene 1
const d2 = 5; // Scene 2
const d3 = 6; // Scene 3
const d4 = 5; // Scene 4
const transition = 0.8;

// Offsets for xfade:
// offset 1 = d1 - transition = 5 - 0.8 = 4.2
// offset 2 = 4.2 + d2 - transition = 4.2 + 5 - 0.8 = 8.4
// offset 3 = 8.4 + d3 - transition = 8.4 + 6 - 0.8 = 13.6
// total duration = 13.6 + 5 = 18.6s

const filterComplex = [
  // 1. Scale & format each image to 1080x1920 with subtle slow cinematic push
  `[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuva420p[v0]`,
  `[1:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuva420p[v1]`,
  `[2:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuva420p[v2]`,
  `[3:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuva420p[v3]`,

  // 2. Smooth xfades between scenes
  `[v0][v1]xfade=transition=smoothleft:duration=${transition}:offset=4.2[x1]`,
  `[x1][v2]xfade=transition=circlecrop:duration=${transition}:offset=8.4[x2]`,
  `[x2][v3]xfade=transition=fade:duration=${transition}:offset=13.6,format=yuv420p[vout]`,

  // 3. Audio generation: High-tech ambient drone with subtle rhythmic pulse
  `anoisesrc=d=18.6:c=pink:r=44100:a=0.015,lowpass=f=280[noise];` +
  `sine=f=55:d=18.6[bass1];` +
  `sine=f=110:d=18.6[bass2];` +
  `[bass1][bass2]amix=inputs=2:weights=0.5 0.3[bass];` +
  `[noise][bass]amix=inputs=2:weights=0.2 0.8,volume=0.4,afade=t=in:ss=0:d=1.5,afade=t=out:st=16.5:d=2.1[aout]`
].join(';');

const cmd = [
  `"${ffmpeg}"`,
  `-y`,
  `-loop 1 -t ${d1} -i "${SCENE1}"`,
  `-loop 1 -t ${d2} -i "${SCENE2}"`,
  `-loop 1 -t ${d3} -i "${SCENE3}"`,
  `-loop 1 -t ${d4} -i "${SCENE4}"`,
  `-filter_complex "${filterComplex}"`,
  `-map "[vout]"`,
  `-map "[aout]"`,
  `-c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -r 30`,
  `-c:a aac -b:a 192k`,
  `-movflags +faststart`,
  `"${desktopOut}"`
].join(' ');

console.log('Running FFmpeg rendering command...');
execSync(cmd, { stdio: 'inherit' });

console.log('✓ Successfully rendered video to Desktop:', desktopOut);

// Also copy to public directory for web preview
fs.copyFileSync(desktopOut, projectOut);
console.log('✓ Copied to web public folder:', projectOut);
