# ya-school-test-task
Test task for Yandex Node.js school

## Requirements:
Implement an html page with markup, behavior logic and provide a global js object with the methods described below:

### 1. Markup

The page should have an html form with id = `"myForm"`, which contains a submit form button (id = `"submitButton"`) and the following inputs:
- `Name` (name = `"fio"`),
- `Email` (name = `"email"`),
- `Phone` (name = `"phone"`);
And also a div container with id = `"resultContainer"` must be set to display the result of the form.

### 2. Behavior

When submitting a form, fields should be validated according to the following rules:
- `Name`: Exactly three words.
- `Email`: The format of the email address, but only in the domains ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com.
- `Phone`: A phone number that starts at +7 and has the format +7 (999) 999-99-99. In addition, the sum of all phone numbers should not exceed 30. For example, for +7 (111) 222-33-11, the amount is 24, and for +7 (222) 444-55-66, the amount is 47.

If the validation fails, the error class with the specified border style: `1px solid red` should be added to the corresponding inputs.
If validation is successful, the form submit button should become inactive and an ajax request should be sent to the address specified in the action attribute of the form. 

There could be 3 types of respones to the sent request with different behavior for each:
- `{"status": "success"}` - the `resultContainer` container must be set with the `.success` class and the content with the text `"Success"` is added
- `{"status": "error", "reason": string}` - the `resultContainer` container should be set to the `.error` class and the content with the reason
- `{"status": "progress", "timeout": number}` - the `resultContainer` container must be set to the `.progress` class and after a timeout of milliseconds the request must be repeated (the logic must be repeated until the status returns other than progress in the response)

### 3. Global object

In the global scope, a `MyForm` object with the following methods must be defined:
- `validate(): { isValid: boolean, errorFields: string[] }` 

returns an object with a sign of the validation result (`isValid`) and an array of field names that failed the validation (`errorFields`).
- `getData(): object`

returns an object with form data, where the property names match the names of the inputs.
- `setData(object): void`

accepts an object with form data and sets them to form input. Fields other than `"phone"`, `"fio"`, `"email"` are ignored.
- `submit() void`

validates fields and sends an ajax request if validation is completed. Called by clicking on the `"submitButton"` button

### The root of the project must conains:
- `/index.html` - page layout;
- `/index.js` - all client page logic.

### Other
You can use any third-party frameworks and libraries to complete the task.
You can also use any modern specifications implemented in the latest versions of the Chrome browser.
The code should work locally without the need for Internet access.
