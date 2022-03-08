import "./style.css";
import UAParser from "ua-parser-js";

checkDeviceAndIOS();

function checkDeviceAndIOS() {
  let parser = new UAParser();
  let result = parser.getResult();

  if (parser.getDevice().type !== "mobile") {
    document.body.innerHTML = "Not supported on non-mobile devices";
    return;
  }

  if (result.os.name !== "iOS") {
    document.querySelector(".iOS-container").remove();
    return;
  }
  document.querySelector(".other-threeD-container").remove();
}
