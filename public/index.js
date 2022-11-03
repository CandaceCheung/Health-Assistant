let username = ''

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
    username = name

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

        if (res.status !== 200) {
            console.log(res.msg)
        }
    }

    // const res = await fetch(`http:localhost:8000/index/test/heart`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(testData)
    // });

    const result = await res.json();
    if (result.status !== 200) {
        alert('ERR001: Failed to post test data')
        document.location.reload()
    } else {
        console.log(result)
    }
});

document.querySelector('#delete-button').addEventListener('click', async (e)=>{
    e.preventDefault()
    const res = await fetch('/test', {
        method: 'DELETE'
    });

    if (res.status !== 200){
        alert(res.msg)
    }
})