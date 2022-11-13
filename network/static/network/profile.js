document.addEventListener('DOMContentLoaded',() => {
          console.log("content loaded")
          let editBtn = document.querySelectorAll('.editBtn');
          // editButton = editBtn && editBtn.addEventListener('click', (btn) => {});
          // if (editButton !== undefined){

            editBtn.forEach(button => {
                    button.onclick = function() {
                  console.log(this.dataset.post);
                  const postID = Number(this.dataset.post);
                  button.style.display = 'none';
                  submitEdit(postID, button)


          }
        })
          let removeLink = document.getElementById('following');
          removeLink = removeLink && removeLink.remove();
});



function send_post(id, content){
  fetch(`/posts/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      content: content
  })
  
}).then(console.log('sent to server!')).catch(err=> console.log(err));
  
}


function submitEdit(content_id, button){
  event.preventDefault();
  console.log('editing post')
  const editForm =  document.createElement('form');
  const formBox = document.createElement('textArea');
  const submitForm = document.createElement('input');
  const postContent = document.getElementById(`${content_id}`).innerHTML;
  const postSection = document.getElementById(`${content_id}`);
  const postBox = document.getElementsByClassName(`${content_id}`);
  const spaceBox = document.createElement('br');
  formBox.classList.add('form-control');
  submitForm.classList.add('btn', 'btn-danger');

  // adding attribtues to  form 
  editForm.setAttribute('method', 'PUT');
  submitForm.value = "Update tweet?";
  submitForm.setAttribute('type', 'submit');


  // prefills form with content 
  formBox.value = postContent;
  console.log(formBox.value,  postContent);

  postSection.style.display ='none';

  // appending childs element to form elements
  editForm.appendChild(formBox);
  editForm.appendChild(spaceBox);
  editForm.appendChild(submitForm);
  // console.log(postBox.childNodes)
  // // postBox.insertBefore(editForm, postBox.childNodes[1]);

  postSection.insertAdjacentElement("afterend", editForm);
  postSection.innerHTML = formBox.innerHTML;


  // postBox.replaceChild(editForm, postBox.childNodes[2]);
  editForm.onsubmit = () => {
    event.preventDefault();
      console.log('post updated!')
      postSection.innerHTML = formBox.value;
      postSection.style.display = 'block';
       button.style.display = 'inline';
      editForm.remove();
      // send  to server
      send_post(content_id, formBox.value);

    // postBox.replaceChild(postBox.childNodes[2], );

  }


  return
}


