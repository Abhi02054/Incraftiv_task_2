// Define the URL of the API
const apiUrl = "http://dev.v2kart.com:8080/v2kart/service/categories/mainCategories";

let storedData = null;

// Select the UL element where you want to insert the list items
const navbarList = document.querySelector(".abo");
let navbarCategoryData = null;

// Function to create a dropdown menu
function createDropdown() {
    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";
    return dropdown;
}

const hashmap = {};

async function fetchapi(categoryName) {
    let api = `http://dev.v2kart.com:8080/v2kart/service/categories/${categoryName.toLowerCase()}/tree`;

    if (!hashmap[categoryName]) {
        console.log("Call the API");
        try {
            const response = await fetch(api);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            navbarCategoryData = data;
            hashmap[categoryName] = data;
        } catch (error) {
            console.error("Fetch error:", error);
        }
    } else {
        console.log("fetch data from store");
        navbarCategoryData = hashmap[categoryName];
    }

    
    let dropdown = document.querySelector(".dropdown");
    dropdown.innerHTML = "";

    if (navbarCategoryData && navbarCategoryData.data && navbarCategoryData.data.subCategory) {
        navbarCategoryData.data.subCategory.forEach(subCategory => {
            console.log(subCategory);
            const listItem = document.createElement("li");
            const anchor = document.createElement("a");
            anchor.style.color = "red";
            anchor.textContent = subCategory.categoryName;
            listItem.appendChild(anchor);
            dropdown.style.display = "flex";
            const styleBox = document.createElement("div");
            dropdown.appendChild(styleBox);
            styleBox.className = "style-box";
            styleBox.appendChild(listItem);

            for (let i = 0; i < navbarCategoryData.data.childCategory.length; i++) {
                if (navbarCategoryData.data.childCategory[i].parentId === subCategory.id) {
                    const subListItem = document.createElement("li");
                    const subAnchor = document.createElement("a");
                    subAnchor.textContent = navbarCategoryData.data.childCategory[i].categoryName;
                    subListItem.appendChild(subAnchor);
                    listItem.appendChild(subListItem);
                }
            }
        });
    }
}

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Handle the data and generate list items with dropdowns
        data.data.forEach(category => {
            const listItem = document.createElement("li");
            const anchor = document.createElement("a");
            anchor.textContent = category.categoryName;
            listItem.appendChild(anchor);

            anchor.classList.add("hover-effect");

            // Define the CSS for the hover effect
            const style = document.createElement("style");
            style.textContent = `
             .hover-effect:hover {
                border-bottom: 2px solid red;
            }
                `;

            // Append the style element to the document's head
            document.head.appendChild(style);

            // Create a dropdown for each list item
            const dropdown = createDropdown();
            // Add event listener to show dropdown on hover
            listItem.addEventListener("mouseenter", () => {
                listItem.appendChild(dropdown);
                dropdown.style.display = "block";
                fetchapi(category.categoryName);
            });

            // Add event listener to hide dropdown on mouse leave
            listItem.addEventListener("mouseleave", () => {
                dropdown.innerHTML = "";
                dropdown.style.display = "none";
                listItem.removeChild(dropdown);
            });

            navbarList.appendChild(listItem);
        });
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error("Fetch error:", error);
    }
}

// Call the fetchData function to start the process
fetchData();