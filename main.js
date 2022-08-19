import "./style.scss";
import CExample from "./component/cExample";
import CRefractTest from "./component/cRefractTest";
import CSlider from "./component/cSlider";

window.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname;
  switch (path) {
    case "/slider/":
      new CSlider();
      break;
    case "/refract/":
      console.log(path);
      new CRefractTest();
      break;
    default:
      new CExample();
  }
});
