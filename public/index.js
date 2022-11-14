import {formatAsPercent} from "/util/functions.js"

window.addEventListener("load", async () => {
	await getUserInfo();
});

let globalName = ""; //Save username globally
let userInfo = null;

async function getUserInfo() {
	const res = await fetch("/info", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const result = await res.json();

	if (res.status !== 200) {
		console.log(result);
		document.querySelector("#name-greet").innerHTML = `
            Hello ! Which Test Would You Like To Take ?
        `;
		prefillUserName();
		return;
	}

	userInfo = {
		name: result.data.name,
		height: result.data.height,
		weight: result.data.weight,
		ageGroup: result.data.ageGroup,
		gender: result.data.gender,
		smoke: result.data.smoke,
		sleep: result.data.sleep,
		exercise: result.data.exercise,
		alcohol: result.data.alcohol,
		actualAge: result.data.actualAge,
		stroke: result.data.stroke,
		heartAttack: result.data.heartAttack,
		cholesterolCheck: result.data.cholesterolCheck,
		cholesterolHigh: result.data.cholesterolHigh,
		bloodPressure: result.data.bloodPressure,
		fruit: result.data.fruit,
		veggies: result.data.veggies,
		exerciseDays: result.data.exerciseDays,
		mentalHealth: result.data.mentalHealth,
		generalHealth: result.data.generalHealth,
		anxiety: result.data.anxiety,
		fatigue: result.data.fatigue,
		cough: result.data.cough,
		shortBreath: result.data.shortBreath,
		swallow: result.data.swallow,
		chestPain: result.data.chestPain,
		hypertension: result.data.hypertension,
		heartDisease: result.data.heartDisease,
		smokingStatus: result.data.smokingStatus,
	};

	const {
		name,
		height,
		weight,
		ageGroup,
		gender,
		smoke,
		sleep,
		exercise,
		alcohol,
		actualAge,
		stroke,
		heartAttack,
		cholesterolCheck,
		cholesterolHigh,
		bloodPressure,
		fruit,
		veggies,
		exerciseDays,
		mentalHealth,
		generalHealth,
		anxiety,
		fatigue,
		cough,
		shortBreath,
		swallow,
		chestPain,
		hypertension,
		heartDisease,
		smokingStatus,
	} = userInfo;

	globalName = name;
	prefillUserName();

	// Set greeting
	if (name) {
		document.querySelector("#name-greet").innerHTML = `
            Hello ! <b>${name}</b> , Which Test Would You Like To Take ?
        `;
	}

	const msg = `Welcome, ${name}.`;
	showNotification(msg, 5000);

	//prefill stroke form

	document.querySelector("#prefill-stroke").addEventListener("click", (e) => {
		e.preventDefault();

		document.querySelector(`#stroke-name`).value = name;
		document.querySelector(`#stroke-height`).value = height;
		document.querySelector(`#stroke-weight`).value = weight;
		document.querySelector("#stroke-age").value = actualAge;
		document.querySelector(`#stroke-gender`).value = gender;
	});

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

	//prefill lung cancer form

	document.querySelector("#prefill-lung").addEventListener("click", (e) => {
		e.preventDefault();

		document.querySelector(`#lung-name`).value = name;
		document.querySelector("#lung-actual-age").value = actualAge;
		document.querySelector(`#lung-gender`).value = gender;
		document.querySelector(`#lung-smoke`).checked = smoke;
		document.querySelector("#lung-alcohol").checked = alcohol;
		document.querySelector("#lung-anxiety").checked = anxiety;
		document.querySelector("#lung-fatigue").checked = fatigue;
		document.querySelector("#lung-cough").checked = cough;
		document.querySelector("#lung-short-breath").checked = shortBreath;
		document.querySelector("#lung-swallow").checked = swallow;
		document.querySelector("#lung-chest-pain").checked = chestPain;
	});

	//prefill diabetes form

	document.querySelector(`#prefill-diabetes`).addEventListener("click", (e) => {
		e.preventDefault();

		document.querySelector("#diabetes-name").value = name;
		document.querySelector("#diabetes-gender").value = gender;
		document.querySelector("#diabetes-age").value = ageGroup;
		document.querySelector("#height-input").value = height;
		document.querySelector("#weight-input").value = weight;
		document.querySelector("#diabetes-smoke").value = smoke;
		document.querySelector("#diabetes-stroke").value = stroke;
		document.querySelector("#diabetes-heart").value = heartAttack;
		document.querySelector("#cholesterol").value = cholesterolCheck;
		document.querySelector("#cholesterol-high").value = cholesterolHigh;
		document.querySelector("#blood-pressure").value = bloodPressure;
		document.querySelector("#fruit").value = fruit;
		document.querySelector("#veggies").value = veggies;
		document.querySelector("#diabetes-exercise").value = exercise;
		document.querySelector("#exercise-days").value = exerciseDays;
		document.querySelector("#mental-health").value = mentalHealth;
		document.querySelector("#diabetes-alcohol").value = alcohol;
		document.querySelector("#general-health").value = generalHealth;
	});
}

document //form submission: Username only
	.querySelector("#name-form")
	.addEventListener("submit", async (e) => {
		const form = e.target;

		const name = form["name"].value;

		const obj = {
			name: name,
		};

		const res = await fetch(`/info/name`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(obj),
		});

		const result = await res.json();

		if (res.status !== 200) {
			console.log(result);
			alert(res.msg);
		}
	});

