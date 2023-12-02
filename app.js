// HANDLING SEARCH
// select elements
const shopifyForm = document.querySelector(".shopify-form");
const shopifySearch = document.querySelector(".shopify-search");

// add focus to search input on click
shopifyForm.addEventListener("click", () => {
  shopifySearch.focus();
});

// prevent submitting defaults
shopifyForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

// loacte the next focusable item and add focus on it
function focusNext() {
  let focusedElement = document.activeElement;
  let focusableElements = Array.from(
    document.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex = '-1'])"
    )
  );

  let currentIndex = focusableElements.indexOf(focusedElement);
  let nextIndex = (currentIndex + 1) % focusableElements.length;
  focusableElements[nextIndex].focus();
}

// HANDLING POPUPS
// select elements
const PopUps = document.querySelectorAll(".pop-up");
const toggleAlert = document.querySelector(".toggle-alert-btn");
const alertPopUp = document.querySelector(".alerts");
const profileMenu = document.querySelector(".profile-menu");
const profileMenuBtn = document.querySelector("#profile-menu-btn");
const navBtns = document.querySelectorAll(".nav-btn-flex button");

function togglePopUp(btn, popup) {
  let isExpanded = btn.ariaExpanded === "true";

  // remove the class active from existing popups
  PopUps.forEach((PopUp) => {
    PopUp.classList.remove("active");
    PopUp.ariaHidden = "true";
  });

  // remove the ariaExpanded from all popup buttons
  navBtns.forEach((navBtn) => {
    navBtn.ariaExpanded = "false";
  });

  // add the class active to the popup
  popup.classList.add("active");
  popup.ariaHidden = "false";

  // if the popup is already expanded close the popup else open it
  if (isExpanded) {
    btn.ariaExpanded = "false";
    popup.ariaHidden = "true";
    popup.classList.remove("active");
    document.onclick = null;
  } else {
    btn.ariaExpanded = "true";

    // dealing with the profile menu in particular
    if (popup == profileMenu) {
      const menuListItems = profileMenu.querySelectorAll("li a");
      menuListItems.item(0).focus();
      menuListItems.forEach((menuListItem, index) => {
        // adding keydown events to each menuListItem
        menuListItem.addEventListener("keydown", (e) => {
          if (e.code == "Enter" || e.code == "Space") {
            menuListItem.click();
          }
          if (e.code == "Home") {
            menuListItems.item(0).focus();
          } else if (e.code == "End") {
            menuListItems.item(menuListItems.length - 1).focus();
          }
          if (e.code === "ArrowRight" || e.code === "ArrowDown") {
            if (index === menuListItems.length - 1) {
              menuListItems.item(0).focus();
              return;
            }
            menuListItems.item(index + 1).focus();
          } else if (e.code === "ArrowLeft" || e.code === "ArrowUp") {
            if (index === 0) {
              menuListItems.item(menuListItems.length - 1).focus();
              return;
            }
            menuListItems.item(index - 1).focus();
          }
        });
      });
    }
    // dealing with the alerts menu in particular
    else if (popup == alertPopUp) {
      alertPopUp.focus();
    }

    // remove popup if user clicks outside the popup or btn
    document.onclick = (e) => {
      if (!popup.contains(e.target) && !btn.contains(e.target)) {
        popup.classList.remove("active");
        btn.focus();
      }
    };
  }
}

// adding esc button keydown event to the menu
function escapePopUp(e, popup, btn) {
  if (e.key === "Escape") {
    popup.classList.remove("active");
    popup.ariaHidden = "true";
    btn.ariaExpanded = "false";
    btn.focus();
  }
}

// event listeners
toggleAlert.addEventListener("click", () => {
  togglePopUp(toggleAlert, alertPopUp);
});
alertPopUp.addEventListener("keydown", (e) => {
  escapePopUp(e, alertPopUp, toggleAlert);
});

profileMenuBtn.addEventListener("click", () => {
  togglePopUp(profileMenuBtn, profileMenu);
});
profileMenu.addEventListener("keydown", (e) => {
  escapePopUp(e, profileMenu, profileMenuBtn);
});

//  HANDLING TRAIL CALLOUT
// select elements
const trialCallout = document.querySelector(".trial-callout");
const cancelBtn = trialCallout.querySelector(".cancel-btn");

// remove trial callout when user clicks cancel btn
cancelBtn.addEventListener("click", () => {
  trialCallout.classList.add("hidden");
  trialCallout.ariaHidden = "true";
  cancelBtn.ariaHidden = "true";

  // focus on the next focusable element, dont lose focus
  focusNext();
});

// HANDLING ONBOARDING STEPS
// select elements
const dropdownBtn = document.querySelector(".dropdown-btn");
const setupTaskContainer = document.querySelector(".setup-task-container");
const progressBar = document.querySelector("#progress-bar");
const progressBarLabel = document.querySelector(
  ".progress-bar-container label"
);
let taskItems = setupTaskContainer.querySelectorAll("li");

