console.log('Hello World!');
document.addEventListener('DOMContentLoaded', function() {
	let form_tag = document.querySelector('#post-form');
	let postForm = (form_tag && form_tag.addEventListener('submit', post_msg));




});




function post_msg(event){
	event.preventDefault()
	console.log('Lami');
	console.log('TODO');
	alert('Hello')
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