document //form submission: Suicide detection
	.querySelector("#suicide-form")
	.addEventListener("submit", async (e) => {
		e.preventDefault();

		console.log("123");

		const form = e.target;
		const text = form["text"].value;

		const obj = {
			text: text,
		};

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

			let risk = "";
			let recommendation = "";
			let url = "";
			if (probabilityInFloat >= 0.9) {
				risk = "High";
				recommendation =
					"Our program detects that the text contains a hugh amount of words were also used in suicide notes, results show significant correlation between the text and our suicide notes database. You may click on the link below to look for emergency services in your area.";
				url = "https://www.google.com/search?q=emergency+services+for+suicide";
			} else if (probabilityInFloat >= 0.7 && probabilityInFloat < 0.9) {
				risk = "Medium";
				recommendation =
					"Our program detects a relative large amount of words in this text were also used in suicide notes, result suggests a high correlation between the text and our suicide notes data. You may click the link below to look for more support.";
				url = "https://suicideprevention.ca/im-concerned-about-someone/";
			} else if (probabilityInFloat < 0.7 && probabilityInFloat >= 0.5) {
				risk = "Low";
				recommendation =
					"Our programs detects that the text is containing some sematic similarities to suicide notes, but statistically the result shows insignificant correlation to suicidal thoughts. You may click the link below to look for more support.";
				url =
					"https://www.canada.ca/en/public-health/services/mental-health-services/mental-health-get-help.html";
			} else {
				risk = "None";
				recommendation =
					"Our programs detects few of the words in this text was sometime used by people who committed suicide in their suicide notes, but statistically the result shows no correlation to suicidal thoughts. You could try and find more text for us to analyze or click on the link below to see some available supports.";
				url =
					"https://www.samhsa.gov/find-help/disaster-distress-helpline/warning-signs-risk-factors";
			}

			resultBoard.innerHTML = `
            Accordingly to our analysis, <br> 
                Input text indicates Suicidal Risk to be: <div id='test-result'> <h2>${risk}</h2> </div> <div id='probability'>with ${probability} probability.</div><br>
                <div id='recommendation'>${recommendation}</div>
                <button type="button" class='link link-btn' onclick="window.location.href = '${url}';"> Link </button>  
                <button id='suicide-explain' class='explain-btn' data-bs-toggle="modal"
                data-bs-target="#explain-modal">Explain</button>
            `;

			document // add explanation
				.querySelector("#suicide-explain")
				.addEventListener("click", () => {
					e.preventDefault();
					document.querySelector("#explain-text").innerHTML = `
                        <div>Dataset Detail : </div>
                        <div>
                            <ul>
                                <li class="form-text">Train-data Size : 232074 ( 116037 : 116037 ) </li>
                                <li class="form-text">Accuracy :        92.93%</li>
                                <li class="form-text">Loss :            0.1859</li>
                            </ul>
                        </div> 
                        <hr><img src="/asset/graphs/suicide_accuracy.png" alt="" width="400" height="350">
                        <hr><img src="/asset/graphs/suicide_loss.png" alt="" width="400" height="350">
                    `;
					document.querySelector("#explain-text").style.overflow = "auto";
				});
			resultBox.style.display = "block";
		}
	});