// set initial value
let checkedItems = 0;

// update progress bar
function updateProgressBar(value, length) {
  let multiplier = progressBar.max / length;
  let modifiedValue = value * multiplier;
  if (modifiedValue <= progressBar.max) {
    progressBar.value = modifiedValue;
    progressBarLabel.innerHTML = `<p>${value} / ${length} completed</p>`;
  }
}

// add active classlist to active item and focus on its label
function makeItemActive(index) {
  taskItems.item(index).querySelector("label").focus();

  taskItems.forEach((taskItem) => {
    taskItem.classList.remove("active");
  });
  taskItems.item(index).classList.add("active");
}

// toggle tasks container with dropdown button click
dropdownBtn.addEventListener("click", () => {
  setupTaskContainer.classList.toggle("show");

  let isExpanded = dropdownBtn.ariaExpanded === "true";
  if (isExpanded) {
    dropdownBtn.ariaExpanded = "false";
    dropdownBtn.classList.remove("rotate");
  } else {
    dropdownBtn.ariaExpanded = "true";
    dropdownBtn.classList.add("rotate");
    taskItems.item(0).querySelector("li label").focus();
    makeItemActive(0);
  }
});

// working on each task item
taskItems.forEach((taskItem, index) => {
  let taskLabel = taskItem.querySelector("label");
  let taskInput = taskLabel.querySelector("input");
  const taskTitle = taskItem.querySelector("li .card-heading");

  // clicking on the title makes the item active
  taskTitle.addEventListener("click", () => {
    makeItemActive(index);
  });

  // add escape keydown event on the taskitem
  taskItem.addEventListener("keydown", (e) => {
    if (e.code == "Escape") {
      taskItems.forEach((taskItem) => {
        taskItem.classList.remove("active");
      });
      setupTaskContainer.classList.remove("show");
      dropdownBtn.ariaExpanded = "false";
      dropdownBtn.classList.remove("rotate");
      dropdownBtn.focus();
    }
  });

  // add actove classlist pn click
  taskLabel.addEventListener("click", () => {
    makeItemActive(index);
  });

  // adding keydown events to the taskLabel;
  taskLabel.addEventListener("keydown", (e) => {
    if (e.code == "Enter" || e.code == "Space") {
      taskLabel.click();
    }

    if (e.code == "Home") {
      taskItems.item(0).querySelector("li label").focus();
    } else if (e.code == "End") {
      makeItemActive(taskItems.length - 1);
    }

    if (e.code === "ArrowRight" || e.code === "ArrowDown") {
      taskItem.classList.remove("active");
      if (index < taskItems.length - 1) {
        makeItemActive(index + 1);
      } else {
        makeItemActive(0);
      }
    } else if (e.code === "ArrowLeft" || e.code === "ArrowUp") {
      if (index > 0) {
        makeItemActive(index - 1);
      } else {
        makeItemActive(taskItems.length - 1);
      }
    }
  });

  // note the state changes of the associated inputs and modify accordingly
  taskInput.addEventListener("change", (e) => {
    if (e.target.checked) {
      // add loading class
      taskLabel.classList.add("loading");
      // taskLabel.ariaChecked = "true";
      taskLabel.ariaBusy = "true";
      setTimeout(() => {
        // mark as checked
        taskLabel.classList.remove("loading");
        if (index <= taskItems.length - 1) {
          taskItem.classList.remove("active");

          // search for the next unchecked item, if any and add the active classlist
          let taskItemsArr = Array.from(taskItems);
          let uncheckedItems = taskItemsArr.reduce((acc, taskItem, index) => {
            if (taskItem.querySelector("label").ariaChecked == "false") {
              acc.push(index);
            }
            return acc;
          }, []);
          let nextItem = uncheckedItems.find((item) => item > index);
          let selectItem = nextItem ? nextItem : uncheckedItems[0];
          if (selectItem >= 0) {
            makeItemActive(selectItem);
          } else {
            taskItems.item(index).querySelector("label").focus();
          }

          // update progress bar
          checkedItems++;
        }
        updateProgressBar(checkedItems, taskItems.length);
      }, 1500);
    } else {
      // add loading class
      taskLabel.classList.add("loading");
      taskLabel.ariaChecked = "false";
      setTimeout(() => {
        // mark as unchecked
        taskLabel.classList.remove("loading");

        // add active classlist
        taskItems.forEach((taskItem) => {
          taskItem.classList.remove("active");
        });
        taskItem.classList.add("active");

        // update progress bar
        checkedItems--;
        updateProgressBar(checkedItems, taskItems.length);
      }, 1000);
    }
  });
});
