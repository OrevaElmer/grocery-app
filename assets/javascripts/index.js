/* SELECT ITEMS */
const alertP = document.querySelector(".alert")
const form = document.querySelector(".grocery-form")
const grocery = document.getElementById("grocery")
const submitBtn = document.querySelector(".submit-btn")
const groceryContainer = document.querySelector(".grocery-container")
const groceryList = document.querySelector(".grocery-list")
const clearBtn = document.querySelector(".clear-btn")

/* EDIT OPTION */
let editElement;
let editFlag = false
let editID = ""

/* FUNCTIONS */
// display alert
const displayAlert = (text,action)=>{
    alertP.textContent = text
    alertP.classList.add(action)

    setTimeout(()=>{
        alertP.textContent = ""
        alertP.classList.remove(action)
    },1000)
}


//set back to default:
const setBackToDefault = ()=>{
    grocery.value = ""
    editFlag = false
    editID = ''
    submitBtn.textContent = "Add"
}

/* LOCAL STORAGE */
const addToLocalStorage = (id, value)=>{
    //since id equals id likewise value then write it es6 format
    // const grocery = {id: id, value : value}
    const grocery = {id, value}
    //if item is already in local storage, get all of them otherwise set it to empty string
    let items = getLocalStorage()
    //Add the new grocery to item
    items.push(grocery)
    //Add items back to local storage
    localStorage.setItem("list", JSON.stringify(items))
}

const removeFromLocalStorage = (id)=>{
    //get all items from local storage:
    let items = getLocalStorage()
    //filter the items:
    items = items.filter((item)=>{
        if(item.id !== id){
            return item
        }
    })
    //set it back to local storage:
    localStorage.setItem("list", JSON.stringify(items))
}

const editLocalStorage = (id, value)=>{
    let items = getLocalStorage()
    items = items.map((item)=>{
        if(item.id === id){
            item.value = value
        }
        return item
    })
    localStorage.setItem("list", JSON.stringify(items))
}
const getLocalStorage=()=>{
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : []
}


//delete function:
const deleteItem = (e)=>{
    //get the parent of the parent element of the button
    const element = e.currentTarget.parentElement.parentElement
    //get element id:
    const id = element.dataset.id
    //remove it from the grocery list
    groceryList.removeChild(element)
    //if the length of grocery list is empty, remove the container
    if(groceryList.children.length === 0){
        groceryContainer.classList.remove("show-container") 
    }
    //display alert:
    displayAlert("item removed", "alert-danger")
    //set back to default:
    setBackToDefault()
    //remove from local storage:
    removeFromLocalStorage(id)
}
//edit function:
const editItem = (e)=>{
    //get the parent of the parent element
    const element = e.currentTarget.parentElement.parentElement
    //get the sibling of the parent of previous element
    editElement = e.currentTarget.parentElement.previousElementSibling
    //set the form input value
    grocery.value = editElement.innerHTML
    //set edit flag to true
    editFlag = true
    //get the element id
    editID = element.dataset.id
    //change the submit text content
    submitBtn.textContent = "Edit"
}
//set up items
const setUpItems = ()=>{
    let items = getLocalStorage()
    if(items.length>0){
        items.forEach((item)=>{
            createListItem(item.id, item.value)
        })
        groceryContainer.classList.add("show-container")
    }
}
const createListItem = (id, value)=>{
    //create the item article:
    const element = document.createElement("article")
    //Add class of grocery-item to the new element:
    element.classList.add("grocery-item")
    //create a data-id attribute for each article:
    const attr = document.createAttribute("data-id")
    //add our unique id to attr:
    attr.value = id
    //add attr to our new element:
    element.setAttributeNode(attr)
    element.innerHTML = `
        <p class="item">${value}</p>
        <div class="button-container">
            <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
            <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `
    //this is the best place to get the query selector of the edit and delete button
    const deleteBtn = element.querySelector(".delete-btn")
    const editBtn = element.querySelector(".edit-btn")
    deleteBtn.addEventListener("click", deleteItem)
    editBtn.addEventListener("click", editItem)

    //append each element to grocery-list:
    groceryList.appendChild(element)
}
//load items from local storage:
window.addEventListener("DOMContentLoaded", setUpItems)
// add item
const addItem = (e)=>{
    e.preventDefault()
    //get the input grocery:
    const value = grocery.value
    //create a unique id and convert it to string:
    const id = new Date().getTime().toString()

    //if we are just adding item to the list
    if(value && !editFlag){
        createListItem(id,value)

        //display the alert:
        displayAlert("Item Added to the list", "alert-success")
        //show container list:
        groceryContainer.classList.add("show-container")
        //add to local storage:
        addToLocalStorage(id,value)
        //set back to default:
        setBackToDefault()
    }
    //if we are editing:
    else if(value && editFlag){
        //set editElement to value
        editElement.innerHTML = value
        //display alert
        displayAlert("item updated","alert-success")
        //edit local storage:
        editLocalStorage(editID,value)
        //set back to default
        setBackToDefault()
    }
    //if nothing is added to the list:
    else{
        displayAlert("Please Enter Value", "alert-danger")
    }
}

/* EVENT LISTENERS */
//SUBMIT FORM
form.addEventListener("submit", addItem)


// clear items:
const clearItems = ()=>{
    //get all article items in the grocery list:
    const items = document.querySelectorAll(".grocery-item")
    //check if length is greater than zero then delete all item
    if(items.length>0){
        items.forEach((item)=>{
            groceryList.removeChild(item)
        })
        //hide the container since it is now empty:
        groceryContainer.classList.remove("show-container")
        // display alert message:
        displayAlert("list emptied", "alert-danger")
        setBackToDefault()
        localStorage.removeItem("list")
    }
}

clearBtn.addEventListener("click", clearItems)