document //form submission: Lung Cancer
	.querySelector("#lung-form")
	.addEventListener("submit", async (e) => {
		e.preventDefault();
		const testData = [];
		const form = e.target;
		const saveInfo = form["save-info"].checked;
		const name = form["name"].value;
		const gender = parseInt(form["gender"].value);
		const actualAge = parseInt(form["actual-age"].value);
		const smoke = form["smoke"].checked ? 1 : 0;
		const alcohol = form["alcohol"].checked ? 1 : 0;
		const anxiety = form["anxiety"].checked ? 1 : 0;
		const fatigue = form["fatigue"].checked ? 1 : 0;
		const cough = form["cough"].checked ? 1 : 0;
		const shortBreath = form["short-breath"].checked ? 1 : 0;
		const swallow = form["swallow"].checked ? 1 : 0;
		const chestPain = form["chest-pain"].checked ? 1 : 0;

		testData.push(
			gender,
			actualAge,
			smoke,
			anxiety,
			fatigue,
			alcohol,
			cough,
			shortBreath,
			swallow,
			chestPain
		);
		console.log(testData);

		if (saveInfo) {
			const obj = {
				name: name,
				gender: gender,
				actualAge: actualAge,
				gender: gender,
				smoke: smoke,
				alcohol: alcohol,
				anxiety: anxiety,
				fatigue: fatigue,
				cough: cough,
				shortBreath: shortBreath,
				swallow: swallow,
				chestPain: chestPain,
			};
			const res = await fetch("/info", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(obj),
			});

			const result = await res.json();

			if (res.status !== 200) {
				console.log(result);
				alert(res.msg);
			} else {
				const msg = "User Info Saved";
				showNotification(msg, 5000);
			}
		}

		const res = await fetch(`/test/lung`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(testData),
		});

		const result = await res.json();
		if (res.status !== 200) {
			alert("ERR001: Failed to post lung test data");
			document.location.reload();
		} else {
			const testResult = result.result.data[0];
			const heartDisease = testResult.lungCancer;
			const probability = formatAsPercent(testResult["probability"] * 100);
			const resultBoard = document.querySelector("#test-result");
			const resultBox = document.querySelector("#test-result-container");
			const recommendationBoard = document.querySelector(
				"#recommendation-text"
			);
			const explanationBoard = document.querySelector("#explain-text");
			recommendationBoard.innerHTML = "";
			explanationBoard.innerHTML = "";

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
				testResult["probability"] >= 0.9 ||
				testResult["probability"] <= 0.1
			) {
				severity = "Extremely";
			}
			if (
				(testResult["probability"] >= 0.8 && testResult["probability"] < 0.9) ||
				(testResult["probability"] <= 0.3 && testResult["probability"] > 0.1)
			) {
				severity = "Very";
			}
			if (
				(testResult["probability"] >= 0.6 && testResult["probability"] < 0.8) ||
				(testResult["probability"] <= 0.4 && testResult["probability"] > 0.3)
			) {
				severity = "Moderately";
			}
			if (testResult["probability"] > 0.4 && testResult["probability"] < 0.6) {
				severity = "Mildly";
			}

			const recommendations = [];
			const smokerRecommendation = `<label for="smoker-recommendation" class="form-label">Smoking Habit :</label>
            <div name='smoker-recommendation' class='form-text'>You may want to consider quite smoking! Smoking increases your chance of developing lung cancer significantly as you age. Run the test again with different age group and altering smoking habit to find out.`;
			const drinkerRecommendation = `<label for="drinker-recommendation" class="form-label">Drinking Habit :</label>
            <div name='drinker-recommendation' class='form-text'>Adjust your drinking habit! Click link below to see recommendation.</div>
            <button type="button" class='link' onclick="window.location.href = 'https://www.verywellhealth.com/alcohol-and-lung-cancer-risk-2248986';"> Link </button>
            `;
			const anxietyRecommendation = `<label for="anxiety-recommendation" class="form-label">Coping with Anxiety :</label>
            <div name='anxiety-recommendation' class='form-text'>If you have been suffering from long-term anxiety, it is highly recommended to seek help from psychiatrist or other psychological related profession. Click the link below to see more information: </div>
            <button type="button" class='link' onclick="window.location.href = 'https://www.cancer.net/coping-with-cancer/managing-emotions/anxiety#:~:text=Many%20people%20with%20cancer%20have,returning%20or%20spreading%20after%20treatment';"> Link </button>
            `;
			const symptomsRecommendation = `<label for="symptoms-recommendation" class="form-label">Persistent physical symptoms :</label>
            <div name='symptoms-recommendation' class='form-text'>If you have been suffering from persistent physical symptoms such as chest pain, fatigue, short breath etc., it is highly recommended to seek help from your family doctor and perform regular medical examination to actively monitor your health status. Click the link below to see some common warning signs for lung cancer : </div>
            <button type="button" class='link' onclick="window.location.href = 'https://www.hopkinsmedicine.org/kimmel_cancer_center/cancers_we_treat/lung_cancer_program/warning_signs.html#:~:text=Chest%20pain%3A%20When%20a%20lung,breathing%20deeply%2C%20coughing%20or%20laughing';"> Link </button>
            `;

			const noWorries = `<label for="exercise-recommendation" class="form-label">You Are Good to Go !</label>
            <div name='no-recommendation' class='form-text'>It seems that you don't have anything to worry about! Try another test or doing the test again to see different result!</div>`;

			if (smoke) {
				recommendations.push(smokerRecommendation);
			}
			if (alcohol) {
				recommendations.push(drinkerRecommendation);
			}
			if (anxiety) {
				recommendations.push(anxietyRecommendation);
			}
			if (fatigue || shortBreath || chestPain || cough || swallow) {
				recommendations.push(symptomsRecommendation);
			}

			if (recommendations.length < 1) {
				recommendations.push(noWorries);
			}

			for (let i = 0; i < recommendations.length; i++) {
				if (i === 0) {
					recommendationBoard.innerHTML += recommendations[i];
				} else {
					recommendationBoard.innerHTML += "<hr>" + recommendations[i];
				}
			}
			document.querySelector("#recommendation-text").style.overflow = "auto";

			resultBoard.innerHTML = `
            <div id ='result-title'>${greet}</div>
            Accordingly to our prediction, <br> 
                Your risk for developing Lung Cancer is : <div id='test-result'> <h2>${severity} ${likelihood}</h2> </div> <div class='probability-result'> with ${probability} probability.</div>
                <div>Click to see our recommendations below!</div>
                <button id='lung-explain' class='explain-btn' data-bs-toggle="modal"
                data-bs-target="#explain-modal">Explain</button>
                <button id='lung-recommendation' class='recommendation-btn' data-bs-toggle="modal"
                data-bs-target="#recommendation-modal">Recommendation</button>
                `;
			document // add explanation
				.querySelector("#lung-explain")
				.addEventListener("click", () => {
					e.preventDefault();
					console.log("TEST");
					document.querySelector("#explain-text").innerHTML = `
                        <div>Dataset Detail : </div>
                        <div>
                            <ul>
                                <li class="form-text">Train-data Size : 559 ( 289 : 270 ) </li>
                                <li class="form-text">Accuracy :        76.79%</li>
                                <li class="form-text">Loss :            0.5139</li>
                            </ul>
                        </div> 
                        <hr><img src="/asset/graphs/lung_accuracy.png" alt="" width="400" height="350">
                        <hr><img src="/asset/graphs/lung_loss.png" alt="" width="400" height="350">
                    `;
					document.querySelector("#explain-text").style.overflow = "auto";
				});
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

			const result = await res.json();

			if (res.status !== 200) {
				console.log(result);
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
			const recommendationBoard = document.querySelector(
				"#recommendation-text"
			);
			const explanationBoard = document.querySelector("#explain-text");
			recommendationBoard.innerHTML = "";
			explanationBoard.innerHTML = "";

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
				testResult["probability"] >= 0.9 ||
				testResult["probability"] <= 0.1
			) {
				severity = "Extremely";
			}
			if (
				(testResult["probability"] >= 0.8 && testResult["probability"] < 0.9) ||
				(testResult["probability"] <= 0.3 && testResult["probability"] > 0.1)
			) {
				severity = "Very";
			}
			if (
				(testResult["probability"] >= 0.6 && testResult["probability"] < 0.8) ||
				(testResult["probability"] <= 0.4 && testResult["probability"] > 0.3)
			) {
				severity = "Moderately";
			}
			if (testResult["probability"] > 0.4 && testResult["probability"] < 0.6) {
				severity = "Mildly";
			}

			const recommendations = [];
			const smokerRecommendation = `<label for="smoker-recommendation" class="form-label">Smoking Habit :</label>
            <div name='smoker-recommendation' class='form-text'>You may want to consider quite smoking! Smoking increases your chance of having heart related disease significantly as you age. Run the test again with different age group and altering smoking habit to find out.`;
			const drinkerRecommendation = `<label for="drinker-recommendation" class="form-label">Drinking Habit :</label>
            <div name='drinker-recommendation' class='form-text'>Adjust your drinking habit! Click link below to see recommendation.</div>
            <button type="button" class='link' onclick="window.location.href = 'https://www.cdc.gov/alcohol/fact-sheets/moderate-drinking.htm#:~:text=To%20reduce%20the%20risk%20of,days%20when%20alcohol%20is%20consumed';"> Link </button>
            `;

			const sleepRecommendation = `<label for="sleep-recommendation" class="form-label">Sleep Habit :</label>
            <div name='sleep-recommendation' class='form-text'>It seems that you hour of sleep is not enough, check the link below to see some recommendation for sleep from Sleep Foundation.</div>
            <button type="button" class='link' onclick="window.location.href = 'https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need';"> Link </button>
            `;

			const exerciseRecommendation = `<label for="exercise-recommendation" class="form-label">Exercise Habit :</label>
            <div name='exercise-recommendation' class='form-text'>Regular, daily physical activity can lower the risk of heart disease. Physical activity helps control your weight. It also reduces the chances of developing other conditions that may put a strain on the heart, such as high blood pressure, high cholesterol and type 2 diabetes. Try running the test again at different age group and see the result!</div>`;

			const weightRecommendation = `<label for="exercise-recommendation" class="form-label">Weight Control :</label>
            <div name='exercise-recommendation' class='form-text'>According to your input, your BMI(Body mass index) is ${BMI}, which is consider ${BMIClassifier(
				BMI
			)}. Click link below to see how your weight affect your health.</div>
            <button type="button" class='link' onclick="window.location.href = 'https://www.hopkinsmedicine.org/health/wellness-and-prevention/weight-a-silent-heart-risk';"> Link </button>
            `;
			const noWorries = `<label for="exercise-recommendation" class="form-label">You Are Good to Go !</label>
            <div name='no-recommendation' class='form-text'>It seems that you don't have anything to worry about! Try another test or doing the test again to see different result!</div>`;

			if (smoke) {
				recommendations.push(smokerRecommendation);
			}
			if (alcohol) {
				recommendations.push(drinkerRecommendation);
			}
			if (sleep < 6) {
				recommendations.push(sleepRecommendation);
			}
			if (BMI >= 30 || BMI <= 18.5) {
				recommendations.push(weightRecommendation);
			}
			if (exercise === 0) {
				recommendations.push(exerciseRecommendation);
			}
			if (recommendations.length < 1) {
				recommendations.push(noWorries);
			}

			for (let i = 0; i < recommendations.length; i++) {
				if (i === 0) {
					recommendationBoard.innerHTML += recommendations[i];
				} else {
					recommendationBoard.innerHTML += "<hr>" + recommendations[i];
				}
			}
			document.querySelector("#recommendation-text").style.overflow = "auto";

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
			document // add explanation
				.querySelector("#heart-explain")
				.addEventListener("click", () => {
					e.preventDefault();
					console.log("TEST");
					document.querySelector("#explain-text").innerHTML = `
                        <div>Dataset Detail : </div>
                        <div>
                            <ul>
                                <li class="form-text">Train-data Size : 57373 ( 30000 : 27373 ) </li>
                                <li class="form-text">Accuracy :        96.79%</li>
                                <li class="form-text">Loss :            0.0802</li>
                            </ul>
                        </div> 
                        <hr><img src="/asset/graphs/suicide_accuracy.png" alt="" width="400" height="350">
                        <hr><img src="/asset/graphs/suicide_loss.png" alt="" width="400" height="350">
                    `;
					document.querySelector("#explain-text").style.overflow = "auto";
				});
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
		const ageGroup = parseInt(form["age"].value);
		const weight = parseFloat(form["weight-input"].value);
		const height = parseFloat(form["height-input"].value);
		const bmi = parseFloat((weight / (height / 100) ** 2).toFixed(2));
		const gender = parseInt(form["gender"].value);
		const smoke = parseInt(form["smoke"].value);
		const stroke = parseInt(form["stroke"].value);
		const heartAttack = parseInt(form["heart-attack"].value);
		const cholesterolCheck = parseInt(form["cholesterol-check"].value);
		const cholesterolHigh = parseInt(form["cholesterol-high"].value);
		const bloodPressure = parseInt(form["high-blood-pressure"].value);
		const fruit = parseInt(form["fruit"].value);
		const veggies = parseInt(form["veggies"].value);
		const exercise = parseInt(form["exercise-check"].value);
		const exerciseDays = parseInt(form["exercise-days"].value);
		const mentalHealth = parseInt(form["mental-health"].value);
		const alcohol = parseInt(form["drinker"].value);
		const generalHealth = parseInt(form["general-health"].value);

		testData.push(
			bloodPressure,
			cholesterolHigh,
			cholesterolCheck,
			bmi,
			smoke,
			stroke,
			heartAttack,
			exercise,
			fruit,
			veggies,
			alcohol,
			generalHealth,
			mentalHealth,
			exerciseDays,
			gender,
			ageGroup
		);
		console.log(testData);

		if (saveInfo) {
			const obj = {
				name: name,
				bmi: bmi,
				ageGroup: ageGroup,
				gender: gender,
				weight: weight,
				height: height,
				smoke: smoke,
				stroke: stroke,
				heartAttack: heartAttack,
				cholesterolCheck: cholesterolCheck,
				cholesterolHigh: cholesterolHigh,
				bloodPressure: bloodPressure,
				fruit: fruit,
				veggies: veggies,
				exercise: exercise,
				exerciseDays: exerciseDays,
				mentalHealth: mentalHealth,
				alcohol: alcohol,
				generalHealth: generalHealth,
			};

			const res = await fetch("/info", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(obj),
			});

			const result = await res.json();

			if (res.status !== 200) {
				console.log(result);
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
			alert("ERR002: Failed to post diabetes test data");
			document.location.reload();
		} else {
			const testResult = parseFloat(result.result.data);

			console.log(testResult);

			const probability = formatAsPercent(testResult);

			const resultBoard = document.querySelector("#test-result");
			const resultBox = document.querySelector("#test-result-container");

			let severity = "";
			if (testResult <= 100 && testResult >= 60) {
				severity = "Highly";
			}
			if (testResult < 60 && testResult >= 20) {
				severity = "Moderately";
			}
			if (testResult < 20) {
				severity = "Mildly";
			}

			resultBoard.innerHTML = `
            <div id ='result-title'>Here it is!</div>
                Accordingly to our prediction, <br> 
                Your risk for developing a Diabetes is : 
                <div id='test-result'> <h2>${severity}</h2></div> 
                    with ${probability} probability.
                <button id='diabetes-explain' class='explain-btn' data-bs-toggle="modal"
                    data-bs-target="#explain-modal">Explain</button>
            `;

			document
				.querySelector("#diabetes-explain")
				.addEventListener("click", () => {
					e.preventDefault();
					document.querySelector("#explain-text").innerHTML = `
                    <div>Dataset Detail : </div>
                    <div>
                        <ul>
                            <li class="form-text">Train-data Size : 75346 ( 35346 : 40000 ) </li>
                            <li class="form-text">Accuracy :        74.43%</li>
                            <li class="form-text">Loss :            0.5117</li>
                        </ul>
                    </div> 
                    <hr><img src="/asset/graphs/diabetes_accuracy.png" alt="" width="400" height="350">
                    <hr><img src="/asset/graphs/diabetes_loss.png" alt="" width="400" height="350">
                `;
					document.querySelector("#explain-text").style.overflow = "auto";
				});

			resultBox.style.display = "block";
		}
	});

