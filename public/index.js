window.addEventListener("load", async () => {
    await getUserInfo();
    prefillUserName()
});

let globalName = '' //Save username globally

async function getUserInfo() {
    const res = await fetch("/info", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const result = await res.json();

    if (res.status !== 200) {
        console.log(res.msg);
        return;
    }

    const name = result.data.name;
    const height = result.data.height;
    const weight = result.data.weight;
    const ageGroup = result.data.ageGroup;
    const gender = result.data.gender;
    const smoke = result.data.smoke;
    const sleep = result.data.sleep;
    const exercise = result.data.exercise;
    const alcohol = result.data.alcohol;
    globalName = name

    // Set greeting
    document.querySelector("#name-greet").innerHTML = `
            Hello ! <b>${name}</b> , Which Test Would You Like To Take ?
        `;

    const msg = `Welcome, ${name}.`;
    showNotification(msg, 5000);

    //prefill heart disease form

    document.querySelector("#prefill-heart").addEventListener("click", (e) => {
        e.preventDefault();

        document.querySelector(`#heart-name`).value = name;
        document.querySelector(`#heart-height`).value = height;
        document.querySelector(`#heart-weight`).value = weight;
        document.querySelector("#heart-age").value = ageGroup;
        document.querySelector(`#heart-gender`).value = gender;
        document.querySelector("#heart-sleep").value = sleep;
        document.querySelector(`#heart-smoke`).checked = smoke;
        document.querySelector("#heart-exercise").checked = exercise;
        document.querySelector("#heart-alcohol").checked = alcohol;
    });
}

function prefillUserName() {
    if (globalName !== '') {
        const nameInputBox = document.querySelectorAll('.name')
        nameInputBox.forEach((box) => {
            box.value = globalName
        })
    } else {
        document.querySelector('#start-button').click()
    }
}

document //form submission: Username only
    .querySelector("#name-form")
    .addEventListener("submit", async (e) => {

    const form = e.target;
    const name = form["name"].value;

    const obj = {
        name: name
    }

    const res = await fetch(`/info/name`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });

    const result = await res.json()

    if (res.status !== 200) {
        console.log(result)
        alert(res.msg)
    }
})

document //form submission: Suicide detection
    .querySelector("#suicide-form")
    .addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log('123')

    const form = e.target;
    const text = form["text"].value;

    const obj = {
        text: text
    }

    const res = await fetch(`/test/suicide`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });

    const result = await res.json();
    if (res.status !== 200) {
        alert("ERR001: Failed to post test data");
        document.location.reload();
    } else {
        const probabilityInFloat = parseFloat(result.result.probability);
        const probability = formatAsPercent(probabilityInFloat * 100);
        const resultBoard = document.querySelector("#test-result");
        const resultBox = document.querySelector("#test-result-container");

        let risk = '';
        let recommendation = ''
        let url = ''
        if (probabilityInFloat >= 0.9) {
            risk = "High";
            recommendation = "Our program detects that the text contains a hugh amount of words were also used in suicide notes, results show significant correlation between the text and our suicide notes database. You may click on the link below to look for emergency services in your area."
            url = 'https://www.google.com/search?q=emergency+services+for+suicide'

        } else if (probabilityInFloat >= 0.7 && probabilityInFloat < 0.9) {
            risk = "Medium";
            recommendation = "Our program detects a relative large amount of words in this text were also used in suicide notes, result suggests a high correlation between the text and our suicide notes data. You may click the link below to look for more support."
            url = 'https://suicideprevention.ca/im-concerned-about-someone/'

        } else if (probabilityInFloat < 0.7 && probabilityInFloat >= 0.5) {
            risk = "Low";
            recommendation = "Our programs detects that the text is containing some sematic similarities to suicide notes, but statistically the result shows insignificant correlation to suicidal thoughts. You may click the link below to look for more support."
            url = 'https://www.canada.ca/en/public-health/services/mental-health-services/mental-health-get-help.html'

        } else {
            risk = 'None'
            recommendation = 'Our programs detects few of the words in this text was sometime used by people who committed suicide in their suicide notes, but statistically the result shows no correlation to suicidal thoughts. You could try and find more text for us to analyze or click on the link below to see some available supports.'
            url = 'https://www.samhsa.gov/find-help/disaster-distress-helpline/warning-signs-risk-factors'
        }

        resultBoard.innerHTML = `
            Accordingly to our analysis, <br> 
                Input text indicates Suicidal Risk to be: <div id='test-result'> <h2>${risk}</h2> </div> <div id='probability'>with ${probability} probability.</div><br>
                <div id='recommendation'>${recommendation}</div>
                <button type="button" class='link link-btn' onclick="window.location.href = '${url}';"> Link </button>  
                <button id='suicide-explain' class='explain-btn' data-bs-toggle="modal"
                data-bs-target="#explain-modal">Explain</button>
            `;
        resultBox.style.display = "block";
    }
});

