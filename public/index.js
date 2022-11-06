window.addEventListener("load", async () => {
    await getUserInfo();
    prefillUserName()
});

let globalName = ''

function prefillUserName(){
    if (globalName !== ''){
        const nameInputBox = document.querySelectorAll('.name')
        nameInputBox.forEach((box)=>{
            box.value = globalName
        })
    } else {
        document.querySelector('#start-button').click() 
    }
}

document.querySelector("#name-form").addEventListener("submit", async (e) => {
    e.preventDefault()

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
    } else {
        const msg = `Welcome, ${name}.`;
        showNotification(msg, 5000);
    }
})

function showNotification(msg, time) {
    const notification = document.querySelector("#notification-box");
    notification.innerHTML = msg;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, time);
}

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

    const msg = `Hello, ${name}. Welcome back.`;
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

document.querySelector("#suicide-form").addEventListener("submit", async (e) => {
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
            risk = "Very High";
            recommendation = "It seems like the person who wrote the text is in need for immediate support, please click on the link below to look for emergency services in your area."
            url = 'https://www.google.com/search?q=emergency+services+for+suicide'

        } else if (probabilityInFloat >= 0.7 && probabilityInFloat < 0.9) {
            risk = "High";
            recommendation = "It seems like the person who wrote the text may be suffering emotionally, you may click the link below to look for more support."
            url = 'https://suicideprevention.ca/im-concerned-about-someone/'

        } else if (probabilityInFloat < 0.7 && probabilityInFloat >= 0.4) {
            risk = "Medium";
            recommendation = "It seems like the person who wrote the text is exhibiting some depressive symptoms, you may click the link below to look for more support."
            url = 'https://www.canada.ca/en/public-health/services/mental-health-services/mental-health-get-help.html'

        } else {
            risk = 'Low'
            recommendation = 'It seems like the person who wrote the text shows little to none indicator of suicidal thoughts, you could try and find more text for us to analyze or click on the link below to see some available supports.'
            url = 'https://www.samhsa.gov/find-help/disaster-distress-helpline/warning-signs-risk-factors'
        }

        resultBoard.innerHTML = `
            Accordingly to our analysis, <br> 
                Input text indicates Suicidal Risk to be: <div id='test-result'> <h2>${risk}</h2> </div> <div id='probability'>with ${probability} probability.</div><br>
                <div id='recommendation'>${recommendation}</div>
                <a class='link' href=${url}>Link</a>
                <button id='suicide-explain' class='explain-btn'>Explain</button
            `;
        resultBox.style.display = "block";
    }
});

document.querySelector("#heart-form").addEventListener("submit", async (e) => {
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

        resultBoard.innerHTML = `
            <div id ='result-title'>${greet}</div>
            Accordingly to our prediction, <br> 
                Your risk for developing a Heart Disease is : <div id='test-result'> <h2>${severity} ${likelihood}</h2> </div> with ${probability} probability. 
                <button id='heart-explain' class='explain-btn'>Explain</button
                `;

        resultBox.style.display = "block";

        console.log(testResult);
    }
});

document
    .querySelector("#delete-button")
    .addEventListener("click", async (e) => {
        e.preventDefault();
        const res = await fetch("/info", {
            method: "DELETE",
        });

        setTimeout(() => {
            document.location.reload();
        }, 5000);

        const result = await res.jon()

        if (res.status !== 200) {
            console.log(result)
            alert(res.msg);
        } else {
            const msg = "User Info Deleted";
            showNotification(msg, 5000);
        }
    });

document
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
                console.log (result)
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


document
    .querySelector("#close-test-result")
    .addEventListener("click", () => {
        const resultBox = document.querySelector("#test-result-container");
        resultBox.style.display = "none";
    });

    function formatAsPercent(num) {
        return new Intl.NumberFormat('default', {
          style: 'percent',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num / 100);
      }