document //form submission: strokes
	.querySelector("#stroke-form")
	.addEventListener("submit", async (e) => {
		e.preventDefault();
		const testData = [];
		const form = e.target;
		const saveInfo = form["save-info"].checked ? 1 : 0;
		const name = form["name"].value;
		const gender = parseInt(form["gender"].value);
		const weight = parseFloat(form["weight-input"].value);
		const height = parseFloat(form["height-input"].value);
		const hypertension = parseInt(form["hypertension-input"].value);
		const heartDisease = parseInt(form["heartDisease-input"].value);
		const smokingStatus = parseInt(form["smokingStatus-input"].value);
		const bmi = parseFloat((weight / (height / 100) ** 2).toFixed(2));
		const actualAge = parseFloat(form["actual-age"].value);

		testData.push(
			gender,
			actualAge,
			hypertension,
			heartDisease,
			bmi,
			smokingStatus
		);

		console.log(testData);

		if (saveInfo) {
			const obj = {
				name: name,
				gender: gender,
				actualAge: actualAge,
				height: height,
				weight: weight,
			};

			const res = await fetch("/info", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(obj),
			});

			const result = await res.json();

			if (res.status !== 200) {
				console.log(result);
				alert(res.msg);
			} else {
				const msg = "User Info Saved";
				showNotification(msg, 5000);
			}
		}

		const res = await fetch("/test/stroke", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(testData),
		});

		const result = await res.json();
		if (res.status !== 200) {
			alert("ERR002: Failed to post stroke test data");
			document.location.reload();
		} else {
			const testResult = result.result.data[0];
			const strokes = testResult["Stroke"];
			const probability = formatAsPercent(testResult["probability"] * 100);
			const resultBoard = document.querySelector("#test-result");
			const resultBox = document.querySelector("#test-result-container");
			const recommendationBoard = document.querySelector(
				"#recommendation-text"
			);
			const explanationBoard = document.querySelector("#explain-text");
			recommendationBoard.innerHTML = "";
			explanationBoard.innerHTML = "";

			let likelihood = "";
			let greet = "";
			if (strokes == "Yes") {
				greet = "Unfortunately";
				likelihood = "Likely";
			} else {
				greet = "Great!";
				likelihood = "Unlikely";
			}

			let severity = "";
			if (
				testResult["probability"] >= 0.9 ||
				testResult["probability"] <= 0.1
			) {
				severity = "Extremely";
			}
			if (
				(testResult["probability"] >= 0.8 && testResult["probability"] < 0.9) ||
				(testResult["probability"] <= 0.3 && testResult["probability"] > 0.1)
			) {
				severity = "Very";
			}
			if (
				(testResult["probability"] >= 0.6 && testResult["probability"] < 0.8) ||
				(testResult["probability"] <= 0.4 && testResult["probability"] > 0.3)
			) {
				severity = "Moderately";
			}
			if (testResult["probability"] > 0.4 && testResult["probability"] < 0.6) {
				severity = "Mildly";
			}

			resultBoard.innerHTML = `
            <div id ='result-title'>${greet}</div>
                Accordingly to our prediction, <br> 
                Your risk for developing Stroke is : 
                <div id='test-result'> <h2>${severity} ${likelihood}</h2> </div> 
                     with ${probability} probability.
                <button id='stroke-explain' class='explain-btn' data-bs-toggle="modal"
                data-bs-target="#explain-modal">Explain</button>
            `;

			document
				.querySelector("#stroke-explain")
				.addEventListener("click", () => {
					e.preventDefault();
					document.querySelector("#explain-text").innerHTML = `
                <div>Dataset Detail : </div>
                <div>
                    <ul>
                        <li class="form-text">Train-data Size : 891( 209 : 682 ) </li>
                        <li class="form-text">Accuracy :        79.92%</li>
                        <li class="form-text">Loss :            0.3993</li>
                    </ul>
                </div> 
                <hr><img src="/asset/graphs/stroke-output-accuracy.png" alt="" width="400" height="350">
                <hr><img src="/asset/graphs/stroke-output-loss.png" alt="" width="400" height="350">
            `;
					document.querySelector("#explain-text").style.overflow = "auto";
				});

			resultBox.style.display = "block";
		}
	});

