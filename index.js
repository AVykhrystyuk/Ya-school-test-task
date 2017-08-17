
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

    function validateEmail(email) {
        let emailParts = email.split("@");
        if (emailParts.length !== 2) {
            return false;
        }

        let local = emailParts[0];
        let domain = emailParts[1];

        const maxLocalPartLength = 64;      
        if (local.length > maxLocalPartLength) {
            return false;
        }

        const localPartRegexp = /^([\w-]+(?:\.[\w-]+)*)$/;        
        if (!localPartRegexp.test(local)) {
            return false;
        }

        const allowedDomains = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
        return allowedDomains.includes(domain.toLowerCase());
    }

    function validateFio(fio) {
        const wordsLength = fio.split(/\s+/).length;
        const requiredWordsCount = 3;

        if (wordsLength !== requiredWordsCount) {
            return false;
        }

        const charactersRegexp = new RegExp(/^[a-z а-я]*$/, "i");
        return charactersRegexp.test(fio);
    }

    function validatePhone(phone) {
        const phoneRegexp = /^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/;
        const phoneMaxDigitsSum = 30;

        if (!phoneRegexp.test(phone)) {
            return false;
        }

        let phoneDigits = phone.match(/\d/g);
        let phoneDigitsSum = phoneDigits.reduce((a, b) => +a + +b);
        return phoneDigitsSum <= phoneMaxDigitsSum;
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

        if (!validateFio(fioElement.value.trim())) {
            invalidElements.push(fioElement.name);
        }

        if (!validateEmail(emailElement.value.trim())) {
            invalidElements.push(emailElement.name);
        }

        if (!validatePhone(phoneElement.value.trim())) {
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
            data[input.name] = input.value.trim();
        };
        return data;
    }

    function setData(data) {
        for (let input of inputElements) {
            if (data.hasOwnProperty(input.name)) {
                let value = data[input.name];
                input.value = isNil(value) ? "" : value.trim();
            }
        }
    }

    namespace.validate = validate;
    namespace.getData = getData;
    namespace.setData = setData;
    namespace.submit = submit;
}(MyForm);