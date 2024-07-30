document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registration-form');

  const emailInput = document.getElementById('email');
  const zipcodeInput = document.getElementById('zipcode');
  const passwordInput = document.getElementById('password');
  const passwordConfirmInput = document.getElementById('password-confirm');

  const emailValidator = new EmailValidator(emailInput);
  const zipcodeValidator = new ZipcodeValidator(zipcodeInput);
  const passwordValidator = new PasswordValidator(passwordInput);
  const passwordConfirmValidator = new PasswordConfirmValidator(
    passwordInput,
    passwordConfirmInput
  );

  const formValidator = new FormValidator(form);
  formValidator.addValidator(emailValidator);
  formValidator.addValidator(zipcodeValidator);
  formValidator.addValidator(passwordValidator);
  formValidator.addValidator(passwordConfirmValidator);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (formValidator.validate()) {
      document.getElementById('success-message').textContent =
        'High five! All fields are valid.';
    } else {
      document.getElementById('success-message').textContent = '';
    }
  });
});

class FormValidator {
  constructor(formElement) {
    this.formElement = formElement;
    this.validators = [];
  }

  addValidator(validator) {
    this.validators.push(validator);
  }

  validate() {
    let isValid = true;

    this.validators.forEach((validator) => {
      if (!validator.validate()) {
        isValid = false;
        const errorSpan = document.querySelector(
          `#${validator.inputElement.id}-error`
        );
        errorSpan.textContent = validator.getErrorMessage();
        validator.inputElement.classList.add('error');
      } else {
        const errorSpan = document.querySelector(
          `#${validator.inputElement.id}-error`
        );
        errorSpan.textContent = '';
        validator.inputElement.classList.remove('error');
      }
    });

    return isValid;
  }
}

class InputValidator {
  constructor(inputElement) {
    this.inputElement = inputElement;
    this.errorMessage = '';
  }

  validate() {
    if (!this.inputElement.value) {
      this.errorMessage = `${
        this.inputElement.name.charAt(0).toUpperCase() +
          this.inputElement.name.slice(1) || 'Field'
      } is required.`;
      return false;
    }
    return true;
  }

  getErrorMessage() {
    return this.errorMessage;
  }
}

class EmailValidator extends InputValidator {
  constructor(inputElement) {
    super(inputElement);
  }

  validate() {
    if (!super.validate()) {
      return false;
    } else if (!this.inputElement.validity.valid) {
      this.errorMessage = 'Enter a valid email.';
      return false;
    } else {
      this.errorMessage = '';
      return true;
    }
  }
}

class ZipcodeValidator extends InputValidator {
  constructor(inputElement) {
    super(inputElement);
  }

  validate() {
    if (!super.validate()) {
      return false;
    } else if (!/^\d{5}$/.test(this.inputElement.value)) {
      this.errorMessage = 'Enter a valid 5-digit zipcode.';
      return false;
    } else {
      this.errorMessage = '';
      return true;
    }
  }
}

class PasswordValidator extends InputValidator {
  constructor(inputElement) {
    super(inputElement);
  }

  validate() {
    if (!super.validate()) {
      return false;
    } else if (this.inputElement.value.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return false;
    } else {
      this.errorMessage = '';
      return true;
    }
  }
}

class PasswordConfirmValidator extends InputValidator {
  constructor(passwordElement, confirmElement) {
    super(confirmElement);
    this.passwordElement = passwordElement;
  }

  validate() {
    if (!super.validate()) {
      return false;
    } else if (this.inputElement.value !== this.passwordElement.value) {
      this.errorMessage = 'Passwords do not match.';
      return false;
    } else {
      this.errorMessage = '';
      return true;
    }
  }
}
