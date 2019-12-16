

document.addEventListener('DOMContentLoaded', () => {
    //loads current dogs on dog bar
    const dogBar = document.querySelector('#dog-bar')
    fetch('http://localhost:3000/pups')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        createDogSpan(data);
    })

    //Shows a dog in body when name is clicked on dog bar
    dogBar.addEventListener('click', (showDog))

    function showDog(e) {
        if (e.target !== e.currentTarget){
        let clickedId = e.target.id;
            fetch(`http://localhost:3000/pups/${clickedId}`)
                .then((response) => {
                    return response.json();
                }) .then ((data) => {
                    showDogInfo(data);
                })
        }
    }
    
    //event listener for clicking on good/bad button
    const dogInfo = document.querySelector('#dog-info')
    dogInfo.addEventListener('click', (updateGoodDog))

    //event handler to update good/bad status
    function updateGoodDog(event) {
        if (event.target !== event.currentTarget && event.target.tagName.toLowerCase() === 'button') {
            let clickedBtn = event.target;
            let btnText = clickedBtn.textContent
            let isGood = null
            if (btnText === 'Good Dog!'){
                isGood = false
                btnText = 'Bad Dog!'
                clickedBtn.classList.add('bad-dog')
                clickedBtn.classList.remove('good-dog')
            } else {
                isGood = true
                btnText = 'Good Dog!'
                clickedBtn.classList.add('good-dog')
                clickedBtn.classList.remove('bad-dog')
            }
            //update text on button
            clickedBtn.textContent = btnText;

            //update isGoodDog status on API
            fetch(`http://localhost:3000/pups/${clickedBtn.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accepts: 'application/json'
                },
                body: JSON.stringify({
                    isGoodDog: btnText
                })
            }) 
        }
    }

    //event listener for clicking on good/bad dog filter
    const filterDogsBtn = document.querySelector('#good-dog-filter')
    filterDogsBtn.addEventListener('click', filterGoodDogs)

    //event handler for filtering good/bad dogs
    function filterGoodDogs(e) {
        //update text on button
        const filterBtn = e.target
        let badDogs = document.querySelectorAll('#dog-bar span.bad-dog')
        
        //hides or displays bad dogs based on filter status
        if (filterBtn.textContent === 'Filter good dogs: OFF') {
            filterBtn.textContent = 'Filter good dogs: ON'
            badDogs.forEach((dog) => {
                dog.style.display = 'none'
            })
        } else {
            filterBtn.textContent = 'Filter good dogs: OFF'
            badDogs.forEach((dog) => {
                dog.style.display = 'flex'
            })
        }
    }
})

//creates dog span for each dog instance
function createDogSpan(dogs) {
    const dogBar = document.querySelector('#dog-bar')
    dogs.forEach((dog) => {
        const span = document.createElement('span')
        span.textContent = `${dog.name}`
        span.id = `${dog.id}`
        if (dog.isGoodDog) {
            span.classList.add('good-dog')
        } else {
            span.classList.add('bad-dog')
        }
        dogBar.appendChild(span)
    })
}

//shows dog info in body of page
function showDogInfo(dog) {
    const dogInfoArea = document.querySelector('#dog-info')

    //removes all children from div so dogs do not stack.
    while (dogInfoArea.firstChild) {
        dogInfoArea.removeChild(dogInfoArea.firstChild);
    }
    // used to set the text for button below
    let dogGoodness = null
    if (dog.isGoodDog) {
        dogGoodness = 'Good Dog!'
    } else {
        dogGoodness = 'Bad Dog!'
    }

    const dogImage = document.createElement('img')
    dogImage.src = `${dog.image}`
    dogInfoArea.appendChild(dogImage)
    
    const dogH2 = document.createElement('h2')
    dogH2.textContent = `${dog.name}`
    dogInfoArea.appendChild(dogH2)
    
    const dogButton = document.createElement('button')
    dogButton.textContent = dogGoodness
    dogButton.id = dog.id
    dogInfoArea.appendChild(dogButton)
}