console.log('Hello World!');
document.addEventListener('DOMContentLoaded', function() {
	let follow_tag = document.querySelector('#following');
	follow_tag =  (follow_tag && follow_tag.addEventListener('click', (event) =>  load_posts('following')));
	document.querySelector('#all').addEventListener('click', () => load_posts('all'));
	let form_tag = document.querySelector('#post-form');
	let sub_btn = document.querySelector('#post-btn');
	sub_btn = (sub_btn && (sub_btn.disabled = true));
	let text_field = document.querySelector('#PostBox');

	if (text_field !== null) {
			text_field.onkeyup = () => {
                    if (document.querySelector('#PostBox').value.length > 0)
                        document.querySelector('#post-btn').disabled = false;
                    else
                        document.querySelector('#post-btn').disabled = true;
                };

	}


	let postForm = (form_tag && form_tag.addEventListener('submit', post_msg));


	// By default, load all posts
	load_posts('all');


});




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

	  return 
}



function view_post(query){
	fetch(`/posts/${query}`).then(
		response => response.json()).then(
		posts => console.log(posts)
		);
}


function load_posts(userposts) {
	event.preventDefault();

  // const div_isactive = document.querySelectorAll('.div_toggle');

  // // checks if div is DOM and update removes element
  // if (div_isactive !== null){
  //   console.log(div_isactive);
  //   div_isactive.forEach(msg => msg.remove());

  // }

  // Show the mailbox name
  document.querySelector('#posts-section').innerHTML = `<h3>${userposts.charAt(0).toUpperCase() + userposts.slice(1)}</h3>`;

  // Show all posts
  // view_emails(mailbox); 

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