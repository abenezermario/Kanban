function kanban() {
  // initializing
  const addTask = document.getElementById("add-task");
  const todoBlock = document.getElementById("kanban-block-todo");
  const kanbanBlock = document.querySelectorAll(".kanban-block");
  // main obj
  const kanban = {
    todo: [],
    inProgress: [],
    done: [],
    total: 0,
    progress: 0,
  };
  kanban.addTodo = function () {
    const todoList = document.querySelector("#todo");
    const newLi = document.createElement("LI");
    const editable = document.createElement("div");
    editable.toggleAttribute("contentEditable", true);
    editable.draggable = true;
    editable.textContent = "";
    editable.classList.add("card-text");
    newLi.appendChild(editable);
    newLi.classList.add("card");

    todoList.appendChild(newLi);
    todoBlock.appendChild(todoList);
    editable.addEventListener("keydown", function (e) {
      if (e.which == 13) {
        e.preventDefault();
        this.contentEditable = false;
        kanban.drag();
        e.target.blur(); // remove focus after enter
        if (this.textContent) {
          // if text add todo
          kanban.total++; // update total todos
          console.log("total: ", kanban.total);
          kanban.checkProgress(); // check progress
          kanban.addTodo();
        } else {
          // remove the list element
          newLi.remove();
        }
      }
    });
  };
  // add button
  addTask.addEventListener("click", function () {
    kanban.addTodo();
    kanban.checkProgress(); // check progress
  });

  // drag function
  kanban.drag = function () {
    const listElements = document.querySelectorAll(".card");
    if (listElements) {
      listElements.forEach((item) => {
        item.addEventListener("dragstart", function () {
          item.classList.add("drag");
        });
        item.addEventListener("dragend", function () {
          kanban.checkProgress();
          item.classList.remove("drag");
        });
      });
      kanbanBlock.forEach((container) => {
        container.addEventListener("dragover", function (e) {
          e.preventDefault();
          const ul = container.querySelector("ul");
          const afterElement = dragAfterElement(ul, e.clientY);
          const draggedItem = document.querySelector(".drag");
          // if element is over ntn or middle or itself

          // kanban.checkProgress();
          if (afterElement == null) {
            ul.appendChild(draggedItem);
          } else {
            ul.insertBefore(draggedItem, afterElement);
          }
        });
      });
    }

    // returns the element which our mouse position is
    // directly after
    function dragAfterElement(container, y) {
      const draggableElements = [
        ...container.querySelectorAll(".card:not(.drag)"),
      ]; // elements in the ul other than the one being dragged
      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          // console.log(box);
          const offset = y - box.top - box.height / 2;

          if (offset < 0 && offset > closest.offset) {
            return {
              offset: offset,
              element: child,
            };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    }
  };

  // check and update progress

  kanban.checkProgress = function () {
    const todoBlock = document.querySelector("#todo");
    const ipBlock = document.querySelector("#inProgress");
    const doneBlock = document.querySelector("#done");
    const prog = document.querySelector(".progress");

    const ipItems = ipBlock.querySelectorAll("li");
    console.log("ip: ", ipItems);
    const doneItems = doneBlock.querySelectorAll("li");
    console.log("doneItems: ", doneItems);
    prog.style.width = `0%`;
    this.progress =
      ((ipItems.length / this.total) * 0.5 + doneItems.length / this.total) *
      100;

    // console.log(this.progress);

    prog.style.width = `${this.progress}%`;
    // console.log(prog.style.);
    const numOfElements = {
      todos: 0,
      inProg: 0,
      done: 0,
    };
  };
}

kanban();
