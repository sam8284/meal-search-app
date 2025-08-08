
const urlList = 'https://www.themealdb.com/api/json/v1/1/list.php?'
// const urlList = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list'

//modal elements
const overlay = document.getElementById("overlay")
const overlayContainer = document.getElementById("overlay-container")
const cancelOverlay = document.querySelector(".close")

const mealDetails = document.getElementById("meal-details")
const mealInfo = document.getElementById("meal-info")
const mealCancel = document.querySelector("#meal-cancel")

const form = document.querySelector("form")
const recipeContainer = document.querySelector(".recipe-container")
const recipe = document.querySelector(".recipe")

//elements for search
const text = document.querySelector("#searchText")
const searchBtn = document.querySelector("#searchBtn")
const resetAllBtn = document.querySelector("#reset-all")
const addFilter = document.querySelector("#addFilter")
const filterDiv = document.querySelector("#filterBox")
const apply = document.querySelector("#apply")
const cancel = document.querySelector("#cancel")
const select = document.querySelectorAll("select")
const filters = filterDiv.querySelectorAll('input[type="checkbox"]')
const closeFilterDiv = document.querySelector("#close-filter")

//elements for spinner
const loader = document.querySelector('.spinner');
const noOfRecipes = document.getElementById('no-of-recipes')
const refreshBtn = document.getElementById('refresh')

//closing filter div
closeFilterDiv.addEventListener("click", (e) => {
    filterDiv.classList.toggle("hidden");
})

// for fileters
let selected = {}
let tempList = {}
let filtered = {}

// recipe card data loading
recipeContainer.addEventListener("click", (e) => {
    clicked = e.target.tagName;
    const parent = e.target.parentElement
    if (clicked === "BUTTON") {
        const recipe = JSON.parse(parent.getAttribute("data-meal"))
        const children = overlay.children;
        children[1].textContent = recipe.strMeal;
        const main = children[2].children
        main[0].setAttribute("src", recipe.strMealThumb)
        const desc = main[1].children;
        desc[0].textContent = `Category : ${recipe.strCategory}`;
        desc[1].textContent = `${recipe.strArea} Cuisine `;

        // for showing ingredients
        // const ing = JSON.parse(parent.getAttribute("data-ingredient"))
        // const m = JSON.parse(parent.getAttribute("data-measure"))
        const ing = JSON.parse(parent.getAttribute("data-ingredient"))
        const m = JSON.parse(parent.getAttribute("data-measure"))

        console.log("Ingresient laegth", ing.length);
        for (let i = 0; i < ing.length; i++) {
            const listItem = document.createElement("li")
            listItem.textContent = `${ing[i][1]} - ${m[i][1]}`
            desc[3].appendChild(listItem)
        }
        children[4].textContent = recipe.strInstructions
        overlay.classList.add("active");
        console.log("ing", typeof ing);
        console.log("ing", typeof m);
        console.log("ing", typeof ing);
        // recipeContainer.textContent="";
    }
})

//modal close
cancelOverlay.addEventListener("click", (e) => {

    const allList = document.querySelectorAll("#overlay li")
    console.log(allList);
    allList.forEach(li => li.remove());
    // ing={}; 
    overlay.classList.remove("active");
    // overlay.innerText="";
})


//to maintain button hover effect after adding filter
addFilter.addEventListener('mouseenter', () => {
    addFilter.classList.add('hovered');
    addFilter.classList.remove("active")
});


addFilter.addEventListener('mouseleave', () => {
    addFilter.classList.add('active');
    addFilter.classList.remove('hovered');
});

//to close modal through keyboard excape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        overlay.classList.remove("active");
    }
})


//refresh button to handle network timeout
refreshBtn.addEventListener("click", (e) => {
    refreshBtn.style.display = "none";
    location.reload();
})

//reset search 
resetAllBtn.addEventListener("click", (e) => {
    location.reload();
})

const fetchPromises = [];

//loading random recipes from API
async function getOnLoad() {
    try {
        setTimeout(() => {
            if (window.getComputedStyle(loader).display == 'block') {
                loader.style.display = "none"
                refreshBtn.style.display = "block"
                console.log('Still loading')
            }

        }, 10000);

        //adding category options for  category filter
        const urlListC = `${urlList}c=list`
        const responseC = await fetch(urlListC);
        const dataC = await responseC.json()
        const catogories = (dataC.meals).map(val => val.strCategory)


        for (let i = 0; i < catogories.length; i++) {
            const o = document.createElement("option")
            o.textContent = catogories[i]
            select[0].appendChild(o)
        }

        //adding area options for  area filter
        const urlListA = `${urlList}a=list`
        const responseA = await fetch(urlListA);
        const dataA = await responseA.json()
        const area = (dataA.meals).map(val => val.strArea)

        for (let i = 0; i < area.length; i++) {
            const o = document.createElement("option")
            o.textContent = area[i]
            select[1].appendChild(o)
        }


        //loading random recipe from API
        for (let i = 0; i < 16; i++) {
            try {

                const fetchPromise = fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
                    .then(res => {
                        return res.json()
                    })
                    .then(data => {
                        const ingd = Object.entries(data.meals[0]).filter(([key, value]) => {
                            return key.startsWith("strIngredient") && value && value !== "";
                        });

                        const measure = Object.entries(data.meals[0]).filter(([key, value]) => {
                            return key.startsWith("strMeasure") && value && value !== " ";
                        });

                        addValues(data)
                    })
                fetchPromises.push(fetchPromise);
            }
            catch (err) {
                console.log(e)
            }
        }
        loader.classList.add('visible')
    }
    catch (err) {
        console.log(err)
    }
}