document //Delete user info from DB
	.querySelector("#delete-button")
	.addEventListener("click", async (e) => {
		e.preventDefault();
		const res = await fetch("/info", {
			method: "DELETE",
		});

		const result = await res.json();

		if (res.status !== 200) {
			console.log(result);
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
	.querySelector("#clear-suicide")
	.addEventListener("click", (e) => {
		e.preventDefault();
		document.getElementById("suicide-text").value = "";
	});

// function formatAsPercent(num) {
// 	return new Intl.NumberFormat("default", {
// 		style: "percent",
// 		minimumFractionDigits: 2,
// 		maximumFractionDigits: 2,
// 	}).format(num / 100);
// }

function BMIClassifier(BMI) {
	let bmi = parseFloat(BMI);
	let category;

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

	return category;
}

function showNotification(msg, time) {
	const notification = document.querySelector("#notification-box");
	notification.innerHTML = msg;
	notification.style.display = "block";
	setTimeout(() => {
		notification.style.display = "none";
	}, time);
}

document // word counter
	.querySelector("#suicide-text")
	.addEventListener("input", (e) => {
		e.preventDefault();
		const str = e.target.value;
		const arr = str.replace(/[.,\/#!$%@\^&\*;:{}=\-_`~()]/g, "").split(" ");

		document.querySelector("#word-count").innerHTML = arr.filter(
			(word) => word !== ""
		).length;
	});

function prefillUserName() {
	if (globalName !== "") {
		const nameInputBox = document.querySelectorAll(".name");
		nameInputBox.forEach((box) => {
			box.value = globalName;
		});
	} else {
		document.querySelector("#start-button").click();
	}
}

function clearUser() {
	globalName = null;
	userInfo = null;
}
