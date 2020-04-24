//-----Element Initializtion-----
const toggler = document.querySelector("#toggle");

//-----Adding EventListener-----
toggler.addEventListener("click", toggleCurrent);

//-----Helper functions-----
function toggleCurrent(e) {
  if (e.target.classList.contains("null")) {
    const feature = document.querySelector("#feature");
    e.target.classList.toggle("null");
    e.target.classList.toggle("toggleToColapse");
    feature.classList.toggle("colapsed");
    feature.classList.toggle("expanding");
  } else if (e.target.classList.contains("toggleToColapse")) {
    const feature = document.querySelector("#feature");
    e.target.classList.toggle("toggleToColapse");
    e.target.classList.toggle("toggleToExpand");
    feature.classList.toggle("expanding");
    feature.classList.toggle("colapsing");
  } else if (e.target.classList.contains("toggleToExpand")) {
    const feature = document.querySelector("#feature");
    e.target.classList.toggle("toggleToExpand");
    e.target.classList.toggle("toggleToColapse");
    feature.classList.toggle("colapsing");
    feature.classList.toggle("expanding");
  }
}