// to show filter div

addFilter.addEventListener("click", (e) => {

    if (addFilter.textContent === "Add Filters") {
        filters.forEach(val => {
            val.checked = false
        })

        select.forEach(val => {
            val.style.color = "black"
        })
    }

    filterDiv.classList.toggle("hidden");
})

//creating HTML element for recipe
function createElement() {
    const img = document.createElement("img")
    const h2 = document.createElement("h2")
    const h3 = document.createElement("h3")
    const h32 = document.createElement("h3")
    const btn = document.createElement("button")
    btn.textContent = "Let's Cook "
    const elementList = [img, h2, h3, h32, btn]
    return elementList;
}


//adding new recipe in container
function addValues(data) {
    data.meals.forEach(val => {
        const recipe = document.createElement("div")
        recipe.classList.add("recipe")
        const arr = createElement();
        arr[0].setAttribute("src", `${val.strMealThumb}`)
        arr[1].textContent = val.strMeal;
        arr[2].textContent = `(${val.strCategory})`;
        arr[3].textContent = `${val.strArea} Cuisine`
        arr[4].setAttribute("data-id", val.idMeal)

        arr.forEach(val => {
            recipe.appendChild(val)
        })

        //finding list of ingredients
        const ingd = Object.entries(val).filter(([key, value]) => {
            return key.startsWith("strIngredient") && value && value !== "";
        });

        const measure = Object.entries(val).filter(([key, value]) => {
            return key.startsWith("strMeasure") && value && value !== " ";
        });



        //setting data attributes of recipe
        recipe.setAttribute("data-meal", JSON.stringify(val))
        recipe.setAttribute("data-ingredient", JSON.stringify(ingd))
        recipe.setAttribute("data-measure", JSON.stringify(measure))

        const ingredientDiv = document.createElement("div");
        ingredientDiv.className = "ing-details";

        const h4 = document.createElement("h4")
        h4.textContent = 'Ingredients :'
        const ul = document.createElement("ul");

        for (let i = 0; i < ingd.length; i++) {
            const li = document.createElement("li")
            li.textContent = `${ingd[i][1]}`
            ul.appendChild(li)
        }

        ingredientDiv.appendChild(h4)
        ingredientDiv.appendChild(ul)
        recipe.appendChild(ingredientDiv)
        recipeContainer.appendChild(recipe)
    })
}


//add filter
apply.addEventListener("click", (e) => {
    selected = tempList;
    filterDiv.classList.toggle("hidden");
    if (Object.keys(selected).length > 0) {
        addFilter.textContent = `Filters : (${Object.keys(selected).length})`
        addFilter.style.borderWidth = "3px"
        addFilter.style.borderStyle = "solid"
        addFilter.style.borderColor = "#ffffff"
    }
    else {
        addFilter.style.backgroundColor = "#C75D2C"
        addFilter.textContent = `Add Filter`
        addFilter.style.borderWidth = "2px"
        addFilter.style.borderStyle = "solid"
        addFilter.style.borderColor = "#ffffff"

    }
})

//cancel filter div

cancel.addEventListener("click", (e) => {
    tempList = {};//new code
    selected = {}

    filters.forEach(val => {
        val.checked = false
    })

    select.forEach(val => {
        val.style.color = "black"
    })
    console.log("selected in cancel", selected)
    console.log("Selected length in cancel", Object.entries(selected).length)
    addFilter.textContent = "Add Filters"
    addFilter.style.color = "white"
    addFilter.style.backgroundColor = "#C75D2C"
    addFilter.style.borderWidth = "2px"
    addFilter.style.borderStyle = "solid"
    addFilter.style.borderColor = "#ffffff"

    addFilter.classList.remove('hovered');
    addFilter.classList.add('active');
    console.log("cancel button", addFilter.classList)
    filterDiv.classList.toggle("hidden");
})

let searchData;

//checkbox change events
filters.forEach(val => {
    val.addEventListener("input", (e) => {
        let key = e.target.value;

        const options = document.querySelector("option")
        console.log(options)

        if (e.target.checked) {
            let s;
            select.forEach(val => {
                if (val.name === e.target.id) {
                    val.style.color = "#C75D2C"
                    s = val.name
                }

                for (let i = 0; i < val.options.length; i++) {
                    val.options[i].style.color = 'black'; // default color
                }
                const selectedOption = val.options[val.selectedIndex];
                const selectedColor = val.style.color;
                selectedOption.style.color = selectedColor;

            })

            select.forEach(val => {
                if (val.name == key) {
                    tempList[key] = val.value
                }
            })

        }
        else {
            select.forEach(val => {
                if (val.name === e.target.id) {
                    val.style.color = "black"
                }
            })
            delete tempList[e.target.value]

        }
    })

})










