import "./style.css";
import UAParser from "ua-parser-js";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

// Device Check relevant
let parser, result;

//THREE JS WEB-XR AR relevant
let scene, camera, renderer;
let controller;

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
    // navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
    //   if (!supported) {
    //     window.body.innerHTML = "Web-XR not supported :/";
    //   }
    initWebXR();
    animate();
    // });
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
  document.body.appendChild(ARButton.createButton(renderer));
  // Now we can add the Geometry
  const geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(
    Math.PI / 2
  );

  function onSelect() {
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -0.3).applyMatrix4(controller.matrixWorld);
    mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
    scene.add(mesh);
  }

  // Add the controller for the AR
  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  // For resize of window
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
// add render loop
function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  renderer.render(scene, camera);
}
