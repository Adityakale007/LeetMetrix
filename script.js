// enter this when fully DOM contet is loaded
document.addEventListener("DOMContentLoaded",function(){

    const search_button = document.getElementById("user_input_button");
    const user_input = document.getElementById("user_input");
    const easy_label = document.getElementById("easy_label");
    const medium_label = document.getElementById("medium_label");
    const hard_label = document.getElementById("hard_label");

    const stats_container = document.querySelector(".stats_container");
    const easy_progress = document.querySelector(".easy_progress");
    const medium_progress = document.querySelector(".medium_progress");
    const hard_progress = document.querySelector(".hard_progress");

    const user_progress = document.querySelector(".user_progress");

    const stats_cards = document.querySelector(".stats_cards");


    //return true or false based on REGEX(regel expression to validate usernames on leetcode)
    function validateUsername(username){
        if(username.trim() === ""){
            alert("USERNAME SHOULD NOT BE EMPTY")  ;
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("INVALID USERNAME");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

        try{
            search_button.textContent = "Searching...";
            search_button.disabled = true;

            // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            // const targetUrl = 'https://leetcode.com/graphql/';
            // const myHeaders = new Headers();
            // myHeaders.append("Content-Type", "application/json");

            // const garphql = JSON.stringify({
            //     query: "\n  query userSessionProgress ($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n    }\n matchedUser(username: $username){\n    submitStats {\n    acSubmissionNum{\n     difficulty\n    count\n     submissions\n       }\n      totalSubmissionNum {\n      difficulty\n    count\n submissions\n   }\n }\n  }\n}\n        ",variables: { "username": `${username}`}
            //     })

            // const requestOption = {
            // method: "POST",
            // body: graphql,
            // headers: myHeaders,
            // redirect: "follow" 
            // };

            // const response = await fetch(proxyUrl+targetUrl,requestOption);
            const response = await fetch(url);

            if(!response.ok){
                throw new Error("Unable to find User Details");
            }

            const data = await response.json()      //parsing
            console.log("data is:",data);

            displayUserData(data);
        }
        catch(error){
            user_progress.innerHTML =  `<p>No Data Found</p>`;
        }
        finally{
            search_button.textContent = "Search";
            search_button.disabled = false;
        }
    }



    function displayUserData(data){
        //after formating the json code
        const totalQuestion = data.totalQuestions;
        const totalHardQuestion = data.totalHard;
        const totalMediumQuestion = data.totalMedium;
        const totalEasyQuestion = data.totalEasy;

        const solvedQuestion = data.totalSolved;
        const solvedHardQuestion = data.hardSolved;
        const solvedMediumQuestion = data.mediumSolved;
        const solvedEasyQuestion = data.easySolved;


        updateProgress(totalEasyQuestion , solvedEasyQuestion , easy_label , easy_progress);
        updateProgress(totalMediumQuestion , solvedMediumQuestion , medium_label , medium_progress);
        updateProgress(totalHardQuestion , solvedHardQuestion , hard_label , hard_progress);


        const cardsData = [
            {label: "AcceptanceRate", value:data.acceptanceRate},
            {label: "Ranking", value:data.ranking},
            {label: "ContributionPoints", value:data.contributionPoints},
            {label: "Reputation", value:data.reputation},
        ];

        console.log("cards ka data: " , cardsData);

        stats_cards.innerHTML = cardsData.map(
            data => `
                    <div class="cards">
                    <h3>${data.label}:</h3>
                    <p>${data.value}</p>
                    </div>
                `
        ).join("")

    }




    function updateProgress(total,solved,label,circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree" , `${progressDegree}%`);
        label.textContent = `${solved} / ${total}`;
    }




    search_button.addEventListener('click',function(){
        const username = user_input.value;

        if(validateUsername(username)){
            fetchUserDetails(username);


        }
    })

})



