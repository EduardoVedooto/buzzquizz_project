

getQuizzes();

function getQuizzes(){
    const promess = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes");
    promess.then(showQuizzes);
}

function showQuizzes(response){
    console.log(response.data)
    const eachQuizz = document.querySelector(".quizzes");

    eachQuizz.innerHTML = "";
    for(let i = 0; i < response.data.length; i++){
        eachQuizz.innerHTML +=`
        <div class="e-quizzes">
            <img src="${response.data[i].image}">
            <p>${response.data[i].title}</p>
        </div>  
        `
    }
}