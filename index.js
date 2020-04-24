//-----Global variable-----
let ctx;
let color = "#000000";
let strokeWidth = 5;
let pickedFeature = "pencil";
let x1 = 0;
let y1 = 0;
let globalXOffset = 0;

//-----Element Initializtion-----
const strokeRange = document.querySelector("#strokeRange");
const utilitiesButtons = document.querySelector(".utilities");
const canvas = document.querySelector("#space");
const clearBtn = document.querySelector("#clearBtn");
const colorPicker = document.querySelector("#colorPicker");

//-----Adding EventListener-----
window.addEventListener("load", init);
window.addEventListener("resize", updateOffsets);
utilitiesButtons.addEventListener("click", updatePickedFeature);
strokeRange.addEventListener("input", updateStrokeWidth);
clearBtn.addEventListener("click", clearCanvas);
colorPicker.addEventListener("change", updateColor);

//-----Helper functions-----
function init() {
  const drawSpace = document.querySelector("#drawSpaceContainer");
  var rect = drawSpace.getBoundingClientRect();
  globalXOffset = rect.left;

  ctx = canvas.getContext("2d");
  canvas.height = rect.bottom - rect.top;
  canvas.width = rect.right - rect.left;

  let painting = false;
  function startPosition(e) {
    painting = true;
    //set drawing properties
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.fillStyle = color;
    ctx.beginPath();

    switch (pickedFeature) {
      case "pencil":
        draw(e);
        break;
      case "eraser":
        ctx.strokeStyle = "white";
        draw(e);
        break;
      case "fillRect":
      case "unfillRect":
        createBox(e);
        break;
      case "fillCircle":
      case "unfillCircle":
        createCircle(e);
        break;
    }
  }
  function finishedPosition(e) {
    if (painting === true) {
      painting = false;
      ctx.beginPath();
      switch (pickedFeature) {
        case "fillRect":
        case "unfillRect":
          removeBox(e);
          break;
        case "fillCircle":
        case "unfillCircle":
          removeCircle(e);
          break;
      }
      ctx.stroke();
    }
  }
  function draw(e) {
    if (painting) {
      switch (pickedFeature) {
        case "pencil":
          drawStroke(e);
          break;
        case "eraser":
          drawStroke(e);
          break;
        case "fillRect":
        case "unfillRect":
          drawBox(e);
          break;
        case "fillCircle":
        case "unfillCircle":
          drawCircle(e);
          break;
      }
    }
  }
  drawSpace.addEventListener("mousedown", startPosition);
  drawSpace.addEventListener("mouseup", finishedPosition);
  drawSpace.addEventListener("mousemove", draw);
}

function updateOffsets(e) {
  const drawSpace = document.querySelector("#drawSpaceContainer");
  var rect = drawSpace.getBoundingClientRect();
  globalXOffset = rect.left;
}

//set features
function updateStrokeWidth(e) {
  const strokeValue = document.querySelector("#strokeValue");
  strokeValue.innerHTML = e.target.value;
  strokeWidth = e.target.value;
}

function updatePickedFeature(e) {
  if (e.target.tagName === "BUTTON" && e.target.id !== pickedFeature) {
    previousPickedButton = document.querySelector(".selected");
    previousPickedButton.classList.toggle("selected");
    e.target.classList.toggle("selected");
    pickedFeature = e.target.id;
  }
}

function clearCanvas(e) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function updateColor(e) {
  color = e.target.value;
  e.target.style.backgroundColor = e.target.value;
}
//end set features.

//creation of pencil stoke and erasor stroke.
function drawStroke(e) {
  ctx.lineCap = "round";
  ctx.lineTo(e.clientX - globalXOffset, e.clientY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - globalXOffset, e.clientY);
}
//end creation of pencil stoke and erasor stroke.

//Creation of rectangle.
function createBox(e) {
  const box = document.createElement("div");
  box.id = "template";
  box.style.border = "1px solid black";
  box.style.position = "absolute";
  x1 = e.clientX - globalXOffset;
  y1 = e.clientY;
  box.style.top = y1 + "px";
  box.style.left = x1 + "px";
  const drawSpace = document.querySelector("#drawSpaceContainer");
  drawSpace.appendChild(box);
}

function drawBox(e) {
  let box = document.querySelector("#template");
  x2 = e.clientX - globalXOffset;
  y2 = e.clientY;
  box.style.top = Math.min(y1, y2) + "px";
  box.style.left = Math.min(x1, x2) + "px";
  box.style.height = Math.abs(y2 - y1) + "px";
  box.style.width = Math.abs(x2 - x1) + "px";
}

function removeBox(e) {
  x2 = e.clientX - globalXOffset;
  y2 = e.clientY;
  if (pickedFeature === "fillRect") {
    ctx.fillRect(
      Math.min(x1, x2),
      Math.min(y2, y1),
      Math.abs(x2 - x1),
      Math.abs(y2 - y1)
    );
  } else if (pickedFeature === "unfillRect") {
    ctx.strokeRect(
      Math.min(x1, x2),
      Math.min(y2, y1),
      Math.abs(x2 - x1),
      Math.abs(y2 - y1)
    );
  }

  box = document.querySelector("#template");
  box.parentNode.removeChild(box);
}
//end creation of rectangle.

//Creation of circle.
function createCircle(e) {
  createBox(e);
  const circle = document.querySelector("#template");
  circle.style.borderRadius = "50%";
}
function drawCircle(e) {
  drawBox(e);
}
function removeCircle(e) {
  const circle = document.querySelector("#template");
  x2 = e.clientX - globalXOffset;
  y2 = e.clientY;
  [x1, y1, x2, y2] = getDiagonalCorners(x1, y1, x2, y2);

  //length of the sides
  sx = x2 - x1;
  sy = y2 - y1;

  if (sx <= sy) {
    ctx.save();
    scalex = 1;
    scaley = sy / sx;
    ctx.translate(0, (1 - scaley) * y1);
    ctx.scale(scalex, scaley);
    ctx.arc(x1 + sx / 2, y1 + sx / 2, sx / 2, 0, 2 * Math.PI, false);
  } else {
    ctx.save();
    scalex = sx / sy;
    scaley = 1;
    ctx.translate((1 - scalex) * x1, 0);
    ctx.scale(scalex, scaley);
    ctx.arc(x1 + sy / 2, y1 + sy / 2, sy / 2, 0, 2 * Math.PI, false);
  }
  if (pickedFeature === "fillCircle") {
    ctx.fill();
  } else if (pickedFeature === "unfillCircle") {
    ctx.stroke();
  }
  ctx.scale(1, 1);
  ctx.restore();

  circle.parentNode.removeChild(circle);
}
function getDiagonalCorners(p1, q1, p2, q2) {
  x1 = p1 < p2 ? p1 : p2;
  y1 = q1 < q2 ? q1 : q2;
  x2 = p1 > p2 ? p1 : p2;
  y2 = q1 > q2 ? q1 : q2;
  return [x1, y1, x2, y2];
}
