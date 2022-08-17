import "./style.scss";
import CExample from "./component/cExample";
import CRefractTest from "./component/cRefractTest";

window.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname;
  switch (path) {
    case "/refract/":
      console.log(path);
      new CRefractTest();
      break;
    default:
      new CExample();
  }
});
