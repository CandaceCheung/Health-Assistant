window.addEventListener('load', async ()=>{
    
   await getUserInfo()

})


function showNotification (msg, time){
    const notification = document.querySelector('#notification-box')
    notification.innerHTML = msg
    notification.style.display = 'block'
    setTimeout(()=>{notification.style.display = 'none'}, time)
}

export function formatAsPercent(num) {
    return new Intl.NumberFormat('default', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num / 100);
  }

async function getUserInfo() {
    
    const res = await fetch('/info', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const result = await res.json()

    if (res.status !== 200){
        console.log(res.msg)
        return
    }

    const name = result.data.name
    const height = result.data.height
    const weight = result.data.weight
    const ageGroup = result.data.ageGroup
    const gender = result.data.gender
    const smoke = result.data.smoke
    const sleep = result.data.sleep
    const exercise = result.data.exercise
    const alcohol = result.data.alcohol

    console.log(height, weight, ageGroup)

    // Set greeting
    document.querySelector('#name-greet')
        .innerHTML = `
            Hello ! <b>${name}</b> , Which Test Would You Like To Take ?
        `

    //prefill heart disease form

    document.querySelector('#prefill-heart').addEventListener('click', (e)=>{
        e.preventDefault()
        
		document.querySelector(`#heart-name`).value = name;
		document.querySelector(`#heart-height`).value = height;
		document.querySelector(`#heart-weight`).value = weight;
		document.querySelector('#heart-age').value = ageGroup;
        document.querySelector(`#heart-gender`).value = gender;
		document.querySelector('#heart-sleep').value = sleep;
		document.querySelector(`#heart-smoke`).checked = smoke;
        document.querySelector('#heart-exercise').checked = exercise;
        document.querySelector('#heart-alcohol').checked = alcohol;
    })

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
        const res = await fetch('/info', {
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

    const res = await fetch(`/test/heart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
    });

    const result = await res.json();
    if (res.status !== 200) {
        alert('ERR001: Failed to post test data')
        document.location.reload()
    } else {
     
        const testResult = result.result.data[0]
        const heartDisease = testResult['Heart Disease']
        const probability = formatAsPercent(testResult['probability']*100)
        const resultBoard = document.querySelector('#test-result')
        const resultBox = document.querySelector('#test-result-container')
        
        let greet = ''
        if (heartDisease == 'Yes'){
            greet = 'Oops...'
        } else {
            greet = 'Congratulation!'
        }
        
        resultBoard.innerHTML = `
            <div id ='result-title'>${greet}</div>
            Accordingly to our prediction, <br> 
                Your chance for developing a Heart Disease is : <div id='heart-disease-result'> <h2>${heartDisease}</h2> </div> with ${probability} probability. 
            `
            
        resultBox.style.display = 'block'

        console.log(testResult)
    }
});

document.querySelector('#delete-button').addEventListener('click', async (e)=>{
    e.preventDefault()
    const res = await fetch('/info', {
        method: 'DELETE'
    });

    setTimeout(()=>{document.location.reload()}, 5000)
    const msg = 'User Info Deleted'
    showNotification(msg, 5000)
    
    if (res.status !== 200){
        alert(res.msg)
    }
})

document.querySelector('#close-test-result')
    .addEventListener('click', ()=>{
        const resultBox = document.querySelector('#test-result-container')
        resultBox.style.display = 'none' 
    })