document.addEventListener('DOMContentLoaded',() => {
          console.log("content loaded")
          let editBtn = document.querySelectorAll('.editButton');
          console.log(editBtn);
            editBtn.forEach(button => {
                  button.onclick = function() {
                  // console.log(this.dataset.post);
                  const postID = Number(this.dataset.post);
                  button.style.display = 'none';
                  submitEdit(postID, button);
                  console.log("Hello");
                }


            console.log(document.getElementById(`${button.dataset.post}box`), 'posts');
            document.getElementById(`${button.dataset.post}box`).addEventListener('click', () => {
            console.log("tweet was liked");
            liked_post(button.dataset.post)});
                
        });

          document.querySelectorAll('.tweetsdiv').forEach(tweetsbox => {  tweetsbox.onclick = function() {
             console.log(document.getElementById(`${this.dataset.tweets}box`), 'posts');
            document.getElementById(`${this.dataset.tweets}box`).addEventListener('click', () => {
            console.log("tweet was liked", this.dataset.tweets);
            console.log(document.getElementById(`${this.dataset.tweets}box`).ariaPressed);
            if (document.getElementById(`${this.dataset.tweets}box`).ariaPressed === "false"){
                console.log("hello");
                liked_post(Number(this.dataset.tweets));
            }
            else{

              unliked_post(Number(this.dataset.tweets));
            }

            


          })};

          })
          let removeLink = document.getElementById('following');
          removeLink = removeLink && removeLink.remove();

          let followBtn = document.getElementById("followBtn");
          foll = followBtn && (followBtn.innerHTML = "Follow");
          console.log(foll);
          followBtn = followBtn && (followBtn.onclick = function()  {
            

            console.log(this.dataset.username, this.ariaPressed)
            if (this.ariaPressed === "true"){
                this.ariaPressed = "false";
                this.innerHTML = "Follow";
        
            }
            else{ 
               
               this.ariaPressed = "true";
               this.innerHTML = "Unfollow";

            }

          follow(this.dataset.username, this.innerHTML);
             
          })





});


function follow(username, state){
  console.log(state);
  if (state === "Follow"){
    fetch(`/follow/${username}`, {
  method: 'PUT',
  body: JSON.stringify({
      follow: "username"
  })
  
}).then(() => {
  fetch(`/follow/${username}`).then( response => response.json()).then(res => {
    let counter = document.getElementById('countbadge')
    counter = counter && (counter.innerHTML = res.followers); 
    let curr_state = document.getElementById("followBtn");
    // curr_state.ariaPressed = "false";
    // console.log(!curr_state, 'check', (eval(curr_state)));
    curr_state.innerHTML = "UnFollow";
    console.log(res, curr_state.innerHTML); 
  });

}).catch(err=> console.log(err));

  }

  else if (state === "Unfollow"){

  fetch(`/follow/${username}`, {
    method: 'DELETE',
    body: JSON.stringify({
      Unfollow: "username"
  })}).then(() => {
  fetch(`/follow/${username}`).then( response => response.json()).then(res => {
    let counter = document.getElementById('countbadge')
    counter = counter && (counter.innerHTML = res.followers); 
    let curr_state = document.getElementById("followBtn");
    curr_state.innerHTML = "Follow";

    curr_state.ariaPressed = "true"
    // console.log(!curr_state, 'check', (eval(curr_state)));
   console.log(res, curr_state); 
  });

}).catch(err=> console.log(err));

}
}


function send_post(id, content){
  fetch(`/posts/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      content: content
  })
  
}).then(console.log('sent to server!')).catch(err=> console.log(err));
  
}


function liked_post(id){
  fetch(`/posts/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      liked : id,
  })
  
}).then(()=> {document.getElementById(`${id}box`).ariaPressed = 'true'}).then(() => fetch(`/posts/${id}`)).then(response => response.json()).then(res => {console.log(res) 
          document.getElementById(`${id}post`).innerHTML = res.user_likes + ' likes';
        }).catch(err => console.log(err));
}

function unliked_post(id){
  fetch(`/posts/${id}`, {
  method: 'DELETE',
  body: JSON.stringify({
      liked : id,
  })
  
}).then(() => {document.getElementById(`${id}box`).ariaPressed = 'false'}).then(() => fetch(`/posts/${id}`)).then(response => response.json()).then(res => {console.log(res) 
          document.getElementById(`${id}post`).innerHTML = res.user_likes + ' likes';
        }).catch(err => console.log(err));  
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
  // editForm.appendChild(spaceBox);
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
function pagination (query) {
    fetch(`/posts/${query}/pages`)
    .then(response => response.json())
    .then(result => {
        if (result.pages > 1) {
                let counter = 1;
                let previous = document.getElementsByClassName('page-item')
                            
                let next = document.getElementsByClassName('page-item')
         

                previous.addEventListener('click', function () {
                    counter--
                    send_post(counter)
                    if (counter === 1) {
                        previous.style.display = 'none'
                        next.style.display = 'block'
                    } 
                    else {
                        next.style.display = 'block'
                    }
                })

                next.addEventListener('click', function () {
                    counter++
                    send_post(counter)
                    if (counter >= result.pages) {
                        next.style.display = 'none'
                        previous.style.display = 'block'
                    } 
                        next.style.display = 'block'
                    
                })
                    previous.style.display = 'none'
                    // document.querySelector('#page-number').append(previous)
                    // document.querySelector('#page-number').append(next)

        }
    })
}


