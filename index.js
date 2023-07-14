// Variable dump
let timer1 = document.querySelector('.timer1');
let button1 = document.querySelector('.start1');
let timer2 = document.querySelector('.timer2');
let button2 = document.querySelector('.start2');
let timer3 = document.querySelector('.timer3');
let button3 = document.querySelector('.start3');
let timer4 = document.querySelector('.timer4');
let button4 = document.querySelector('.start4');
let timerInterval1, timerInterval2, timerInterval3, timerInterval4; // Variable to store the timer interval ID

// Arrays to define the types of workouts
const chestExercise = ['Pushups', 'Bench Press', 'Incline Dumbbell Press', 'Dumbbell Flys', 'Dips'];
const backExercise = ['Pull-ups', 'Deadlifts', 'Bent Over Rows', 'Lat Pulldowns', 'Seated Cable Rows'];
const shoulderExercise = ['Overhead Press', 'Dumbbell Shoulder Press', 'Arnold Press', 'Lateral Raises', 'Front Raises'];
const legExercise = ['Squats', 'Lunges', 'Deadlifts', 'Leg Press', 'Calf Raises'];

// Action listeners to make the buttons work
button1.addEventListener('click', startWorkout.bind(null, chestExercise, timer1, button1, 'Chest'));
button2.addEventListener('click', startWorkout.bind(null, backExercise, timer2, button2, 'Back'));
button3.addEventListener('click', startWorkout.bind(null, shoulderExercise, timer3, button3, 'Shoulder'));
button4.addEventListener('click', startWorkout.bind(null, legExercise, timer4, button4, 'Legs'));

// Function to start the workout
function startWorkout(exercises, timerElement, buttonElement, workoutType) {
  let exerciseIndex = 0;
  let duration = 45; // Duration in seconds

  // Clear any existing timer interval
  clearInterval(timerInterval1);
  clearInterval(timerInterval2);
  clearInterval(timerInterval3);
  clearInterval(timerInterval4);

  // Function to update the timer display
  const updateTimer = () => {
    let minutes = parseInt(duration / 60, 10);
    let seconds = parseInt(duration % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    timerElement.textContent = minutes + ':' + seconds;
  };

  // Function to start the next exercise
  const startNextExercise = () => {
    // Increment exercise index
    exerciseIndex++;

    if (exerciseIndex < exercises.length) {
      // Update exercise name for the next exercise
      timerElement.previousElementSibling.textContent = exercises[exerciseIndex];

      // Reset the duration for the next exercise
      duration = 45;

      // Start the timer for the next exercise after a 5-second delay
      setTimeout(startTimer, 5000);
    } else {
      // Reset the timer and show "Start" button
      timerElement.textContent = 'Start';
      buttonElement.disabled = false;

      // Calculate calories burnt for the workout
      const caloriesBurnt = calculateCaloriesBurnt(exercises);
      storeCaloriesBurnt(caloriesBurnt, workoutType);
      displayNetCalories(); // Added to display net calories after storing calories burnt
    }
  };

  // Function to start the timer for the current exercise
  const startTimer = () => {
    updateTimer();

    // Decrement duration
    duration--;

    if (duration < 0) {
      // Start the next exercise
      startNextExercise();
    }
  };

  // Disable the button to prevent multiple clicks
  buttonElement.disabled = true;

  // Update exercise name for the first exercise
  timerElement.previousElementSibling.textContent = exercises[exerciseIndex];

  // Start the timer
  startTimer();

  // Set the timer interval for the workout
  if (timerElement === timer1) {
    timerInterval1 = setInterval(startTimer, 1000);
  } else if (timerElement === timer2) {
    timerInterval2 = setInterval(startTimer, 1000);
  } else if (timerElement === timer3) {
    timerInterval3 = setInterval(startTimer, 1000);
  } else if (timerElement === timer4) {
    timerInterval4 = setInterval(startTimer, 1000);
  }
}

// Function to calculate the calories burnt for a workout
function calculateCaloriesBurnt(exercises) {
  let caloriesBurnt = 0;

  for (let i = 0; i < exercises.length; i++) {
    caloriesBurnt += 10; // Example formula, replace with your own calculation
  }

  return caloriesBurnt;
}

// Function to store the calories burnt in the SQLite database
function storeCaloriesBurnt(caloriesBurnt, workoutType) {
  // Perform an AJAX request to the server to store the calories burnt
  fetch('/store-calories-burnt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      caloriesBurnt: caloriesBurnt,
      workoutType: workoutType
    })
  })
    .then(response => response.text())
    .then(data => {
      console.log(data); // Display response from the server
    })
    .catch(error => {
      console.log('Error storing calories burnt:', error);
    });
}

// Function to store the calories consumed in the SQLite database
function storeCaloriesConsumed(caloriesConsumed) {
  // Perform an AJAX request to the server to store the calories consumed
  fetch('/store-calories-consumed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      caloriesConsumed: caloriesConsumed
    })
  })
    .then(response => response.text())
    .then(data => {
      console.log(data); // Display response from the server
    })
    .catch(error => {
      console.log('Error storing calories consumed:', error);
    });
}

// Function to fetch and display the net calories
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function displayNetCalories() {
  const currentDate = getCurrentDate();

  // Fetch the total calories burnt and consumed for the date
  Promise.all([
    fetch(`/get-calories-burnt?date=${currentDate}`),
    fetch(`/get-calories-consumed?date=${currentDate}`)
  ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
      const caloriesBurnt = parseFloat(data[0].totalCaloriesBurnt) || 0;
      const caloriesConsumed = parseFloat(data[1].totalCaloriesConsumed) || 0;
      const netCalories = caloriesBurnt - caloriesConsumed;

      // Update the net calories on the HTML page
      const netCaloriesElement = document.getElementById('net-calories');
      netCaloriesElement.textContent = `Net Calories: ${netCalories.toFixed(2)}`;
    })
    .catch(error => {
      console.log('Error fetching total calories:', error);
    });
}

// Call the function to display net calories on page load
displayNetCalories();






// Get the input element
const caloriesInput = document.getElementById('calories-input');

// Add an event listener for the 'input' event
caloriesInput.addEventListener('input', handleInput);

// Event handler function
function handleInput(event) {
  // Get the entered value from the input element
  const calories = event.target.value;

  // Perform any necessary actions with the entered value
  // For example, you can update a variable or call a function
  console.log('Entered calories:', calories);
}