document //form submission: Heart Disease
    .querySelector("#heart-form")
    .addEventListener("submit", async (e) => {
    e.preventDefault();
    const testData = [];
    const form = e.target;
    const saveInfo = form["save-info"].checked ? 1 : 0;
    const name = form["name"].value;
    const height = parseInt(form["height"].value);
    const weight = parseFloat(form["weight"].value);
    const ageGroup = parseInt(form["age"].value);
    const gender = parseInt(form["gender"].value);
    const smoke = form["smoke"].checked ? 1 : 0;
    const sleep = parseInt(form["sleep"].value);
    const exercise = form["exercise"].checked ? 1 : 0;
    const alcohol = form["alcohol"].checked ? 1 : 0;
    const BMI = parseFloat((weight / (height / 100) ** 2).toFixed(2));

    testData.push(BMI, smoke, alcohol, gender, ageGroup, exercise, sleep);
    console.log(testData);

    if (saveInfo) {
        const obj = {
            name: name,
            height: height,
            weight: weight,
            ageGroup: ageGroup,
            gender: gender,
            smoke: smoke,
            exercise: exercise,
            sleep: sleep,
            alcohol: alcohol,
        };
        const res = await fetch("/info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });

        const result = await res.json()

        if (res.status !== 200) {
            console.log(result)
            alert(res.msg);
        } else {
            const msg = "User Info Saved";
            showNotification(msg, 5000);
        }
    }

    const res = await fetch(`/test/heart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
    });

    const result = await res.json();
    if (res.status !== 200) {
        alert("ERR001: Failed to post test data");
        document.location.reload();
    } else {
        const testResult = result.result.data[0];
        const heartDisease = testResult["Heart Disease"];
        const probability = formatAsPercent(testResult["probability"] * 100);
        const resultBoard = document.querySelector("#test-result");
        const resultBox = document.querySelector("#test-result-container");
        const recommendationBoard = document.querySelector("#recommendation-text")
        const explanationBoard = document.querySelector("#explain-text")
        recommendationBoard.innerHTML = ''
        explanationBoard.innerHTML = ''

        let likelihood = "";
        let greet = "";
        if (heartDisease == "Yes") {
            greet = "Oops...";
            likelihood = "Likely";
        } else {
            greet = "Congratulation!";
            likelihood = "Unlikely";
        }

        let severity = "";
        if (
            testResult["probability"] <= 1 &&
            testResult["probability"] >= 0.8
        ) {
            severity = "Extremely";
        }
        if (
            testResult["probability"] < 0.8 &&
            testResult["probability"] >= 0.6
        ) {
            severity = "Very";
        }
        if (
            testResult["probability"] < 0.6 &&
            testResult["probability"] >= 0.4
        ) {
            severity = "Moderately";
        }
        if (testResult["probability"] < 0.4) {
            severity = "Mildly";
        }

        const recommendations = []
        const smokerRecommendation = `<label for="smoker-recommendation" class="form-label">Smoking Habit :</label>
            <div name='smoker-recommendation' class='form-text'>You may want to consider quite smoking! Smoking increases your chance of having heart related disease significantly as you age. Run the test again with different age group and altering smoking habit to find out.`
        const drinkerRecommendation = `<label for="drinker-recommendation" class="form-label">Drinking Habit :</label>
            <div name='smoker-recommendation' class='form-text'>Adjust your drinking habit! Click link below to see recommendation.</div>
            <button type="button" class='link' onclick="window.location.href = 'https://www.cdc.gov/alcohol/fact-sheets/moderate-drinking.htm#:~:text=To%20reduce%20the%20risk%20of,days%20when%20alcohol%20is%20consumed';"> Link </button>
            `

        const sleepRecommendation = `<label for="sleep-recommendation" class="form-label">Sleep Habit :</label>
            <div name='sleep-recommendation' class='form-text'>It seems that you hour of sleep is not enough, check the link below to see some recommendation for sleep from Sleep Foundation.</div>
            <button type="button" class='link' onclick="window.location.href = 'https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need';"> Link </button>
            `

        const exerciseRecommendation = `<label for="exercise-recommendation" class="form-label">Exercise Habit :</label>
            <div name='exercise-recommendation' class='form-text'>Regular, daily physical activity can lower the risk of heart disease. Physical activity helps control your weight. It also reduces the chances of developing other conditions that may put a strain on the heart, such as high blood pressure, high cholesterol and type 2 diabetes. Try running the test again at different age group and see the result!</div>`

        const weightRecommendation = `<label for="exercise-recommendation" class="form-label">Weight Control :</label>
            <div name='exercise-recommendation' class='form-text'>According to your input, your BMI(Body mass index) is ${BMI}, which is consider ${BMIClassifier(BMI)}. Click link below to see how your weight affect your health.</div>
            <button type="button" class='link' onclick="window.location.href = 'https://www.hopkinsmedicine.org/health/wellness-and-prevention/weight-a-silent-heart-risk';"> Link </button>
            `
        const noWorries = `<label for="exercise-recommendation" class="form-label">You Are Good to Go !</label>
            <div name='no-recommendation' class='form-text'>It seems that you don't have anything to worry about! Try another test or doing the test again to see different result!</div>`


        if (smoke) {
            recommendations.push(smokerRecommendation)
        }
        if (alcohol) {
            recommendations.push(drinkerRecommendation)
        }
        if (sleep < 6) {
            recommendations.push(sleepRecommendation)
        }
        if (BMI >= 30 || BMI <= 18.5) {
            recommendations.push(weightRecommendation)
        }
        if (exercise === 0) {
            recommendations.push(exerciseRecommendation)
        }
        if (recommendations.length < 1) {
            recommendations.push(noWorries)
        }

        for (let i = 0; i < recommendations.length; i++) {
            if (i === 0) {
                recommendationBoard.innerHTML += recommendations[i]
            } else {
                recommendationBoard.innerHTML += '<hr>' + recommendations[i]
            }
        }

        resultBoard.innerHTML = `
            <div id ='result-title'>${greet}</div>
            Accordingly to our prediction, <br> 
                Your risk for developing a Heart Disease is : <div id='test-result'> <h2>${severity} ${likelihood}</h2> </div> <div class='probability-result'> with ${probability} probability.</div>
                <div>Click to see our recommendations below!</div>
                <button id='heart-explain' class='explain-btn' data-bs-toggle="modal"
                data-bs-target="#explain-modal">Explain</button>
                <button id='heart-recommendation' class='recommendation-btn' data-bs-toggle="modal"
                data-bs-target="#recommendation-modal">Recommendation</button>
                `;

        resultBox.style.display = "block";
    }
});

document //form submission: Diabetes
    .querySelector("#diabetes-form")
    .addEventListener("submit", async (e) => {
        e.preventDefault();
        const testData = [];
        const form = e.target;
        const saveInfo = form["save-info"].checked ? 1 : 0;
        const name = form["name"].value;
        const pregnancies = parseFloat(form["pregnancies"].value);
        const glucose = parseFloat(form["glucose"].value);
        const bloodPressure = parseFloat(form["blood-pressure"].value);
        const skinThickness = parseFloat(form["skin-thickness"].value);
        const insulin = parseFloat(form["insulin"].value);
        const pedigree = parseFloat(form["pedigree"].value);
        const weight = parseFloat(form["weight-input"].value);
        const height = parseFloat(form["height-input"].value);
        const bmi = parseFloat((weight / (height / 100) ** 2).toFixed(2));
        const age = parseFloat(form["actual-age"].value);

        testData.push(
            pregnancies,
            glucose,
            bloodPressure,
            skinThickness,
            insulin,
            bmi,
            pedigree,
            age
        );

        if (saveInfo) {
            const obj = {
                name: name,
                glucose: glucose,
                pregnancies: pregnancies,
                bloodPressure: bloodPressure,
                skinThickness: skinThickness,
                insulin: insulin,
                bmi: bmi,
                pedigree: pedigree,
                age: age,
            };

            const res = await fetch("/info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(obj),
            });

            const result = await res.json()

            if (res.status !== 200) {
                console.log(result)
                alert(res.msg);
            } else {
                const msg = "User Info Saved";
                showNotification(msg, 5000);
            }
        }

        const res = await fetch("/test/diabetes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testData),
        });

        const result = await res.json();
        if (res.status !== 200) {
            alert("ERR002: Failed to post test data");
            document.location.reload();
        } else {
            const testResult = result.result.data[0];
            const diabetes = testResult["Diabetes"];
            const probability = formatAsPercent(
                testResult["probability"] * 100
            );
            const resultBoard = document.querySelector("#test-result");
            const resultBox = document.querySelector("#test-result-container");

            let likelihood = "";
            let greet = "";
            if (diabetes === "Yes") {
                greet = "Unfortunately"
                likelihood = "Likely";
            } else {
                greet = "Good!";
                likelihood = "Unlikely";
            }

            let severity = "";
            if (
                testResult["probability"] <= 1 &&
                testResult["probability"] >= 0.8
            ) {
                severity = "Extremely";
            }
            if (
                testResult["probability"] < 0.8 &&
                testResult["probability"] >= 0.6
            ) {
                severity = "Very";
            }
            if (
                testResult["probability"] < 0.6 &&
                testResult["probability"] >= 0.4
            ) {
                severity = "Moderately";
            }
            if (testResult["probability"] < 0.4) {
                severity = "Mildly";
            }

            resultBoard.innerHTML = `
            <div id ='result-title'>${greet}</div>
                Accordingly to our prediction, <br> 
                Your risk for developing a Diabetes is : 
                <div id='test-result'> <h2>${severity} ${likelihood}</h2> </div> 
                with ${probability} probability.
                <button id='diabetes-explain' class='explain-btn'>Explain</button
            `;

            resultBox.style.display = "block"
        }
});

