const pupURL = "http://localhost:3000/pups";
isGood = false;

document.addEventListener("DOMContentLoaded", () => {
    const dogFilter = document.querySelector('#good-dog-filter')
    const dogBar = document.querySelector('#dog-bar')
    //dogFilter.innerHTML = "Filter good dogs: <span> OFF </span>"
    dogFilter.addEventListener("click", () => {
        if(dogFilter.innerHTML == "Filter good dogs: OFF") {
            dogFilter.innerHTML = "Filter good dogs: ON"
            isGood = true
            showGoodDogs()

        }
        else {
            dogFilter.innerHTML = "Filter good dogs: OFF"
            isGood = false
            getDogs()

        }
    })
    

    function showGoodDogs() {
        fetch(pupURL)
        .then(res => res.json())
        .then(data => data.filter(dog => dog.isGoodDog == true))
        .then(goodDogs => showDogs(goodDogs))
    }
 
    getDogs()
    function getDogs() {
        fetch(pupURL)
        .then(res => res.json())
        .then(data => showDogs(data))
    }

    function showDogs(data) {
        dogBar.innerHTML = ""
        for (const dog of data) {
            addDog(dog)
        }
    }

    function addDog(dog) {
        
        const divDog = makeDogCard(dog)
        dogBar.appendChild(divDog)
    }

    function makeDogCard(dog){
        const span = document.createElement('span')
        span.className = 'card'
        span.id = `card${dog.id}`

        const p = document.createElement('p')
        p.textContent = dog.name;

        span.appendChild(p)

        span.addEventListener("click", () => {
            const info = document.querySelector('#dog-info')
            info.innerHTML = ""
            
            const img = document.createElement('img')
            img.src = dog.image;

            const h3 = document.createElement('h3');
            h3.textContent = dog.name;

            const btn = document.createElement('button')
            if (dog.isGoodDog) {
                btn.textContent = "Good Dog"
            } else {
                btn.textContent = "Bad Dog"
            }
            btn.addEventListener("click", () => {
  
                dog.isGoodDog = !dog.isGoodDog
                updateGoodness(dog)
                if (dog.isGoodDog) {
                    btn.textContent = "Good Dog"
                } else {
                    btn.textContent = "Bad Dog"
                }
                
            })

            info.appendChild(img);
            info.appendChild(h3);
            info.appendChild(btn);

        })
        return span
    }

    function updateGoodness(dog) {
        fetch((pupURL + `/${dog.id}`), {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dog)
        })
        .then(resp => resp.json())
        .then(function() { 
            if(isGood) {
                showGoodDogs()
            }
        })
    }



})