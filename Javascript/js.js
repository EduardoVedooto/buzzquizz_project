

// getQuizzes();

// function getQuizzes(){
//     const promess = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes");
//     promess.then(showQuizzes);
// }

// function showQuizzes(response){
//     console.log(response.data)
//     const eachQuizz = document.querySelector(".quizzes");

//     eachQuizz.innerHTML = "";
//     for(let i = 0; i < response.data.length; i++){
//         eachQuizz.innerHTML +=`
//         <div class="e-quizzes" onclick="acessQuizz(this)">
//             <img src="${response.data[i].image}">
//             <p>${response.data[i].title}</p>
//         </div>  
//         `
//     }
// }
 
// function createQuizz(clicked){
//     const containerQuizz = document.querySelector(".container");
//     // const createFeature = document.querySelector(".") missing feature;
//     containerQuizz.classList.add("hidden");
    
// }

// function acessQuizz(clicked){
//     alert("Feature não implementada")
// }