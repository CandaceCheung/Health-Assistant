function showNotification (msg, time){
    const notification = document.querySelector('#notification-box')
    notification.innerHTML = msg
    notification.style.display = 'block'
    setTimeout(()=>{notification.style.display = 'none'}, time)
}

document.querySelector('#heart-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const testData = []
    const form = e.target
    const saveInfo = form['save-info'].checked ? 1 : 0
    const name = form['name'].value;
    const height = parseInt(form['height'].value);
    const weight = parseFloat(form['weight'].value);
    const ageGroup = parseInt(form['age'].value);
    const gender = parseInt(form['gender'].value);
    const smoke = form['smoke'].checked ? 1 : 0;
    const sleep = parseInt(form['sleep'].value);
    const exercise = form['exercise'].checked ? 1 : 0;
    const alcohol = form['alcohol'].checked ? 1 : 0;
    const BMI = parseFloat((weight / ((height / 100) ** 2)).toFixed(2))

    testData.push(BMI, smoke, alcohol, gender, ageGroup, exercise, sleep)
    console.log(testData)

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
        const res = await fetch('/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });

        const msg = 'User Info Saved'
        showNotification(msg, 5000)

        if (res.status !== 200) {
            alert(res.msg)
        }
    }

    // const res = await fetch(`http:localhost:8000/index/test/heart`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(testData)
    // });

    // const result = await res.json();
    // if (result.status !== 200) {
    //     alert('ERR001: Failed to post test data')
    //     document.location.reload()
    // } else {
    //     console.log(result)
    // }
});

document.querySelector('#delete-button').addEventListener('click', async (e)=>{
    e.preventDefault()
    const res = await fetch('/test', {
        method: 'DELETE'
    });

    const msg = 'User Info Deleted'
    showNotification(msg, 5000)

    if (res.status !== 200){
        alert(res.msg)
    }
})


document.querySelector("#diabetes-form").addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target
    const saveInfo = form['save-info'].checked ? 1 : 0
    const name = form['name'].value;
    const pregnancies = form['pregnancies'].value;
    const glucose = form['glucose'].value;
    const bloodPressure = form['blood-pressure'].value;
    const skinThickness = form['skin-thickness'].value;
    const insulin = form['insulin'].value;
    const bmi = form['bmi'].value;
    const pedigree = form['pedigree'].value;
    const age = form['age'].value;

    // save info ??
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
        age: age
    }

    const res = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    });

    const collection = document.getElementsByClassName("card-text");
    collection[0].innerHTML = await res.text()
    }

});