// Questions Array
const questions = [
  { question: 'Enter Your Name' },
  { question: 'Enter Your Preferred Contact Email', pattern: /\S+@\S+\.\S+/ },
  { question: 'What Type Of Event Would You Be Hosting' },
  {
    question: "Please Select A Date For Your Event",
    pattern:
      /^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})/ |
      /^((0|1)\d{1})-((0|1|2|3)\d{1})-((19|20)\d{2})-((0|1)\d{1})-((0|1|2|3)\d{1})-((19|20)\d{2})/ |
      /^((0|1)\d{1})-((0|1|2|3)\d{1})-((19|20)\d{2}) - ((0|1)\d{1})-((0|1|2|3)\d{1})-((19|20)\d{2})/ |
      /^((0|1)\d{1})-((0|1|2|3)\d{1})-((19|20)\d{2}) -((0|1)\d{1})-((0|1|2|3)\d{1})-((19|20)\d{2})/ |
      /^((0|1)\d{1})-((0|1|2|3)\d{1})-((19|20)\d{2})- ((0|1)\d{1})-((0|1|2|3)\d{1})-((19|20)\d{2})/ |
      /^((0|1)\d{1})(\/)((0|1|2)\d{1})(\/)((19|20)\d{2})/ |
      /^((0|1)\d{1})(\/)((0|1|2|3)\d{1})(\/)((19|20)\d{2})-((0|1)\d{1})(\/)((0|1|2|3)\d{1})(\/)((19|20)\d{2})/ |
      /^((0|1)\d{1})(\/)((0|1|2|3)\d{1})(\/)((19|20)\d{2}) -((0|1)\d{1})(\/)((0|1|2|3)\d{1})(\/)((19|20)\d{2})/ |
      /^((0|1)\d{1})(\/)((0|1|2|3)\d{1})(\/)((19|20)\d{2})- ((0|1)\d{1})(\/)((0|1|2|3)\d{1})(\/)((19|20)\d{2})/ |
      /^((0|1)\d{1})(\/)((0|1|2|3)\d{1})(\/)((19|20)\d{2}) - ((0|1)\d{1})(\/)((0|1|2|3)\d{1})(\/)((19|20)\d{2})/
  },
  { question: 'Send A Message' }
];

// Transition Times
const shakeTime = 100; // Shake Transition Time
const switchTime = 200; // Transition Between Questions

// Init Position At First Question
let position = 0;

// Init DOM Elements
const formBox = document.querySelector('#form-box');
const nextBtn = document.querySelector('#next-btn');
const prevBtn = document.querySelector('#prev-btn');
const inputGroup = document.querySelector('#input-group');
const inputField = document.querySelector('#input-field');
const inputLabel = document.querySelector('#input-label');
const inputProgress = document.querySelector('#input-progress');
const progress = document.querySelector('#progress-bar');
const calBtn = document.querySelector('#cal-btn');

// EVENTS

// Get Question On DOM Load
document.addEventListener('DOMContentLoaded', getQuestion);

// Next Button Click
nextBtn.addEventListener('click', validate);


// Previous Button Click
prevBtn.addEventListener('click', back);

// Calendar button
// calBtn.addEventListener('click',log);

// Input Field Enter Click
inputField.addEventListener('keyup', e => {
  if (e.keyCode == 13) {
    validate();
  }
});

// FUNCTIONS

// Test for the calendar button working
function log(){
  console.log('it worked');
}

// Get Question From Array & Add To Markup
function getQuestion() {
  // Get Current Question
  inputLabel.innerHTML = questions[position].question;
  // Get Current Type
  inputField.type = questions[position].type || 'text';
  // Get Current Answer
  inputField.value = questions[position].answer || '';
  // Focus On Element
  // inputField.focus();

  // Set Progress Bar Width - Variable to the questions length
  progress.style.width = (position * 100) / questions.length + '%';

  // Add User Icon OR Back Arrow Depending On Question
  prevBtn.className = position ? 'fas fa-arrow-left' : 'fas fa-user';

  // Check to see if its the date question
  if(position === 3){
    calBtn.style.opacity = 1;
    calBtn.addEventListener('click',log);
  }

  showQuestion();
}


