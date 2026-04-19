function changing(x) {
  x.classList.toggle("change");
  document.getElementById("dropitem").classList.toggle("show");
}
window.addEventListener("scroll", function () {
  let header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 750);
});


