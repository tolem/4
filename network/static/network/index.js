console.log('Hello World!');
document.addEventListener('DOMContentLoaded', function() {
	let follow_tag = document.querySelector('#following');
	document.querySelector('#page-number').innerHTML = '';
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




function send_post(id, content){
  fetch(`/posts/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      content: content
  })
  
}).then(console.log('sent to server!')).catch(err=> console.log(err));
  
}


function view_post(query, counter){
	const container = document.querySelector('#posts-section');

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
           comment.innerHTML = ` ${post.user_likes} <br/> Comment`;




           editPost.setAttribute('href', '#');
           editPost.setAttribute('role', 'button');
           header.setAttribute('title', `user profile is ${post.author}`);
           headerLink.setAttribute('href', `http://localhost:8000/profile/${post.author}`);
           headerLink.style.textDecoration = 'none';
           headerLink.style.color = '#808080';
           const authorPost = post.author.toLowerCase();
           	headerLink.appendChild(header);
     		innerDiv.appendChild(headerLink);

     		fetch(`/user`).then(
			response => response.json()).then( profile => {
			 if ( profile && profile.user === authorPost){
				headerLink.appendChild(editPost);
				}
			else{
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
  			


          // // open email in new view
          // open_email(email_id);

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




function updatePost(id, addr){
  fetch(`/posts/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      archived: !(bol)
  })
  
}).then(() => load_mailbox(addr));
  
}