// WORK NEEDED HERE
function back(){
  // if position === 3 hide calendar
  if(position === 3){
    calBtn.style.opacity=0;
    calBtn.removeEventListener('click');
  }
  // Move back on question array
  position--;
  getQuestion();
}



// WORK NEEDED HERE CHECK FOR POSITION THEN SET OPACITY OF CALENDAR
// Display Question To User
function showQuestion() {
  inputGroup.style.opacity = 1;
  inputProgress.style.transition = '';
  inputProgress.style.width = '100%';
}

// Hide Question From User
function hideQuestion() {
  inputGroup.style.opacity = 0;
  inputLabel.style.marginLeft = 0;
  inputProgress.style.width = 0;
  inputProgress.style.transition = 'none';
  inputGroup.style.border = null;
}

// Transform To Create Shake Motion
function transform(x, y) {
  formBox.style.transform = `translate(${x}px, ${y}px)`;
}

// Validate Field
function validate() {
  // Make Sure Pattern Matches If There Is One
  if (!inputField.value.match(questions[position].pattern || /.+/)) {
    inputFail();
  } else {
    inputPass();
  }
}

// Field Input Fail
function inputFail() {
  formBox.className = 'error';
  // Repeat Shake Motion -  Set i to number of shakes
  for (let i = 0; i < 6; i++) {
    setTimeout(transform, shakeTime * i, ((i % 2) * 2 - 1) * 20, 0);
    setTimeout(transform, shakeTime * 6, 0, 0);
    inputField.focus();
  }
}

// Field Input Passed
function inputPass() {
  formBox.className = '';
  setTimeout(transform, shakeTime * 0, 0, 10);
  setTimeout(transform, shakeTime * 1, 0, 0);

  // Store Answer In Array
  questions[position].answer = inputField.value;

  // Increment Position
  position++;

  // If New Question, Hide Current and Get Next
  if (questions[position]) {
    hideQuestion();
    getQuestion();
  } else {
    // Remove If No More Questions
    hideQuestion();
    formBox.className = 'close';
    progress.style.width = '100%';

    // Form Complete
    formComplete();
  }
}

// All Fields Complete - Show h1 end
function formComplete() {
  const h1 = document.createElement('h1');
  h1.classList.add('end');
  h1.appendChild(
    document.createTextNode(
      `Thanks ${
        questions[0].answer
      }, We will be getting into contact with you soon!`
    )
  );
  setTimeout(() => {
    formBox.parentElement.appendChild(h1);
    setTimeout(() => (h1.style.opacity = 1), 50);
  }, 1000);

  window.location.href = 'mailto:thevenue@ens.com?subject=Venue Booking Request '+ questions[3].answer + '&body=From '+ questions[0].answer + ', %0D%0A I would like to enquire about hosting a ' + questions[2].answer + ' event on '+ questions[3].answer + '. ' + questions[4].answer + '. %0D%0A With Regards, %0D%0A '+ questions[0].answer;
}

// NEED TO CREATE FUNCTION TO SEND EMAIL USING ANSWERS FROM QUESTIONS[I].ANSWERS AND ITTERATE THROUGH





/*Scroll to top when arrow up clicked BEGIN*/
$(window).scroll(function() {
  var height = $(window).scrollTop();
  if (height > 100) {
      $('#back2Top').fadeIn();
  } else {
      $('#back2Top').fadeOut();
  }
});
$(document).ready(function() {
  $("#back2Top").click(function(event) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
  });

});

$(".btn--contact").click(function() {
  $([document.documentElement, document.body]).animate({
      scrollTop: $(".section-book").offset().top
  }, 2000);
});