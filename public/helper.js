window.Toast = function (title, type, msg) {
  let toast = document.createElement("div");
  let color = "text-white";
  if (type == "danger") color = "text-red-600";
  if (type == "warning") color = "text-yellow-600";
  if (type == "success") color = "text-emerald-600";
  toast.innerHTML = `<div class="absolute lg:w-md bottom-5 left-5 right-5 lg:left-3/4 bg-black/30 rounded-md p-4 backdrop-blur-xl border-2 border-slate-500">
  <span class="flex font-extrabold ${color} text-lg capitalize">${title}
  <button class="ml-auto p-2 text-white stroke-2 bg-gray-800 hover:bg-gray-900 rounded-md" onClick="killToast(this);">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
</svg>
  </button></span>
  <p class="font-semibold text-slate-300 text-sm normalize">${msg}</p>
</div>`;
  document.body.append(toast);
  let to = setTimeout(() => {
    toast?.remove();
  }, 5000);
  toast.addEventListener("mouseenter", (e) => {
    clearTimeout(to);
  });
  toast.addEventListener("mouseleave", (e) => {
    to = setTimeout(() => {
      toast?.remove();
    }, 5000);
  });
};
window.killToast = function (el) {
  el = el.parentElement;
  el = el.parentElement;
  el.remove();
};
//emit a custom app-ready event
window.dispatchEvent(new Event("app-ready"));
