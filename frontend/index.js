fetch("http://localhost:5000/")
    .then(res => res.json)
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.lo(err); 
    });