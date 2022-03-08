import "./style.css";
import UAParser from "ua-parser-js";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

let scene, camera, renderer;
let parser, result;

window.onload = () => {
  checkDeviceAndIOS();
};

async function checkDeviceAndIOS() {
  parser = new UAParser();
  result = parser.getResult();
  if (parser.getDevice().type !== "mobile") {
    document.body.innerHTML = "Not supported on non-mobile devices";
    return;
  }

  // https://immersive-web.github.io/webxr/explainer.html

  // Check to see if there is an XR device available that supports immersive AR
  // presentation (for example: displaying in a headset). If the device has that
  // capability the page will want to add an "Enter AR" button to the page (similar to
  // a "Fullscreen" button) that starts the display of immersive AR content.

  if (result.os.name !== "iOS") {
    document.querySelector(".iOS-container").remove();
    navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
      if (!supported) {
        window.body.innerHTML = "Web-XR not supported :/";
      }
      initWebXR();
    });
    return;
  }
}

function initWebXR() {
  // Add scene
  scene = new THREE.Scene();

  // Add renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;

  document.body.appendChild(renderer.domElement);

  // Add camera
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  // Append AR-Button to container
  document.body.appendChild(
    ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
  );
}
