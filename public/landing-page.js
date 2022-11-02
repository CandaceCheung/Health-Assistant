document.querySelector('#comment-form').addEventListener('submit', async (e) => {
    e.preventDefault;
    const form = e.target
    const saveInfo = form['save-info'].checked ? 1:0
    const name = form['name'].value; 
    const height = form['height'].value;
    const weight = form['weight'].value;
    const ageGroup = form['age'].value;
    const gender = form['gender'].value;
    const smoke = form['smoke'].checked ? 1:0;
    const sleep = form['sleep'].value;
    const exercise = form['exercise'].checked ? 1:0;
    const alcohol = form['alcohol'].checked ? 1:0;

    console.log(saveInfo,name,height,weight,ageGroup,gender,smoke,sleep,exercise,alcohol)


    // if (saveInfo){
    //     const obj = {
    //         commentId: commentId,
    //         check: check,
    //         eventId: eventId
    //     };
    // }


    // const res = await fetch(`http:localhost:8000/index/heart/`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(obj)
    // });

    // const result = await res.json();
    // if (result.status) {
    //     console.log(result.msg);
    // } else {
    //     alert('something when wrong when marking message as read');
    // }
});