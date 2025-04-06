document.addEventListener("DOMContentLoaded", function () {
	// Initialize variables for the form, input, list, and counters
	const todoForm = document.getElementById("todo-form");
	const todoInput = document.getElementById("todo-input");
	const todoList = document.getElementById("todo-list");
	const totalTodosElement = document.getElementById("total-todos");
	const completedTodosElement = document.getElementById("completed-todos");
	let todoArray = [];
	totalTodosElement.textContent = "0";
	completedTodosElement.textContent = "0";

	// Load todos from localStorage, handle errors, and ensure it's an array
	try {
		const storedTodos = localStorage.getItem("todoList");
		if (storedTodos) {
			todoArray = JSON.parse(storedTodos);
			if (!Array.isArray(todoArray)) {
				todoArray = [{ text: todoArray.toString(), completed: false }];
			}
		}
	} catch (error) {
		console.error("Error parsing todos from localStorage:", error);
		localStorage.removeItem("todoList");
	}

	// Update the total and completed counters
	function updateCounters() {
		totalTodosElement.textContent = todoArray.length || 0;
		const checkboxes = document.querySelectorAll(
			"#todo-list input[type='checkbox']:checked"
		);
		completedTodosElement.textContent = checkboxes.length || 0;
	}

	// Update the style of a todo item based on its completion status
	function updateTodoStyle(todoText, todoItem, isCompleted) {
		if (isCompleted) {
			todoText.style.textDecoration = "line-through";
			todoText.style.color = "#888";
			todoItem.style.backgroundColor = "#b3c5ca";
		} else {
			todoText.style.textDecoration = "none";
			todoText.style.color = "";
			todoItem.style.backgroundColor = "";
		}
	}

	// Render existing todos from the array
	todoArray.forEach((todo) => {
		addTodoToList(todo);
	});
	updateCounters();

	// Handle form submission to add a new todo
	todoForm.addEventListener("submit", function (event) {
		event.preventDefault();
		const todoText = todoInput.value.trim();
		if (todoText) {
			const newTodo = {
				text: todoText,
				completed: false,
			};
			todoArray.push(newTodo);
			addTodoToList(newTodo);
			saveTodos();
			updateCounters();

			todoInput.value = "";
		}
	});

	// Create and display a todo item in the list
	function addTodoToList(todo) {
		const todoItem = document.createElement("li");
		todoItem.className =
			"py-5 px-6 bg-white mb-2 rounded-md flex justify-between items-center hover:bg-light-blue translation duration-200 ease-in-out text-xl ";

		const todoTextWrapper = document.createElement("div");
		todoTextWrapper.className = "flex items-center";
		const checkboxContainer = document.createElement("div");
		checkboxContainer.className = "relative mr-3";

		// Create a custom checkbox
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.className = "peer absolute opacity-0 w-6 h-6 cursor-pointer z-10";
		checkbox.checked = todo.completed;

		const customCheckbox = document.createElement("div");
		customCheckbox.className =
			"w-6 h-6 rounded-full border-2 border-dark-green flex items-center justify-center " +
			"peer-checked:bg-dark-green peer-checked:border-dark-green transition-colors duration-200";

		const checkmark = document.createElement("div");
		checkmark.className =
			"hidden peer-checked:block w-3 h-3 rounded-full bg-white";
		customCheckbox.appendChild(checkmark);
		checkboxContainer.appendChild(checkbox);
		checkboxContainer.appendChild(customCheckbox);
		todoTextWrapper.appendChild(checkboxContainer);

		// Add the todo text
		const todoText = document.createElement("span");
		todoText.textContent = todo.text;

		updateTodoStyle(todoText, todoItem, todo.completed);

		// Update todo completion status when checkbox changes
		checkbox.addEventListener("change", function () {
			todo.completed = this.checked;
			updateTodoStyle(todoText, todoItem, this.checked);
			saveTodos();
			updateCounters();
		});

		todoTextWrapper.appendChild(todoText);

		// Add a delete button to remove the todo
		const deleteBtn = document.createElement("button");
		deleteBtn.innerHTML = "✕";
		deleteBtn.className = "text-red-300 font-bold";
		deleteBtn.style.cursor = "pointer";

		deleteBtn.addEventListener("click", function () {
			todoItem.remove();

			const index = todoArray.findIndex((item) => item.text === todo.text);
			// Remove the todo from the array if it exists (if it returns -1 it does not exist), then update the counters and save the updated list
			if (index > -1) {
				todoArray.splice(index, 1);
				updateCounters();
				saveTodos();
			}
		});

		todoItem.appendChild(todoTextWrapper);
		todoItem.appendChild(deleteBtn);
		todoList.appendChild(todoItem);
	}

	// Save the todos array to localStorage
	function saveTodos() {
		localStorage.setItem("todoList", JSON.stringify(todoArray));
	}
});
