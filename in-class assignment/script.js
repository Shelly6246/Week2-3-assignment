
const draggables = document.querySelectorAll(".draggable");

draggables.forEach((el) => {
  let isDragging = false;
  let offsetX, offsetY;

  el.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    el.style.cursor = "grab";
  });
});


let isPanning = false;
let startX, startY, scrollLeft, scrollTop;
let velocityX = 0, velocityY = 0;
let lastX = 0, lastY = 0;
let inertiaInterval = null;


window.addEventListener("mousedown", (e) => {
  
  if (e.target.classList.contains("draggable")) return;

  isPanning = true;
  startX = e.pageX;
  startY = e.pageY;
  scrollLeft = window.scrollX;
  scrollTop = window.scrollY;
  lastX = startX;
  lastY = startY;

  document.body.style.cursor = "grabbing";

 
  if (inertiaInterval) clearInterval(inertiaInterval);
});


window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;

  const x = e.pageX;
  const y = e.pageY;
  const walkX = x - startX;
  const walkY = y - startY;
  window.scrollTo(scrollLeft - walkX, scrollTop - walkY);

  
  velocityX = x - lastX;
  velocityY = y - lastY;
  lastX = x;
  lastY = y;
});


window.addEventListener("mouseup", () => {
  if (!isPanning) return;
  isPanning = false;
  document.body.style.cursor = "default";

  
  inertiaInterval = setInterval(() => {
    window.scrollBy(-velocityX * 0.5, -velocityY * 0.5);
    velocityX *= 0.9; 
    velocityY *= 0.9;

    if (Math.abs(velocityX) < 0.5 && Math.abs(velocityY) < 0.5) {
      clearInterval(inertiaInterval);
    }
  }, 16); 
});
