document.addEventListener('DOMContentLoaded',() => {
          console.log("content loaded")
          let editBtn = document.querySelectorAll('.editBtn');
          // editButton = editBtn && editBtn.addEventListener('click', (btn) => {});
          // if (editButton !== undefined){

            editBtn.forEach(button => {
                    button.onclick = function() {
                  console.log(this.dataset.post)
          }
        })
          let removeLink = document.getElementById('following');
          removeLink = removeLink && removeLink.remove();
});
