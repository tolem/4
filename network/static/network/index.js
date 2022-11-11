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


});





function view_post(query){
	const container = document.querySelector('#posts-section');

	fetch(`/posts/${query}`).then(
		response => response.json()).then(
		posts => {console.log(posts)
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




           // const archive_btn = document.createElement('button');

           parentDiv.classList.add("card", "post_toggle");
           innerDiv.classList.add("card-body");
           header.classList.add('card-title');
           editPost.classList.add("card-link", "btn-sm", "btn-primary");
           contentPost.classList.add('card-text');

           header.innerHTML = post.author;
           editPost.innerHTML = 'Edit';
           contentPost.innerHTML = `${post.content} <br/> <span style=color:grey;> ${post.timestamps}</span> <br/>`
           btn.innerHTML = `<ion-icon name="heart"></ion-icon> `
           comment.innerHTML = `${post.self} <br/> Comment`

           // console.log(post.author.id, post.author)




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
     		innerDiv.appendChild(btn);
     		innerDiv.appendChild(comment);
     		innerDiv.appendChild(delimiter);
     		parentDiv.appendChild(innerDiv);
            container.appendChild(parentDiv);

            




           editPost.addEventListener('click', function() {
           	// creates form field
           	const formDiv = document.createElement('form');
           	formDiv.id = post.id;
           	const editPost = document.createElement('textArea');
           	const submitPost = document.createElement('input');
          

          console.log(`${post.id} `+ 'of this element has been clicked!')

          // // open email in new view
          // open_email(email_id);

});






       }


				);
		}
		).catch(err=>console.log(err));

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

  	title = title && (title.innerHTML = `<h1>${userposts.charAt(0).toUpperCase() + userposts.slice(1)} Posts</h1>`);

  // Show all posts
  view_post(userposts)

  return 
} 






// // Shows one page and hides the other two
// function showPage(page) {

//     // Hide all of the divs:
//     document.querySelector('#PostForm').forEach(div => {
//         div.style.display = 'none';
//     });

//     // Show the div provided in the argument
//     document.querySelector(`#content`).style.display = 'block';
//     document.querySelector(`#content`).innerHTML = 'page'; 

// }

// // Wait for page to loaded:
// document.addEventListener('DOMContentLoaded', function() {

//     // Select all buttons
//     document.querySelectorAll('.nav-link').forEach(nav => {

//         // When a button is clicked, switch to that page
//         nav.onclick = function() {
//             showPage(this.dataset.page);
//         }
//     })
// });

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