let count = 0;

//search input validation
function triggerShake() {
    text.classList.remove('null-value');          // remove if already there
    void text.offsetWidth;                   // force reflow to restart animation
    text.classList.add('null-value');             // add shake animation
}


//implementing search functionality
searchBtn.addEventListener("click", (e) => {
    if (text.value === "" && selected && Object.keys(selected).length === 0) {
        triggerShake();
    }
    else {

        //if keyword is present

        noOfRecipes.style.display = 'block'
        noOfRecipes.textContent = `Recipe Matches ...`
        loader.classList.remove('visible');
        setTimeout(() => {
            if (window.getComputedStyle(loader).display == 'block') {
                loader.style.display = "none"
                refreshBtn.style.display = "block";
                noOfRecipes.style.display = "none"
                console.log('Still loading')
            }

        }, 10000);

        recipeContainer.innerHTML = "";


        //if no filter is applied
        if (Object.keys(selected).length === 0) {

            //calling API to search recipe by keyword
            searchResults(text.value.trim()).then(data => {
                searchData = data


                if (searchData.meals && Array.isArray(searchData.meals)) {
                    let len = (Object.values(searchData.meals)).length

                    addValues(searchData)
                    loader.classList.add('visible');
                }
                else {
                    noOfRecipes.textContent = 'No Recipe Matches'
                }
            }).catch(err => {
                console.log(err)
            })


            selected = {}
        }
        else {

            //if both keyword and filters are present
            for (const [k, v] of Object.entries(selected)) {

                //calling API for advanced search
                selectedSearchResults(k, v).then(data => {
                    for (i of data.meals) {

                        //finding recipe by ID from API
                        getByID(i.idMeal).then(data => {

                            const selectedKeys = Object.keys(selected);

                            //only category filter is applied
                            if (selectedKeys.includes("c") && selectedKeys.length === 1) {
                                if (selected["c"] === data.meals[0].strCategory && text.value.trim() !== "") {
                                    if ((data.meals[0].strMeal).toLowerCase().includes(text.value.trim().toLowerCase())) {

                                        count += 1;
                                        addValues(data)
                                    }
                                }
                                else {
                                    count += 1;
                                    addValues(data)

                                }
                            }
                            //only area filter is applied
                            else if (selectedKeys.includes("a") && selectedKeys.length === 1) {
                                if (selected["a"] === data.meals[0].strArea && text.value.trim() !== "") {
                                    if ((data.meals[0].strMeal).toLowerCase().includes(text.value.trim().toLowerCase())) {
                                        count += 1;
                                        addValues(data)
                                    }
                                }

                                else {
                                    count += 1;
                                    addValues(data)
                                }
                            }
                            //both categry and area filters are applied
                            else if (selected["c"] === data.meals[0].strCategory && selected["a"] === data.meals[0].strArea && selectedKeys.length === 2) {
                                if (text.value.trim() !== "") {
                                    if ((data.meals[0].strMeal).toLowerCase().includes(text.value.trim().toLowerCase())) {
                                        count += 1;
                                        addValues(data)
                                    }
                                }

                                else {
                                    count += 1;
                                    addValues(data)
                                }
                            }


                            loader.classList.add('visible')
                            count > 0 ? noOfRecipes.textContent = `Recipe Matches : ${count}` : noOfRecipes.textContent = `No Recipe Matches`

                        }).catch(err => {
                            console.log("Error", err)
                        })

                    }

                }).catch(err => {
                    console.log("Error", err)
                })
            }
        }
    }
    count = 0;

})


//handling select element value change
select.forEach(val => {

    val.addEventListener("change", (e) => {
        if ((Object.keys(selected)).includes(e.target.name)) {
            selected[e.target.name] = e.target.value
        }

        for (let i = 0; i < val.options.length; i++) {
            val.options[i].style.color = 'black'; // default color
        }

        const selectedOption = val.options[val.selectedIndex];
        const selectedColor = val.style.color;

        selectedOption.style.color = selectedColor;
    })

})







//API call for search input
async function searchResults(inputText) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputText}`)
    const data = await response.json();
    return data

}

//API call for particular filter 
async function selectedSearchResults(k, v) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?${k}=${v}`);
    const data = await response.json();
    return data
}


//API call to find recipe by ID
async function getByID(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data
}


// Wait for all fetches to complete
Promise.all(fetchPromises)
    .then(results => {
        console.log('All API data:', results);
        document.querySelector('.recipe-container').style.display = 'grid';
    })
    .catch(error => {
        console.error('At least one fetch failed:', error);
    });









