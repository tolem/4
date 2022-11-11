document.addEventListener('DOMContentLoaded',() => {console.log("content loaded")
          let editButton = document.querySelector('#editBtn')
          editButton = editButton && editButton.addEventListener('click', evnt => console.log('clicked')
      )
});
