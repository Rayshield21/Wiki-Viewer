// Initialize selectors
const input = document.querySelector("#searchInput");
const form = document.querySelector("form");
const results = document.querySelector(".results .container")

//Form submission event
form.addEventListener("submit", function(e){
  e.preventDefault();
  search();
})

//Target delegation to "back to search bar button" in the results page
document.body.addEventListener("click", function(e){
  if(e.target.classList.contains("home") || e.target.parentElement.classList.contains("home")){
    // Initiate scroll up animation.
    // After animation is over, deletes the results page 
    animateValue(920,0,.0001).then(reset);
  }
})

//fired when back button is pressed
function reset(){
  results.innerHTML = "";
  results.style.height = 0; 
}

// Used for scrolling animation effect
function animateValue(start, end, duration) {
  return new Promise(function(resolve,reject){
    var current = start;
    /* If search button is pressed, scrollY value goes up.
    Otherwise, scrollY value goes down. Increments/Decrements values of 20*/
    var increment = end > start? 20 : -20;
    var timer = setInterval(function() {
      current += increment;
      window.scrollTo(0,current);
      //resets animation values after animation is over
      if (current == end) {
          clearInterval(timer);
          resolve();
      }
    }, .1);
  })
}

//Search function
function search(){
  //calls wikipedia api for searching wikipedia entries
  const url = `http://en.wikipedia.org/w/api.php?action=opensearch&search=${input.value}&origin=*&callback=?`;
  $.ajax({
    type:"GET",
    url: url,
    async:false,
    dataType: "json",
    success: function(data){
      //sets results page layout
      results.style.height = "100vh";
      let out = `<div class="resultHead clearfix"><h2 class="float-left">Results for "${data[0]}"</h2><button class="home btn btn-outline-dark float-right"><i class="fa fa-arrow-circle-left"> Go back to WIKI Search Bar</i></button></div>`;
      //if there is available wikipedia entry, append the results
      data[1].forEach(function(result, index){
        out += `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title"><a href="${data[3][index]}" target="_blank">${result}</a></h5>
              <p class="card-text">${data[2][index]}</p>
            </div>
          </div>
        `
    });
    results.innerHTML = out;
    //initiate scroll down effect to results page
    animateValue(0,920,.0001);
    },
    // error handling
    error: function(err){
      results.innerHTML = err;
    }
  })
}