document //Delete user info from DB
    .querySelector("#delete-button")
    .addEventListener("click", async (e) => {
        e.preventDefault();
        const res = await fetch("/info", {
            method: "DELETE",
        });

        setTimeout(() => {
            document.location.reload();
        }, 5000);

        const result = await res.json()

        if (res.status !== 200) {
            console.log(result)
            alert(res.msg);
        } else {
            const msg = "User Info Deleted";
            showNotification(msg, 5000);
        }
});

document //Close test result panel
    .querySelector("#close-test-result")
    .addEventListener("click", () => {
        const resultBox = document.querySelector("#test-result-container");
        resultBox.style.display = "none";
});

document //Clear suicide detection text box
    .querySelector('#clear-suicide')
    .addEventListener('click', (e) => {
        e.preventDefault()
        document.getElementById('suicide-text').value = ''
})

function formatAsPercent(num) {
    return new Intl.NumberFormat('default', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num / 100);
}

function BMIClassifier(BMI) {

    let bmi = parseFloat(BMI)
    let category

    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = "Normal Weight";
    } else if (bmi >= 25 && bmi <= 29.9) {
        category = "Overweight";
    } else if (bmi >= 30 && bmi <= 34.9) {
        category = "Class 1 Obesity";
    } else if (bmi >= 35 && bmi <= 39.9) {
        category = "Class 2 Obesity";
    } else {
        category = "Class 3 Obesity";
    }

    return category
}

function showNotification(msg, time) {
    const notification = document.querySelector("#notification-box");
    notification.innerHTML = msg;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, time);
}