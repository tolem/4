function editButton(post){
	const editForm =  document.createElement('form');
	const formBox = document.createElement('textArea');
	const submitForm = document.createElement('input');
	const postSection = document.getElementById('posts-section');
	const postContent = document.getElementById('postBox').value;

	// prefills form with contentvalue
	formBox.formBox.value = postContent;

	submitForm.onsubmit = () => {
		postSection.innerHTML = formBox;

	}






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


function updatePost(id, addr){
  fetch(`/posts/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      archived: !(bol)
  })
  
}).then(() => load_mailbox(addr));
  
}


 // <button class="btn like">`
 //     <svg xmls="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hear-fill like" viewBox="0 0 16 16">
 //         <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
 //     </svg>
 // </button>