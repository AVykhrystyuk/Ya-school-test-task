
const MyForm = {};

+function (namespace) {
    const fioElement = document.getElementsByName('fio')[0];
    const emailElement = document.getElementsByName('email')[0];
    const phoneElement = document.getElementsByName('phone')[0];
    const submitButtonElement = document.getElementById('submitButton');
    const myFormElement = document.getElementById('myForm');

    const inputElements = [
        fioElement,
        emailElement,
        phoneElement
    ];

    submitButtonElement.addEventListener('click', event => {
        if (typeof event !== 'undefined') {
            event.preventDefault();
        }

        submit();
    });

    function isNil(value) {
        return value === undefined || value === null;
    }

    function sendHttpRequest() {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open(myFormElement.method || "GET", myFormElement.action, true);
            xhr.send();
            xhr.onreadystatechange = function () {
                const operationCompletionState = 4;
                if (xhr.readyState != operationCompletionState) return;

                const operationSuccessStatus = 200;
                if (xhr.status == operationSuccessStatus) {
                    let data = JSON.parse(xhr.responseText);
                    resolve(data);
                } else {
                    let error = {
                        status: xhr.status,
                        message: xhr.statusText
                    };
                    reject(error);
                }
            }
        });
    }

    function submit() {
        for (let input of inputElements) {
            input.classList.remove('error');
        }

        resultContainer.className =
            resultContainer.innerHTML = '';

        let validationResult = validate();
        if (!validationResult.isValid) {
            for (let field of validationResult.errorFields) {
                let input = myFormElement.elements[field];
                input.classList.add('error');
            }
            return;
        }

        submitButtonElement.disabled = true;

        let onSuccessHttpRequest = data => {
            switch (data.status) {
                case 'success':
                    resultContainer.className = 'success';
                    resultContainer.innerHTML = 'Success';
                    break;
                case 'error':
                    resultContainer.className = 'error';
                    resultContainer.innerHTML = data.reason;
                    break;
                case 'progress':
                    resultContainer.className = 'progress';
                    setTimeout(() => sendHttpRequest().then(onSuccessHttpRequest), data.timeout);
                    break;
            }
        };

        sendHttpRequest().then(onSuccessHttpRequest);
    }

    function validate() {
        const invalidElements = [];

        const fioMaxWordsCount = 3;
        const fioCharactersPattern = new RegExp(/^[a-z а-я]*$/, "i");
        const fioValue = fioElement.value.trim();
        const fioWordsLength = fioValue.split(/\s+/).length;
        if (fioWordsLength !== fioMaxWordsCount || !fioCharactersPattern.test(fioValue)) {
            invalidElements.push(fioElement.name);
        }

        const allowedDomains = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
        const emailValue = emailElement.value.trim();
        const emailDomain = emailValue.replace(/.*@/, '');
        if (!allowedDomains.includes(emailDomain)) {
            invalidElements.push(emailElement.name);
        }

        const phonePattern = new RegExp(/^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/);
        const phoneMaxDigitsSum = 30;
        const phoneValue = phoneElement.value.trim();

        if (phonePattern.test(phoneValue)) {
            let phoneDigits = phoneValue.match(/\d/g);
            let phoneDigitsSum = phoneDigits.reduce((a, b) => +a + +b);
            if (phoneDigitsSum > phoneMaxDigitsSum) {
                invalidElements.push(phoneElement.name);
            }
        } else {
            invalidElements.push(phoneElement.name);
        }

        return {
            isValid: invalidElements.length === 0,
            errorFields: invalidElements
        }
    }

    function getData() {
        let data = {};
        for (let input of inputElements) {
            data[input.name] = input.value;
        };
        return data;
    }

    function setData(data) {
        for (let input of inputElements) {
            if (data.hasOwnProperty(input.name)) {
                let value = data[input.name];
                input.value = isNil(value) ? "" : value;
            }
        }
    }

    namespace.validate = validate;
    namespace.getData = getData;
    namespace.setData = setData;
    namespace.submit = submit;
}(MyForm);