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
          const profileName = document.getElementById('username').innerHTML;
          console.log(profileName);
          view_post(profileName, 1);
          pagination(profileName);







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




function liked(id){
  fetch(`/posts/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      liked : id,
  })
  
}).then(()=> {document.getElementById(`${id}`).ariaPressed = 'true'}).then(() => fetch(`/posts/${id}`)).then(response => response.json()).then(res => {console.log(res) 
          document.getElementById(`comment${id}`).innerHTML = res.user_likes + ' likes';
        }).catch(err => console.log(err));
}

function unliked(id){
  fetch(`/posts/${id}`, {
  method: 'DELETE',
  body: JSON.stringify({
      liked : id,
  })
  
}).then(() => {document.getElementById(`${id}`).ariaPressed = 'false'}).then(() => fetch(`/posts/${id}`)).then(response => response.json()).then(res => {console.log(res) 
          document.getElementById(`comment${id}`).innerHTML = res.user_likes + ' likes';
        }).catch(err => console.log(err));  
}



function view_post(query, counter){
  const container = document.querySelector('#posts-section');
  if (counter === 1){
    console.log("do not rehydrate page");
  }
  else{ container.innerHTML = "";

   fetch(`/profilepost/${query}/post?page=${counter}`)
  .then(
    response => response.json())
  .then(
    posts => {
      console.log(posts)
    if (posts.error === "No posts."){
      container.innerHTML = "No post";
    } 
    
    else{

      posts.forEach( post => { 

    
      const parentDiv = document.createElement('div');
            const innerDiv =  document.createElement('div');
            const header = document.createElement('h5');
            const editPost = document.createElement('a');
            const contentPost = document.createElement('p');
            const comment = document.createElement('span');
            const delimiter = document.createElement('br');
            const btn = document.createElement('span');
            const headerLink = document.createElement('a');
            const timestamp = document.createElement('span');




           // const archive_btn = document.createElement('button');

           parentDiv.classList.add("card", "post_toggle");
           innerDiv.classList.add("card-body");
           header.classList.add('card-title');
           editPost.classList.add("card-link", "btn-sm", "btn-primary");
           contentPost.classList.add('card-text');

           header.innerHTML = post.author;
           editPost.innerHTML = 'Edit';
           contentPost.innerHTML = post.content;
           timestamp.innerHTML = `<br/> <span style=color:grey;> ${post.timestamps}</span> <br/>`
           btn.innerHTML = `<ion-icon name="heart"></ion-icon>`;
           comment.innerHTML = ` ${post.user_likes} likes <br/> Comment`;




           editPost.setAttribute('href', '#');
           editPost.setAttribute('role', 'button');
           header.setAttribute('title', `user profile is ${post.author}`);
           headerLink.setAttribute('href', `http://localhost:8000/profile/${post.author}`);
           btn.id = post.id;
           comment.id = `comment${post.id}`;
           headerLink.style.textDecoration = 'none';
           headerLink.style.color = '#808080';
           const authorPost = post.author.toLowerCase();
           headerLink.appendChild(header);
         innerDiv.appendChild(headerLink);

        fetch(`/user`).then(
      response => response.json()).then( profile => {

      if (profile.message){
        // if user is not signed in remove like button
        btn.remove();
      }
      else if ( profile && profile.user === authorPost){
        // if current user is author removes like button
        headerLink.appendChild(editPost);
        btn.remove();

        }
      else{
      btn.onclick = () => {

              console.log("clicked");
              liked(Number(post.id));
              console.log(btn.ariaPressed);
          if (btn.ariaPressed === "false"){
                liked(Number(post.id));
                console.log('false');
                
            }
            else{
                unliked(Number(post.id));
                console.log('true');
            }

            }


        console.log(profile.message);

      }
      }
    ).catch(err=>console.log(err));

           
        innerDiv.appendChild(contentPost);
        innerDiv.appendChild(timestamp);
        innerDiv.appendChild(btn);
        innerDiv.appendChild(comment);
        innerDiv.appendChild(delimiter);
        parentDiv.appendChild(innerDiv);
            container.appendChild(parentDiv);






           


           editPost.addEventListener('click', function() {
            event.preventDefault();
            // creates form field
          const editForm =  document.createElement('form');
        const formBox = document.createElement('textArea');
        const spaceBox = document.createElement('br');
        const submitForm = document.createElement('button');
        const postContent = contentPost.innerHTML;
        editPost.style.display = 'none';
        formBox.classList.add('form-control');
        submitForm.classList.add('btn', 'btn-danger');


        // adding attribtues to  form 
        editForm.setAttribute('method', 'PUT');
        submitForm.innerHTML = "commit tweet?";
        submitForm.setAttribute('type', 'submit');


         // prefills form with content 
        formBox.value = postContent;
        console.log(formBox.value);

        contentPost.style.display = 'none';

         // appending childs element to form elements
        editForm.appendChild(formBox);
        editForm.appendChild(spaceBox);
        editForm.appendChild(submitForm);

        contentPost.insertAdjacentElement("afterend", editForm);
        contentPost.innerHTML = formBox.innerHTML;


         

        editForm.onsubmit = () => {
          event.preventDefault();
            console.log('post updated!')
            contentPost.innerHTML = formBox.value;
            contentPost.style.display = 'block';
             editPost.style.display = 'inline';
            editForm.remove();
            // send  to server
            send_post(post.id, formBox.value);

  }
        


      

});






       }


        );
    }
    }
    ).catch(err=>console.log(err));
   } 
  
 


}

function pagination (query) {
    fetch(`/profilepost/${query}/pages`)
    .then(response => response.json())
    .then(result => {
       let previous = document.getElementsByClassName('page-item');
       let next = document.getElementsByClassName('page-item');
       previous[0].style.display = 'none';
       next[1].style.display = 'none';

        if (result.pages > 1) {
                let counter = 1;
               

                console.log(previous);
                            
                let next = document.getElementsByClassName('page-item')
         

                previous[0].addEventListener('click', function () {
                    counter--
                   view_post(query, counter)
                    if (counter === 1) {
                        previous[0].style.display = 'none';
                        next[1].style.display = 'block';
                    } 
                    else {
                        next[1].style.display = 'block';
                    }
                });

                next[1].addEventListener('click', function () {
                    counter++
                    view_post(query, counter)
                    if (counter >= result.pages) {
                        next[1].style.display = 'none'
                        previous[0].style.display = 'block'
                    } 
                        next[1].style.display = 'block'
                        console.log(counter, result.pages)

                        if (result.pages === counter){
                          next[1].style.display = 'none';
                        }

                    
                })
                    previous[0].style.display = 'none'
             

        }
    })
}
