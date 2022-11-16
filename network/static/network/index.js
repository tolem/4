console.log('Hello World!');
document.addEventListener('DOMContentLoaded', function() {
	let follow_tag = document.querySelector('#following');
	follow_tag =  (follow_tag && follow_tag.addEventListener('click', (event) =>  load_posts('following')));
	let allPost = document.querySelector('#all');
	allPost = allPost && allPost.addEventListener('click', () => load_posts('all'));
	let form_tag = document.querySelector('#post-form');
	let sub_btn = document.querySelector('#post-btn');
	sub_btn = (sub_btn && (sub_btn.disabled = true));
	let text_field = document.querySelector('#PostBox');

	if (text_field !== null) {
			text_field.onkeyup = () => {
                    if (document.querySelector('#PostBox').value.trim().length > 0)
                        document.querySelector('#post-btn').disabled = false;
                    else
                        document.querySelector('#post-btn').disabled = true;
                };

	}


	let postForm = (form_tag && form_tag.addEventListener('submit', post_msg));



	// By default, load all posts
	load_posts('all');

	// fetch post
	



});




function liked_post(id){
  fetch(`/posts/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      liked : id,
  })
  
}).then(()=> {document.getElementById(`${id}`).ariaPressed = 'true'}).then(() => fetch(`/posts/${id}`)).then(response => response.json()).then(res => {console.log(res) 
          document.getElementById(`comment${id}`).innerHTML = res.user_likes + ' likes';
        }).catch(err => console.log(err));
}

function unliked_post(id){
  fetch(`/posts/${id}`, {
  method: 'DELETE',
  body: JSON.stringify({
      liked : id,
  })
  
}).then(() => {document.getElementById(`${id}`).ariaPressed = 'false'}).then(() => fetch(`/posts/${id}`)).then(response => response.json()).then(res => {console.log(res) 
          document.getElementById(`comment${id}`).innerHTML = res.user_likes + ' likes';
        }).catch(err => console.log(err));  
}


function send_post(id, content){
  fetch(`/posts/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      content: content
  })
  
}).then(console.log('sent to server!')).catch(err=> console.log(err));
  
}


function view_post(query, counter){
	console.log(counter);
	let container = document.querySelector('#posts-section');
	if (counter > 1){
		container.innerHTML = "";
		console.log(container, 'done');
	}
	

	fetch(`/posts/${query}/posts?page=${counter}`).then(
		response => response.json()).then(
		posts => {
			console.log(posts)
		if (posts.error === "No posts."){
			container.innerHTML = "No post";
		} else{

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
            	liked_post(Number(post.id));
            	console.log(btn.ariaPressed);
          if (btn.ariaPressed === "false"){
                liked_post(Number(post.id));
                console.log('false');
                
            }
            else{
            	  unliked_post(Number(post.id));
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


          // console.log(`${post.id} `+ 'of this element has been clicked!');
         

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

function pagination (query) {
    fetch(`/posts/${query}/pages`)
    .then(response => response.json())
    .then(result => {
        if (result.pages > 1) {
                let counter = 1;
                let previous = document.getElementsByClassName('page-item');
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
                    const container = document.querySelector('#posts-section');
                    container.innerHTML = "";
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
                    // document.querySelector('#page-number').append(previous);
                    // document.querySelector('#page-number').append(next);

        }
    })
}

function load_posts(userposts) {
	event.preventDefault();
	const div_isactive = document.querySelectorAll('.post_toggle');
	// checks if div is DOM and update removes element
	  if (div_isactive !== null){
	    console.log(div_isactive);
	    div_isactive.forEach(posts => posts.remove());
	  }

	 if (userposts === "following"){
	 	document.querySelector("#post-form").style.display = 'none';
	 }
	 else{

	 	let userform =  document.querySelector("#post-form");
	 	userform = userform && (userform.style.display = 'block');
	 	const container = document.querySelector('#posts-section');


	 }


  	// Show title page! 
	 let title = document.querySelector('#title_page');

  	title = title && (title.innerHTML = `<h1>${userposts.charAt(0).toUpperCase() + userposts.slice(1)} Tweets</h1>`);

  // Show all posts
  view_post(userposts, 1);
  pagination(userposts);

  return 
} 




function post_msg(event){
		
	event.preventDefault()
	// alert('Hello')
	let content =  document.querySelector('#PostBox').value;
	console.log('Lami', 'TODO', content);
  

	fetch('/posts', {
	    method: 'POST',
	    body: JSON.stringify({
	        message: content
	    })
	  })
	  .then(response => response.json())
	  .then(result => {
	      // Print result
	      console.log(result);
	      document.querySelector('#PostBox').value = '';
	      document.querySelector('#post-btn').disabled = true;

	     
         	    
	      
	  });
	  load_posts('all');

	  return 
}











